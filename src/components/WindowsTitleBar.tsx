import React, { useState } from 'react';
import {
  Cpu,
  RotateCcw,
  Activity,
  PanelLeft,
  ShieldCheck,
  CircuitBoard,
  X,
  Lock,
  FolderLock,
  Terminal,
  Globe,
  Download,
} from 'lucide-react';
import type { OrchestratorSession } from '../types/agent.ts';

interface WindowsTitleBarProps {
  session: OrchestratorSession;
  geminiConnected: boolean;
  onReset: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSwitchToWebsite?: () => void;
  onSwitchToApp?: () => void;
  onSwitchToPythonInstaller?: () => void;
  onDownloadExe?: () => void;
  activeView?: 'app' | 'website' | 'python-installer';
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  session,
  geminiConnected,
  onReset,
  sidebarOpen,
  onToggleSidebar,
  onSwitchToWebsite,
  onSwitchToApp,
  onSwitchToPythonInstaller,
  onDownloadExe,
  activeView = 'app',
}) => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showEdaModal, setShowEdaModal] = useState(false);

  return (
    <>
      <header className="bg-[#0b0f17] border-b border-[#1e293b] px-3.5 py-2.5 flex items-center justify-between select-none text-xs text-slate-300">
        {/* Brand & Sidebar Toggle */}
        <div className="flex items-center space-x-2.5">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              sidebarOpen
                ? 'bg-sky-950/60 border-sky-700/60 text-sky-300'
                : 'bg-[#111827] border-[#1e293b] text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={sidebarOpen ? 'Close Conversation History' : 'Open Conversation History'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-600/30">
            <Cpu className="w-4 h-4 text-white" />
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-100 tracking-tight text-sm">
              NexusAgent
            </span>
            <span className="text-slate-600 font-light">•</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Local Agentic Orchestrator
            </span>
          </div>

          {/* Engine status indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-[#111827] border border-[#1e293b] text-slate-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                geminiConnected ? 'bg-emerald-400' : 'bg-sky-400'
              } animate-pulse`}
            />
            <span className="font-mono text-[11px]">
              {geminiConnected ? 'Gemini AI Active' : 'Local Engine Active'}
            </span>
          </div>
        </div>

        {/* Status badges & actions */}
        <div className="flex items-center space-x-2">
          {/* Windows Security Status Pill */}
          <button
            onClick={() => setShowSecurityModal(true)}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-300 text-[11px] transition-colors cursor-pointer"
            title="Inspect Windows Security Sandbox and UAC Least-Privilege Guardrails"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Windows Guard: Safe</span>
          </button>

          {/* EDA CAD Bridge Pill */}
          <button
            onClick={() => setShowEdaModal(true)}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/40 text-sky-300 text-[11px] transition-colors cursor-pointer"
            title="View Altium & Proteus Software Interoperability"
          >
            <CircuitBoard className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium">EDA: Altium & Proteus</span>
          </button>

          {session.status === 'running' && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/40 text-sky-300 text-[11px] font-mono">
              <Activity className="w-3 h-3 text-sky-400 animate-spin" />
              <span>Running Cycle {session.currentStep}</span>
            </div>
          )}

          {/* Python Installer Hub Button */}
          {onSwitchToPythonInstaller && (
            <button
              onClick={onSwitchToPythonInstaller}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'python-installer'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/60'
              }`}
              title="Automated Windows Setup via Python (install_windows.py)"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Python Setup</span>
            </button>
          )}

          {/* Switch to Live Agent / Workspace Button */}
          {onSwitchToApp && activeView !== 'app' && (
            <button
              onClick={onSwitchToApp}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs cursor-pointer"
              title="Switch to Live Agent Studio"
            >
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Agent Studio</span>
            </button>
          )}

          {/* Switch to Website Button */}
          {onSwitchToWebsite && activeView !== 'website' && (
            <button
              onClick={onSwitchToWebsite}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 transition-colors text-xs cursor-pointer"
              title="Return to Product Showcase Website"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Overview</span>
            </button>
          )}

          {/* Quick Windows Package Download Button */}
          {onDownloadExe && (
            <button
              onClick={onDownloadExe}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-white bg-sky-600 hover:bg-sky-500 shadow-sm shadow-sky-600/30 transition-colors text-xs font-medium cursor-pointer"
              title="Download Windows Setup Package (.zip)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download ZIP</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-colors text-xs cursor-pointer"
            title="Reset Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Windows Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-lg w-full p-5 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Windows Security Architecture & Sandbox</span>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 py-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                NexusAgent operates under a strict <strong className="text-emerald-300">Zero Trust Windows Security Model</strong> to guarantee it never encounters privilege or safety issues on Microsoft Windows systems.
              </p>

              <div className="space-y-2.5 bg-[#090d16] p-3.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-emerald-300 font-semibold">UAC Least-Privilege (Medium Integrity):</span>
                    <p className="text-slate-400 mt-0.5 font-sans">
                      Agent runs strictly as a Standard User. It does not request or require Administrator elevation, eliminating OS compromise risks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sky-300 font-semibold">Command Injection Shield:</span>
                    <p className="text-slate-400 mt-0.5 font-sans">
                      Destructive commands (<code className="text-rose-300">format</code>, <code className="text-rose-300">del /f /s C:\</code>, <code className="text-rose-300">reg delete</code>, and remote memory pipes) are strictly blocked by guardrail inspection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FolderLock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-300 font-semibold">System32 Directory Protection:</span>
                    <p className="text-slate-400 mt-0.5 font-sans">
                      System files, Windows roots, and Program Files are read-only protected. Output is confined to isolated workspace directories (<code className="text-amber-200">C:\NexusAgent\Workspace</code>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Windows Defender Friendly: Clean Text Scripts (No Base64 obfuscation)</span>
                <span className="text-emerald-400 font-mono">100% Protected</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDA CAD Interoperability Modal */}
      {showEdaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-lg w-full p-5 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
                <CircuitBoard className="w-5 h-5" />
                <span>Altium Designer & Proteus VSM Interoperability</span>
              </div>
              <button
                onClick={() => setShowEdaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 py-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                NexusAgent provides native tooling and script automation to integrate seamlessly with standard Windows engineering software:
              </p>

              <div className="space-y-2.5 bg-[#090d16] p-3.5 rounded-xl border border-slate-800 font-sans text-xs">
                <div className="border-b border-slate-800/80 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sky-300">Altium Designer (DXP.EXE):</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">DelphiScript / Python</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Autonomous generation of DelphiScript (<code className="text-sky-300">.pas</code>) & Python macros for batch DRC clearance audits, component annotation, Telesis netlist export, and BOM generation.
                  </p>
                </div>

                <div className="border-b border-slate-800/80 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sky-300">Proteus 8 Professional (ISIS & ARES):</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">VSM DScript</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Converts Altium netlists into Proteus ISIS schematic models and executes automated VSM simulation scripts (<code className="text-sky-300">.dscript</code>) for MCU firmware co-simulation (STM32, PIC, AVR, 8051).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sky-300">Windows Interop (CLI / COM / IPC):</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">OLE Automation</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Works with KiCad, AutoCAD, MATLAB, and SolidWorks via Windows COM/OLE automation and headless command-line execution.
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                You can instruct the agent in the chat box, e.g.: <em className="text-slate-200">"Generate Altium script to export BOM and check DRC"</em> or <em className="text-slate-200">"Convert Altium netlist to Proteus VSM for STM32 simulation"</em>.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEdaModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
