@echo off
title NexusAgent - Build Windows Installer (.EXE)
color 0A

echo ==============================================================================
echo                 NexusAgent - Windows Installer Builder (.EXE)
echo ==============================================================================
echo.

:: 1. Check Node.js
echo [1/4] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b
)
echo [OK] Compiler environment ready.
echo.

:: 2. Check dependencies
echo [2/4] Verifying dependencies...
if not exist "node_modules\" (
    echo [i] Installing dependencies...
    call npm install
)
echo.

:: 3. Compile frontend bundle
echo [3/4] Compiling web production bundle (Vite Build)...
call npm run build
if %errorlevel% neq 0 (
    echo [!] Build error in frontend!
    pause
    exit /b
)
echo [OK] Frontend compilation succeeded.
echo.

:: 4. Package Windows NSIS Installer
echo [4/4] Packaging NSIS installer (.exe)...
call npx electron-builder --win nsis
if %errorlevel% neq 0 (
    echo [!] Electron builder error.
    pause
    exit /b
)

echo.
echo ==============================================================================
echo   Installer built successfully!
echo   Output folder: dist/ or dist-electron/
echo   Setup file: NexusAgent Setup.exe
echo ==============================================================================
echo.

if exist "dist-electron\" (
    explorer dist-electron
) else if exist "dist\" (
    explorer dist
)

pause
