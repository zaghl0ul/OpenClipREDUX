from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
import json
import asyncio
import logging
from datetime import datetime
import uuid
from sqlalchemy.orm import Session
import platform
import sys

# Import our modules
from models.project import Project as ProjectSchema, Clip as ClipSchema, AnalysisRequest
from models.database import Project, Clip, Setting, User
from models.repositories import ProjectRepository, ClipRepository, SettingsRepository, UserRepository, AuditLogRepository
from services.video_processor import VideoProcessor
from services.ai_analyzer import AIAnalyzer
from services.api_manager import APIManager
from utils.security import SecurityManager
from utils.file_manager import FileManager
from utils.db_manager import get_db, init_db
from auth.auth_handler import auth_handler
from auth import auth_routes
from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="OpenClip Pro API",
    description="AI-powered video clipping backend with enterprise security",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.DEBUG else ["openclippro.com", "*.openclippro.com"]
)

# CORS middleware with security
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page", "X-Per-Page"]
)

# Include authentication routes
app.include_router(auth_routes.router)

# Initialize services
video_processor = VideoProcessor()
ai_analyzer = AIAnalyzer()
api_manager = APIManager()
security_manager = SecurityManager()
file_manager = FileManager()

# Audit logging middleware
@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    """Log all API requests for security auditing"""
    start_time = datetime.utcnow()
    
    # Get user from JWT if present
    user_id = None
    try:
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].replace("Bearer ", "")
            payload = auth_handler.decode_token(token)
            user_id = payload.get("user_id")
    except:
        pass
    
    # Process request
    response = await call_next(request)
    
    # Log request (skip health checks and docs)
    if not request.url.path.startswith(("/health", "/api/docs", "/api/redoc")):
        process_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Create audit log asynchronously
        try:
            db = next(get_db())
            AuditLogRepository.create_log(db, {
                "user_id": user_id,
                "action": f"{request.method} {request.url.path}",
                "ip_address": request.client.host if request.client else None,
                "user_agent": request.headers.get("User-Agent"),
                "request_method": request.method,
                "request_path": request.url.path,
                "details": {
                    "status_code": response.status_code,
                    "process_time": process_time
                }
            })
        except:
            pass
    
    return response

# Initialize database
@app.on_event("startup")
async def startup_db_client():
    try:
        init_db()
        logger.info("Database initialized successfully")
        
        # Create default admin user if none exists
        db = next(get_db())
        admin = UserRepository.get_user_by_email(db, "admin@openclippro.com")
        if not admin and settings.ENVIRONMENT == "development":
            admin = UserRepository.create_user(db, {
                "email": "admin@openclippro.com",
                "full_name": "Admin User",
                "hashed_password": auth_handler.get_password_hash("admin123!"),
                "is_active": True,
                "is_verified": True,
                "roles": ["user", "admin"]
            })
            logger.info("Created default admin user")
            
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

# Request/Response Models
class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    type: str  # 'upload' or 'youtube'
    youtube_url: Optional[str] = None

class AnalysisPromptRequest(BaseModel):
    project_id: str
    prompt: str
    provider: Optional[str] = None
    model: Optional[str] = None

class SettingsUpdateRequest(BaseModel):
    category: str  # 'api_keys', 'model_settings', 'app_settings'
    key: str
    value: Any

class APITestRequest(BaseModel):
    provider: str
    api_key: str

class YouTubeURLRequest(BaseModel):
    youtube_url: str

# Health check (public endpoint)
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Check the health status of the backend service and its dependencies
    """
    try:
        # Test database connection
        db_status = "connected"
        db_error = None
        try:
            setting = db.query(Setting).first()
        except Exception as e:
            db_status = "error"
            db_error = str(e)
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "environment": {
                "python": sys.version,
                "platform": platform.platform()
            },
            "database": {
                "status": db_status,
                "error": db_error
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

# Protected endpoints - require authentication
@app.get("/api/providers")
async def get_providers(current_user: User = Depends(auth_handler.get_current_user)):
    """Get all available AI providers"""
    try:
        providers = api_manager.get_providers()
        return {"providers": providers}
    except Exception as e:
        logger.error(f"Error getting providers: {e}")
        raise HTTPException(status_code=500, detail="Failed to get providers")

@app.get("/api/models/{provider}")
async def get_available_models(
    provider: str, 
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Get available models for a provider"""
    try:
        # Get user's API key for the provider
        api_key_setting = SettingsRepository.get_setting(
            db, "api_keys", f"{provider}_key_{current_user.id}"
        )
        
        if not api_key_setting:
            raise HTTPException(
                status_code=400, 
                detail=f"No API key configured for {provider}"
            )
        
        api_key = security_manager.decrypt_value(api_key_setting.value)
        models = await api_manager.get_available_models(provider, api_key, db, security_manager, SettingsRepository)
        
        return {"models": models}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting models: {e}")
        raise HTTPException(status_code=500, detail="Failed to get models")

