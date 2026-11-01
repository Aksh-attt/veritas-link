# VeritasLink Windows Startup Script (PowerShell)
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "  VERITASLINK — Agentic AI Phishing Forensics Platform" -ForegroundColor Yellow
Write-Host "  Don't Just Scan the Link. Investigate It." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta

# Check Python
$pythonVersion = python --version 2>&1
Write-Host "Detected: $pythonVersion" -ForegroundColor Gray

# Start Backend server in separate window
Write-Host "Starting FastAPI Forensics Backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; Write-Host '--- VERITASLINK BACKEND ---' -ForegroundColor Magenta; python run.py"

# Start Frontend Vite dev server in separate window
Write-Host "Starting React + Vite Frontend on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host '--- VERITASLINK FRONTEND ---' -ForegroundColor Yellow; npm run dev"

Write-Host "`nAll services launched!" -ForegroundColor Green
Write-Host "• Frontend UI:           http://localhost:3000" -ForegroundColor Cyan
Write-Host "• FastAPI Backend:       http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "• Interactive API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "• Phishing Simulations:  http://127.0.0.1:8000/simulations/electricity/portal" -ForegroundColor Cyan

