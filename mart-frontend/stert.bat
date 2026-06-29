@echo off
echo ============================================
echo   Blinkit - Starting Backend + Frontend
echo ============================================

echo.
echo [1/2] Starting FastAPI backend on port 9000...
start "Blinkit Backend" cmd /k "cd /d %~dp0blinkit_backend && uvicorn app.main:app --reload --port 9000"

timeout /t 3 /nobreak > nul

echo [2/2] Starting React frontend on port 3000...
start "Blinkit Frontend" cmd /k "cd /d %~dp0blinkit-frontend && npm run dev"

echo.
echo Both servers are starting...
echo   Backend:  http://localhost:9000/docs
echo   Frontend: http://localhost:3000
echo.
timeout /t 5 /nobreak > nul
start http://localhost:3000