# Projects endpoints with user ownership
@app.get("/api/projects")
async def get_projects(
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects for current user"""
    try:
        projects = db.query(Project).filter(
            Project.user_id == current_user.id
        ).order_by(Project.created_at.desc()).all()
        
        return {"projects": [project.to_dict() for project in projects]}
    except Exception as e:
        logger.error(f"Error getting projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to get projects")

@app.get("/api/projects/{project_id}")
async def get_project(
    project_id: str,
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"project": project.to_dict()}

@app.post("/api/projects")
async def create_project(
    request: ProjectCreateRequest,
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    try:
        # Check user limits
        project_count = db.query(Project).filter(
            Project.user_id == current_user.id
        ).count()
        
        if project_count >= settings.FREE_TIER_PROJECTS and "pro" not in current_user.roles:
            raise HTTPException(
                status_code=403,
                detail=f"Free tier limited to {settings.FREE_TIER_PROJECTS} projects. Please upgrade."
            )
        
        project_data = {
            "id": str(uuid.uuid4()),
            "name": request.name,
            "description": request.description,
            "type": request.type,
            "youtube_url": request.youtube_url,
            "status": "created",
            "user_id": current_user.id,
            "analysis_prompt": ""
        }
        
        project = ProjectRepository.create_project(db, project_data)
        logger.info(f"Created project: {project.id} for user: {current_user.email}")
        
        return {"project": project.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@app.delete("/api/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Update user storage
        if project.file_size:
            UserRepository.update_storage_used(db, current_user.id, -project.file_size)
        
        # Delete project
        success = ProjectRepository.delete_project(db, project_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete project")
        
        # Clean up files
        file_manager.cleanup_project_files(project_id)
        
        logger.info(f"Deleted project: {project_id} for user: {current_user.email}")
        
        return {"success": True, "message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

# Video upload with size limits
@app.post("/api/projects/{project_id}/upload")
async def upload_video(
    project_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Upload video file for a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Check file type
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Check file size
        if file.size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE // (1024**3)}GB"
            )
        
        # Check user storage limits
        storage_limit = settings.FREE_TIER_STORAGE_GB * 1024 * 1024 * 1024
        if "pro" in current_user.roles:
            storage_limit *= 10  # Pro users get 10x storage
            
        if current_user.storage_used + file.size > storage_limit:
            raise HTTPException(
                status_code=413,
                detail="Storage limit exceeded. Please upgrade or delete old projects."
            )
        
        # Save file
        file_path = await file_manager.save_upload(file, project_id)
        
        # Process video metadata
        video_data = await video_processor.extract_metadata(file_path)
        
        # Update project and user storage
        updates = {
            "video_data": {
                "file_path": file_path,
                "filename": file.filename,
                "size": file.size,
                "duration": video_data.get('duration'),
                "resolution": video_data.get('resolution'),
                "fps": video_data.get('fps')
            },
            "file_size": file.size,
            "status": "uploaded"
        }
        
        updated_project = ProjectRepository.update_project(db, project_id, updates)
        UserRepository.update_storage_used(db, current_user.id, file.size)
        
        logger.info(f"Video uploaded for project: {project_id}")
        
        return {"project": updated_project.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading video: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload video")

# Analysis with rate limiting
@app.post("/api/projects/{project_id}/analyze")
async def analyze_video(
    project_id: str,
    request: AnalysisPromptRequest,
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Start AI analysis of the video"""
    # Check API call limits
    if current_user.api_calls_count >= settings.FREE_TIER_API_CALLS and "pro" not in current_user.roles:
        raise HTTPException(
            status_code=429,
            detail=f"API call limit reached ({settings.FREE_TIER_API_CALLS} calls). Please upgrade."
        )
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.video_data:
        raise HTTPException(status_code=400, detail="No video data available")
    
    try:
        # Update project with analysis prompt
        updates = {
            "analysis_prompt": request.prompt,
            "status": "analyzing",
            "analysis_provider": request.provider,
            "analysis_model": request.model
        }
        updated_project = ProjectRepository.update_project(db, project_id, updates)
        
        # Get API key for provider
        provider = request.provider or "openai"
        api_key_setting = SettingsRepository.get_setting(
            db, "api_keys", f"{provider}_key_{current_user.id}"
        )
        
        if not api_key_setting:
            raise HTTPException(
                status_code=400,
                detail=f"No API key configured for {provider}"
            )
        
        api_key = security_manager.decrypt_value(api_key_setting.value)
        
        # Start analysis (this would be async in production)
        video_path = updated_project.video_data.get("file_path")
        clips_data = await ai_analyzer.analyze_video(
            video_path,
            request.prompt,
            provider,
            api_key
        )
        
        # Create clips in database
        for clip_data in clips_data:
            clip_dict = {
                "project_id": project_id,
                "title": clip_data.get("title"),
                "description": clip_data.get("explanation"),
                "start_time": clip_data.get("start_time"),
                "end_time": clip_data.get("end_time"),
                "duration": clip_data.get("end_time") - clip_data.get("start_time"),
                "score": clip_data.get("score"),
                "analysis_reason": clip_data.get("explanation"),
                "tags": []
            }
            ClipRepository.create_clip(db, clip_dict)
        
        # Update project status and user API calls
        ProjectRepository.update_project(db, project_id, {"status": "completed"})
        UserRepository.increment_api_calls(db, current_user.id)
        
        # Get updated project with clips
        final_project = ProjectRepository.get_project_by_id(db, project_id)
        logger.info(f"Analysis completed for project: {project_id}")
        
        return {"project": final_project.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing video: {e}")
        ProjectRepository.update_project(db, project_id, {"status": "error", "error_message": str(e)})
        raise HTTPException(status_code=500, detail=f"Failed to analyze video: {str(e)}")

# Settings endpoints with user context
@app.get("/api/settings")
async def get_settings(
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user settings"""
    try:
        settings_dict = {
            "model_settings": {},
            "app_settings": {},
            "usage": {
                "storage_used": current_user.storage_used,
                "storage_limit": settings.FREE_TIER_STORAGE_GB * 1024 * 1024 * 1024,
                "api_calls": current_user.api_calls_count,
                "api_limit": settings.FREE_TIER_API_CALLS,
                "projects_count": db.query(Project).filter(Project.user_id == current_user.id).count(),
                "projects_limit": settings.FREE_TIER_PROJECTS
            }
        }
        
        # Get user-specific settings
        user_settings = db.query(Setting).filter(Setting.user_id == current_user.id).all()
        
        for setting in user_settings:
            if setting.category == "model_settings":
                settings_dict["model_settings"][setting.key] = setting.value
            elif setting.category == "app_settings":
                settings_dict["app_settings"][setting.key] = setting.value
        
        return settings_dict
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to get settings")

@app.post("/api/settings/api-key")
async def set_api_key(
    request: APITestRequest,
    current_user: User = Depends(auth_handler.get_current_user),
    db: Session = Depends(get_db)
):
    """Securely store an API key for current user"""
    try:
        # Test the API key first
        validation_result = await api_manager.test_connection(request.provider, request.api_key)
        
        if not validation_result.get("success", False):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid API key for {request.provider}"
            )
        
        # Encrypt and store the key
        encrypted_key = security_manager.encrypt_value(request.api_key)
        
        SettingsRepository.create_or_update_setting(
            db,
            "api_keys",
            f"{request.provider}_key_{current_user.id}",
            encrypted_key
        )
        
        logger.info(f"API key stored for {request.provider} by user {current_user.email}")
        
        return {"success": True, "message": f"API key for {request.provider} stored successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error storing API key: {e}")
        raise HTTPException(status_code=500, detail="Failed to store API key")

# Admin endpoints
@app.get("/api/admin/stats", dependencies=[Depends(auth_handler.require_roles(["admin"]))])
async def get_admin_stats(db: Session = Depends(get_db)):
    """Get system statistics (admin only)"""
    try:
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        total_projects = db.query(Project).count()
        total_clips = db.query(Clip).count()
        
        return {
            "users": {
                "total": total_users,
                "active": active_users
            },
            "projects": {
                "total": total_projects
            },
            "clips": {
                "total": total_clips
            }
        }
    except Exception as e:
        logger.error(f"Error getting admin stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
