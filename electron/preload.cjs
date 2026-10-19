/**
 * NexusAgent Windows Desktop Preload Bridge
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowsAgentAPI', {
  isElectron: true,
  execPowerShell: (command, requireApproval = true) =>
    ipcRenderer.invoke('windows:exec-powershell', { command, requireApproval }),
  getSystemInfo: () =>
    ipcRenderer.invoke('windows:get-system-info'),
});
