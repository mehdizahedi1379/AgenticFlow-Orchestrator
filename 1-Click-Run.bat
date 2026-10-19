@echo off
title NexusAgent - 1-Click Launch & Run
color 0B

echo ==============================================================================
echo                 NexusAgent - Local Agentic Orchestrator
echo                       1-Click Automated Launcher
echo ==============================================================================
echo.

:: 1. Check Node.js
echo [1/3] Checking Node.js runtime environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [!] Node.js was not found on this system.
    echo Attempting automatic installation via Windows Package Manager...
    echo.
    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo Command: winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        echo.
        echo [OK] Node.js installed. Please close this window and run 1-Click-Run.bat again.
        pause
        exit /b
    ) else (
        echo Please install Node.js manually from: https://nodejs.org
        echo.
        pause
        exit /b
    )
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [OK] Node.js detected: %NODE_VERSION%
echo.

:: 2. Check and install dependencies
echo [2/3] Checking project dependencies...
if not exist "node_modules\" (
    echo [i] Project packages not installed yet. Running npm install...
    echo Please wait a moment...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [!] Error running npm install!
        pause
        exit /b
    )
    echo [OK] Dependencies installed successfully.
) else (
    echo [OK] Dependencies ready.
)
echo.

:: 3. Open browser and start application
echo [3/3] Starting local server and opening browser...
echo.
echo ==============================================================================
echo   Web Application URL:  http://localhost:3000
echo   To stop the server:   Press Ctrl + C in this window
echo ==============================================================================
echo.

start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

call npm run dev

pause
