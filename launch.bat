@echo off
setlocal EnableDelayedExpansion
title VideoForge Platform - Development Launcher
mode con: cols=90 lines=25
color 0F

echo.
echo ████████████████████████████████████████████████████████████████████████████████████
echo ██                    VIDEOFORGE PLATFORM - DEVELOPMENT LAUNCHER                 ██
echo ████████████████████████████████████████████████████████████████████████████████████
echo.

:: Check prerequisites
echo [1/7] Checking prerequisites...
py --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Install from python.org
    pause && exit
)
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Install from nodejs.org  
    pause && exit
)
echo ✅ Prerequisites validated

:: Setup backend
echo [2/7] Configuring backend environment...
pushd backend
if not exist venv (
    echo   Creating Python virtual environment...
    py -m venv venv
)
call venv\Scripts\activate.bat
if not exist .env (
    copy .env.example .env >nul 2>&1
    echo   Environment config created from template
)
echo   Installing Python dependencies...
pip install -q --disable-pip-version-check -r requirements.txt
echo   Initializing database...
py -c "from utils.db_manager import init_db; init_db()" >nul 2>&1
echo ✅ Backend configured

:: Setup frontend
echo [3/7] Configuring frontend environment...
popd
if not exist node_modules (
    echo   Installing Node.js dependencies...
    npm install --silent
) else (
    echo   Validating Node.js dependencies...
    npm ci --silent >nul 2>&1
)
echo ✅ Frontend configured

:: Start backend
echo [4/7] Starting FastAPI backend server...
pushd backend
start "VideoForge Backend" /min cmd /k "title Backend Server && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"
popd

:: Wait for backend
echo [5/7] Waiting for backend initialization...
set /a counter=0
:wait_backend
timeout /t 2 /nobreak >nul
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    set /a counter+=2
    if !counter! geq 30 (
        echo ❌ Backend failed to start within 30 seconds
        goto cleanup
    )
    goto wait_backend
)
echo ✅ Backend server operational

:: Start frontend
echo [6/7] Starting Vite development server...
start "VideoForge Frontend" /min cmd /k "title Frontend Server && npm run dev"

:: Launch application
echo [7/7] Launching VideoForge Platform...
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ████████████████████████████████████████████████████████████████████████████████████
echo ██                               PLATFORM READY                                  ██
echo ██                                                                              ██
echo ██  Frontend: http://localhost:3000                                            ██
echo ██  Backend:  http://localhost:8000                                            ██
echo ██  API Docs: http://localhost:8000/api/docs                                   ██
echo ██                                                                              ██
echo ██  Glass physics system active with magnetic timeline                         ██
echo ████████████████████████████████████████████████████████████████████████████████████
echo.
echo Press any key to shutdown all services...
pause >nul

:cleanup
echo Shutting down services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /pid %%a /f >nul 2>&1
echo Services stopped.
timeout /t 2 /nobreak >nul