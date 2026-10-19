@echo off
title NexusAgent - Local Windows & EDA Orchestrator
color 0B
cls
echo ========================================================
echo   NexusAgent - Local Windows & EDA Orchestrator
echo   Altium Designer & Proteus 8 VSM Bridge Active
echo ========================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [!] Node.js was not found on your system.
    echo [*] Attempting automated installation via Windows Package Manager (winget)...
    echo.
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Please install Node.js manually from: https://nodejs.org
        echo Then run this file again.
        echo.
        pause
        exit /b 1
    )
    echo [*] Node.js installed successfully!
)

:: 2. Create Workspace Directory
if not exist "C:\NexusAgent\Workspace" (
    echo [*] Creating workspace at C:\NexusAgent\Workspace...
    mkdir "C:\NexusAgent\Workspace" 2>nul
)

:: 3. Start NexusAgent Daemon
echo [*] Launching NexusAgent Daemon on http://127.0.0.1:3000...
start "" "http://127.0.0.1:3000"
node "%~dp0nexus-agent-daemon.mjs"
pause
