@echo off
setlocal
cd /d "%~dp0"
title Military Services Portal

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js and npm are required. Install the current Node.js LTS version first.
  pause
  exit /b 1
)

if not exist "backend\node_modules\express" (
  echo Installing backend dependencies...
  call npm install --prefix backend
  if errorlevel 1 goto :failed
)

if not exist "backend\node_modules\multer" (
  echo Updating backend dependencies...
  call npm install --prefix backend
  if errorlevel 1 goto :failed
)

if not exist "frontend\node_modules\vite" (
  echo Installing frontend dependencies...
  call npm install --prefix frontend
  if errorlevel 1 goto :failed
)

if not exist "backend\.env" (
  copy "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env. Please check MONGO_URI and JWT_SECRET, then run this file again.
  notepad "backend\.env"
  pause
  exit /b 0
)

echo Building frontend...
call npm run build
if errorlevel 1 goto :failed

start "Military Services API" /D "%~dp0backend" cmd /k "npm start"
timeout /t 4 /nobreak >nul
start "" "http://localhost:1234"
exit /b 0

:failed
echo.
echo The setup or build step failed. Review the error above.
pause
exit /b 1
