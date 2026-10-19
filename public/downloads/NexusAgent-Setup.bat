@echo off
title NexusAgent - 1-Click Windows Setup
color 0A
cls
echo ========================================================
echo   NexusAgent - 1-Click Windows Setup & Desktop Link
echo ========================================================
echo.

set "INSTALL_DIR=%LOCALAPPDATA%\NexusAgent"
set "WORKSPACE_DIR=C:\NexusAgent\Workspace"

echo [1/4] Creating installation directories...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%WORKSPACE_DIR%" mkdir "%WORKSPACE_DIR%"
echo       Target: %INSTALL_DIR%
echo       Workspace: %WORKSPACE_DIR%

echo.
echo [2/4] Copying NexusAgent files...
copy /Y "%~dp0nexus-agent-daemon.mjs" "%INSTALL_DIR%\" >nul
copy /Y "%~dp0Run-NexusAgent.bat" "%INSTALL_DIR%\" >nul

echo.
echo [3/4] Creating Desktop Shortcut...
powershell -NoProfile -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'NexusAgent.lnk')); $Shortcut.TargetPath = '%INSTALL_DIR%\Run-NexusAgent.bat'; $Shortcut.WorkingDirectory = '%WORKSPACE_DIR%'; $Shortcut.Description = 'NexusAgent - Local Windows & EDA Orchestrator'; $Shortcut.Save()"
echo       Desktop shortcut created successfully!

echo.
echo [4/4] Detecting EDA / CAD Software...
reg query "HKLM\SOFTWARE\Altium" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo       [+] Altium Designer detected on this machine!
) else (
    echo       [-] Altium Designer registry key not found (Bridge will activate when project opens).
)

reg query "HKLM\SOFTWARE\Labcenter Electronics" >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo       [+] Proteus 8 Professional detected on this machine!
) else (
    echo       [-] Proteus VSM registry key not found (Bridge will activate when project opens).
)

echo.
echo ========================================================
echo   Setup Complete! Launching NexusAgent...
echo ========================================================
start "" "%INSTALL_DIR%\Run-NexusAgent.bat"
timeout /t 3 >nul
exit /b 0
