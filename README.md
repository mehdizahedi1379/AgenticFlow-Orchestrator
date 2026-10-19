# 🚀 NexusAgent - Local Agentic Orchestrator for Windows & EDA

Welcome! This package includes the complete source code for NexusAgent alongside automated Python and Windows setup utilities.

---

## 🐍 Method 1 (Recommended): Python Automated Installer (`install_windows.py`)

The script **`install_windows.py`** is located in the root of this folder. In your terminal or Visual Studio Code, execute:

```bash
python install_windows.py
```

### What this script handles automatically:
1. **Node.js Environment Validation & Auto-Setup:** Inspects system PATH, registry, and common directories. If missing, attempts automatic setup via winget or official MSI installer.
2. **Project Dependencies:** Runs `npm install` automatically with offline fail-safes.
3. **Production Optimization:** Compiles client and server bundles.
4. **Desktop Shortcut:** Creates a Windows Desktop shortcut (`NexusAgent.lnk`).
5. **Live Launch:** Starts the local orchestrator and opens `http://localhost:3000` in your default browser.

> 💡 **Note:** Uses only standard built-in Python standard libraries. No extra `pip install` commands required.

---

## ⚡ Method 2: Zero-Configuration 1-Click Launchers

In the root folder:
- **`1-Click-Run.bat`**: Double-click to automatically verify dependencies and launch the app in your browser.
- **`Build-Installer-EXE.bat`**: Generates a native NSIS Windows setup installer (`NexusAgent Setup.exe`) in the `dist` folder.

---

## 🛠 Method 3: Development & Execution in Visual Studio Code

1. Open this folder in **VS Code** (`code .`).
2. Open the integrated terminal (`Ctrl + ~`) and run:
   ```bash
   npm install
   npm run dev
   ```
3. To build a standalone Windows EXE installer:
   ```bash
   npm run build:exe
   ```

---

## 📁 Key Files & Architecture
- `install_windows.py`: Automated Python environment installer and launcher for Windows
- `run_nexus.py`: Lightweight Python local daemon and browser monitor
- `build_windows_exe.py`: Python helper to build native Windows EXE installers
- `1-Click-Run.bat`: Windows batch launcher
- `Build-Installer-EXE.bat`: Windows batch installer generator
- `src/`: Complete React TypeScript frontend and mission control UI
- `server.ts`: Local Express bridge communicating with EDA tools (Altium Designer & Proteus)
- `Dockerfile` & `docker-compose.yml`: Containerized deployment support