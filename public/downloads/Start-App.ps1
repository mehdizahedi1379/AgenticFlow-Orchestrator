# NexusAgent - PowerShell Instant Launcher
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       🚀 NexusAgent - Local Agentic Orchestrator (PowerShell Launcher)      " -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "Node.js is not installed. Please install Node.js LTS from https://nodejs.org"
    Read-Host "Press Enter to exit..."
    exit 1
}

$nodeVer = (node -v).Trim()
Write-Host "[OK] Node.js detected: $nodeVer" -ForegroundColor Green

# 2. Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[i] Installing project dependencies with npm install..." -ForegroundColor Cyan
    npm install
}

# 3. Open Browser
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
} | Out-Null

Write-Host "Starting NexusAgent on http://localhost:3000 ..." -ForegroundColor Green
npm run dev
