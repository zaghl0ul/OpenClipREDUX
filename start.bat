@echo off
setlocal EnableDelayedExpansion
title VideoForge Platform - One-Click Deployment
mode con: cols=100 lines=30
color 0F

echo.
echo ██████████████████████████████████████████████████████████████████████████████████████████
echo ██                                                                                      ██
echo ██                     VIDEOFORGE PLATFORM - ONE-CLICK DEPLOYMENT                     ██
echo ██                                                                                      ██
echo ██████████████████████████████████████████████████████████████████████████████████████████
echo.
echo Initializing full-stack deployment...
echo.

:: Configuration
set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0"

:: Validate requirements
echo [1/6] Validating environment...
py --version >nul 2>&1 || (echo ERROR: Python not found. Install from python.org && pause && exit)
node --version >nul 2>&1 || (echo ERROR: Node.js not found. Install from nodejs.org && pause && exit)
echo ✓ Environment validated

:: Backend setup
echo [2/6] Setting up backend...
pushd "%BACKEND_DIR%"
if not exist "venv" py -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet --disable-pip-version-check
if not exist ".env" copy .env.example .env >nul 2>&1
py -c "from utils.db_manager import init_db; init_db()" >nul 2>&1
echo ✓ Backend configured

:: Frontend setup  
echo [3/6] Setting up frontend...
popd
pushd "%FRONTEND_DIR%"
if not exist "node_modules" npm install --silent
echo ✓ Frontend configured

:: Start services
echo [4/6] Starting backend service...
pushd "%BACKEND_DIR%"
start "VideoForge Backend" /min cmd /k "title VideoForge Backend && venv\Scripts\activate.bat && py main.py"
popd

echo [5/6] Starting frontend service...
start "VideoForge Frontend" /min cmd /k "title VideoForge Frontend && npm run dev"

:: Wait and launch
echo [6/6] Launching application...
timeout /t 15 /nobreak >nul 2>&1

echo.
echo ██████████████████████████████████████████████████████████████████████████████████████████
echo ██                                                                                      ██
echo ██                              DEPLOYMENT COMPLETE                                     ██
echo ██                                                                                      ██
echo ██   Backend:  http://localhost:8000                                                   ██
echo ██   Frontend: http://localhost:3000                                                   ██
echo ██   Docs:     http://localhost:8000/api/docs                                          ██
echo ██                                                                                      ██
echo ██████████████████████████████████████████████████████████████████████████████████████████
echo.

start http://localhost:3000
echo Platform is running! Press any key to shutdown services...
pause >nul

:: Cleanup
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 2^>nul') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do taskkill /pid %%a /f >nul 2>&1
echo Services stopped. Goodbye!
timeout /t 2 /nobreak >nul 2>&1