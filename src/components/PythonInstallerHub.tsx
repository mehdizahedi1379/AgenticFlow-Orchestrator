import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Play,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  FolderArchive,
  Laptop,
} from 'lucide-react';

interface PythonInstallerHubProps {
  onLaunchWebAgent?: () => void;
}

export const PythonInstallerHub: React.FC<PythonInstallerHubProps> = ({
  onLaunchWebAgent,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'installer' | 'runner' | 'builder'>('installer');
  const [downloading, setDownloading] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    setDownloading(filename);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
        setDownloading(null);
      }, 1000);
    } catch (err) {
      window.location.href = url;
      setDownloading(null);
    }
  };

  const codeSnippets = {
    installer: `import os, sys, subprocess, shutil, platform, time, urllib.request, webbrowser

# 1. Resolve and verify Node.js & npm (refreshes Windows Registry PATH)
# Automatically downloads and installs Node.js LTS via winget or official MSI if missing.

# 2. Install project dependencies
subprocess.run("npm install", shell=True, check=True)

# 3. Compile production bundle
subprocess.run("npm run build", shell=True, check=True)

# 4. Create Windows Desktop Shortcut (NexusAgent.lnk)
# (Automatically generates Desktop shortcut with custom icon)

# 5. Launch local server and open browser at http://localhost:3000
webbrowser.open("http://localhost:3000")
subprocess.run("npm run dev", shell=True)`,

    runner: `import os, subprocess, platform, time, webbrowser, threading

# Clean Python Local Runtime Daemon & Monitor
def open_browser():
    time.sleep(2)
    webbrowser.open("http://localhost:3000")

threading.Thread(target=open_browser, daemon=True).start()
subprocess.run("npm run dev", shell=(platform.system() == "Windows"))`,

    builder: `import os, subprocess, platform

# Package Standalone Windows NSIS Installer (.EXE)
subprocess.run("npm run build", shell=True, check=True)
subprocess.run("npx electron-builder --win nsis", shell=True, check=True)
print("[✓] Standalone Setup.exe generated in dist/ folder!")`,
  };

  const cmdRunScript = 'python install_windows.py';
  const cmdDownloadRun = 'curl -O http://localhost:3000/install_windows.py && python install_windows.py';

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8 animate-fade-in text-left">
      {/* Hero / Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#0a0f1d] to-[#080c16] border border-sky-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Automated Windows Setup via Python (Python 3.8+)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Windows Setup & Installation via <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Python Script</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Use <code className="text-amber-300 font-mono">install_windows.py</code> to automatically configure dependencies, install Node.js if missing, build production bundles, generate a Desktop shortcut, and launch the application on Windows 10/11.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero external pip dependencies (Standard Python Library only)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Automatic Node.js LTS detection and installation
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Creates Windows Desktop shortcut (NexusAgent.lnk)
              </span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 sm:p-6 lg:w-80 shrink-0 space-y-3.5 shadow-xl">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
              <span>Script Downloads</span>
              <span className="text-emerald-400">Windows Ready</span>
            </div>

            <button
              onClick={() => handleDownloadFile('/install_windows.py', 'install_windows.py')}
              className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{downloading === 'install_windows.py' ? 'Downloading...' : 'Download install_windows.py'}</span>
            </button>

            <button
              onClick={() => handleDownloadFile('/api/download/NexusAgent-Source-VSCode.zip', 'NexusAgent-Project-Source.zip')}
              className="w-full py-2.5 px-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-sky-400" />
              <span>Download Full Source (.ZIP)</span>
            </button>

            {onLaunchWebAgent && (
              <button
                onClick={onLaunchWebAgent}
                className="w-full py-2.5 px-3 text-xs font-medium text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-950/70 border border-sky-800/60 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-sky-400" />
                <span>Launch Web Agent Live</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Steps Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-sky-500/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 text-sm font-bold flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="text-base font-bold text-white mb-2">Download Source or Script</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Download and extract the full project archive, or place <code className="text-sky-300 font-mono">install_windows.py</code> inside your project directory.
          </p>
          <div className="text-[11px] font-mono text-slate-400 bg-black/40 p-2.5 rounded-lg border border-slate-800">
            NexusAgent-Project/
            <div className="text-emerald-400 ml-2">├── install_windows.py</div>
            <div className="text-slate-500 ml-2">├── run_nexus.py</div>
            <div className="text-slate-500 ml-2">└── package.json</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="text-base font-bold text-white mb-2">Run in Terminal</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Open Command Prompt or PowerShell in the project directory and execute the script:
          </p>
          <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs text-emerald-300">
            <code>{cmdRunScript}</code>
            <button
              onClick={() => copyToClipboard(cmdRunScript, 'run_cmd')}
              className="p-1 hover:text-white text-slate-400 transition-colors"
              title="Copy Command"
            >
              {copiedId === 'run_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-bold flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="text-base font-bold text-white mb-2">Automatic Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            The script validates Node.js, runs npm install, generates a Windows Desktop shortcut, and boots the orchestrator on port 3000.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Local URL: http://localhost:3000</span>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs & 1-Liner Quick Install */}
      <div className="bg-[#0b101c] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 bg-[#090d18] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Python Script Source Code
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCodeTab('installer')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                activeCodeTab === 'installer'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              install_windows.py
            </button>
            <button
              onClick={() => setActiveCodeTab('runner')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                activeCodeTab === 'runner'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              run_nexus.py
            </button>
            <button
              onClick={() => setActiveCodeTab('builder')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                activeCodeTab === 'builder'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              build_windows_exe.py
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="p-5 font-mono text-xs text-slate-300 bg-[#060911] overflow-x-auto relative">
          <button
            onClick={() => copyToClipboard(codeSnippets[activeCodeTab], 'snippet')}
            className="absolute top-4 right-4 px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer z-10"
          >
            {copiedId === 'snippet' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Python Code</span>
              </>
            )}
          </button>

          <pre className="text-slate-300 leading-relaxed font-mono">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>

        {/* Terminal 1-Liner Helper Footer */}
        <div className="p-4 bg-[#0a0e1a] border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-slate-400">Quick 1-Liner Download & Run (PowerShell):</span>
          </div>
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 text-sky-300 font-mono truncate max-w-full sm:max-w-md">
            <span className="truncate select-all">{cmdDownloadRun}</span>
            <button
              onClick={() => copyToClipboard(cmdDownloadRun, 'curl_cmd')}
              className="p-1 hover:text-white text-slate-400 transition-colors shrink-0"
              title="Copy"
            >
              {copiedId === 'curl_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Checklist & Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Windows Security & Execution Reliability</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Standard User Privileges:</strong> Operates cleanly without requiring administrator privileges or triggering unrequested UAC elevation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>No Windows SmartScreen Block:</strong> Standard Python scripts avoid the binary architecture rejection issues common with unsigned web-downloaded executables.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>EDA Engineering Integration:</strong> Native COM bridges for Altium Designer and Proteus 8 VSM.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <Laptop className="w-4 h-4 text-sky-400" />
            <span>Included Windows Package Launchers</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
              <div className="text-emerald-400 font-semibold mb-1">install_windows.py</div>
              <div className="text-[11px] text-slate-400">Automated Python installer</div>
            </div>
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
              <div className="text-sky-400 font-semibold mb-1">run_nexus.py</div>
              <div className="text-[11px] text-slate-400">Runtime daemon & monitor</div>
            </div>
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
              <div className="text-purple-400 font-semibold mb-1">build_windows_exe.py</div>
              <div className="text-[11px] text-slate-400">Native EXE builder</div>
            </div>
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
              <div className="text-amber-400 font-semibold mb-1">1-Click-Run.bat</div>
              <div className="text-[11px] text-slate-400">Standalone batch launcher</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
