@echo off
title VeritasLink Launcher
echo ==========================================================
echo   VERITASLINK - Agentic AI Phishing Forensics Platform
echo   Don't Just Scan the Link. Investigate It.
echo ==========================================================

echo Starting Backend on http://127.0.0.1:8000 ...
start "VeritasLink Backend" cmd /k "cd /d "%~dp0backend" && python run.py"

echo Starting Frontend on http://localhost:3000 ...
start "VeritasLink Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All services launching in separate terminal windows.
echo Frontend UI:  http://localhost:3000
echo Backend API:  http://127.0.0.1:8000
echo.
pause

