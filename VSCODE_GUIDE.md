# 🚀 NexusAgent - VS Code Quickstart & Windows EXE Build Guide

Welcome! This guide outlines how to open, develop, test, and compile **NexusAgent** locally in Visual Studio Code on Windows.

## 📌 Prerequisites
1. **Node.js** v18+ or v20+ LTS ([nodejs.org](https://nodejs.org))
2. **Visual Studio Code** ([code.visualstudio.com](https://code.visualstudio.com))
3. Windows 10 or 11 (64-bit)

---

## ⚡ Quick Steps

### 1. Open in VS Code
Extract the source archive and open the project directory in VS Code:
```powershell
code .
```

### 2. Install Dependencies
Open terminal (`Ctrl + ~`) and run:
```powershell
npm install
```

### 3. Launch in Development Mode
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build Real Windows .EXE Installer
To build an authentic native Windows installer using Electron and NSIS:
```powershell
npm install --save-dev electron electron-builder
npm run build:exe
```
The installer will be generated in `dist_electron/NexusAgent Windows Harness Setup 2.4.0.exe`.

### 5. Run the Local Native Agent Daemon
If you prefer running the lightweight local daemon without Electron:
```powershell
node public/downloads/nexus-agent-daemon.mjs
```
or double-click `Run-NexusAgent.bat` in Windows Explorer.
