@echo off
echo ========================================
echo HireMind - Starting Backend and Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend (FastAPI)...
start "HireMind Backend" cmd /k "cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (Next.js)...
start "HireMind Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
