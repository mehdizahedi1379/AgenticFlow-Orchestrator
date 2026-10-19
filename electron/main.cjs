/**
 * NexusAgent Desktop - Electron Main Process for Windows
 * Provides local OS hardware access, PowerShell runner IPC, and guardrails.
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'NexusAgent Windows Harness',
    frame: true, // Native Windows 11 title bar & controls
    backgroundColor: '#09090b',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// IPC: Safe PowerShell Execution Bridge
ipcMain.handle('windows:exec-powershell', async (event, { command, requireApproval }) => {
  if (requireApproval) {
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'warning',
      buttons: ['Authorize Execution', 'Cancel & Block'],
      defaultId: 1,
      title: 'Windows Security Guardrail - Approval Required',
      message: 'NexusAgent requests permission to execute PowerShell command:',
      detail: command,
    });

    if (response !== 0) {
      return { success: false, stderr: 'Execution blocked by user security guardrail policy.' };
    }
  }

  return new Promise((resolve) => {
    const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command]);
    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ps.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ps.on('close', (code) => {
      resolve({ success: code === 0, exitCode: code, stdout, stderr });
    });
  });
});

// IPC: Query Local Windows System Diagnostics
ipcMain.handle('windows:get-system-info', async () => {
  const os = require('os');
  return {
    platform: process.platform,
    arch: process.arch,
    release: os.release(),
    totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
    freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
    cpus: os.cpus().length,
    workingDirectory: process.cwd(),
  };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
