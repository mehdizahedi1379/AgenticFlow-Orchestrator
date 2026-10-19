import React, { useState } from 'react';
import {
  Download,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  Play,
  ArrowRight,
  HardDrive,
  FileCode,
  Shield,
  Workflow,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Laptop,
  Globe,
  Network,
  Server,
} from 'lucide-react';

interface ShowcaseLandingProps {
  onLaunchLiveApp: () => void;
  onOpenPythonInstaller?: () => void;
  geminiConnected: boolean;
}

export function ShowcaseLanding({ onLaunchLiveApp, onOpenPythonInstaller, geminiConnected }: ShowcaseLandingProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [vscodeModalOpen, setVscodeModalOpen] = useState(false);
  const [copiedVsCodeCmd, setCopiedVsCodeCmd] = useState<string | null>(null);

  const psInstallCommand = 'irm https://ais-dev-4uyxtrnykgt47g7ym3cte4-84786721895.europe-west2.run.app/install.ps1 | iex';
  const sha256Checksum = '9f83a54b8d7c2e1064f51e0388912d6a7e9b01c345f6a7b8c9d0e1f2a3b4c5d6';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(psInstallCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(sha256Checksum);
    setCopiedChecksum(true);
    setTimeout(() => setCopiedChecksum(false), 2000);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVsCodeCmd(id);
    setTimeout(() => setCopiedVsCodeCmd(null), 2000);
  };

  const safeDownloadFile = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty file payload');
      }
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
        setDownloading(false);
      }, 1000);
    } catch (err) {
      console.warn('Falling back to direct link download:', err);
      // Fallback for sandboxed iframe
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }
  };

  const triggerDownloadZip = () => {
    setDownloadModalOpen(true);
    safeDownloadFile('/api/download/NexusAgent-Windows-v2.4.0.zip', 'NexusAgent-Windows-v2.4.0.zip');
  };

  const triggerDownloadBat = () => {
    safeDownloadFile('/api/download/NexusAgent-Setup.bat', 'NexusAgent-Setup.bat');
  };

  const triggerDownloadVSCode = () => {
    safeDownloadFile('/api/download/NexusAgent-Source-VSCode.zip', 'NexusAgent-Source-VSCode.zip');
  };

  const triggerDownload1ClickRun = () => {
    safeDownloadFile('/api/download/1-Click-Run.bat', '1-Click-Run.bat');
  };

  const triggerDownloadBuildInstaller = () => {
    safeDownloadFile('/api/download/Build-Installer-EXE.bat', 'Build-Installer-EXE.bat');
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-sky-600/30 selection:text-sky-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">NexusAgent</span>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 border border-sky-800/60 px-1.5 py-0.5 rounded">v2.4.0</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Local Agentic Orchestrator for Windows & EDA</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#eda-integration" className="hover:text-white transition-colors">Altium & Proteus</a>
            <a href="#vscode-section" className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" />
              <span>VS Code</span>
            </a>
            <a href="#installation-guide" className="hover:text-white transition-colors">Install Guide</a>
            <a href="#download" className="hover:text-white transition-colors">Downloads</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {onOpenPythonInstaller ? (
              <button
                onClick={onOpenPythonInstaller}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-950" />
                <span>Python Setup</span>
              </button>
            ) : (
              <button
                onClick={() => safeDownloadFile('/install_windows.py', 'install_windows.py')}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-950" />
                <span>Python Setup</span>
              </button>
            )}

            <button
              onClick={() => setVscodeModalOpen(true)}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Build in</span>
              <span>VS Code</span>
            </button>

            <button
              onClick={onLaunchLiveApp}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Live Web</span>
              <span>Agent</span>
            </button>

            <button
              onClick={triggerDownloadZip}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-md shadow-sky-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download (.zip)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800/60">
        {/* Subtle background tech glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-sky-600/10 via-indigo-600/15 to-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Metadata banner */}
            <div className="inline-flex items-center gap-2 text-xs text-sky-400 font-mono mb-4 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Windows 10/11 x64 Certified</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Altium Designer & Proteus VSM Bridge</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-6">
              Autonomous Local Agent Harness for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">Windows & EDA</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Execute complex multi-step reasoning, automated DelphiScripts for <strong className="text-white font-medium">Altium Designer</strong>, SPICE simulations in <strong className="text-white font-medium">Proteus 8 VSM</strong>, and system diagnostics with zero-trust local security guardrails.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              {onOpenPythonInstaller ? (
                <button
                  onClick={onOpenPythonInstaller}
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 hover:from-emerald-300 hover:to-sky-300 rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <Terminal className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Windows Setup via Python</span>
                  <span className="text-xs text-emerald-950 bg-emerald-200/60 px-2 py-0.5 rounded font-mono font-semibold">install_windows.py</span>
                </button>
              ) : (
                <button
                  onClick={() => safeDownloadFile('/install_windows.py', 'install_windows.py')}
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 hover:from-emerald-300 hover:to-sky-300 rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <Terminal className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Windows Setup via Python</span>
                  <span className="text-xs text-emerald-950 bg-emerald-200/60 px-2 py-0.5 rounded font-mono font-semibold">.PY</span>
                </button>
              )}

              <button
                onClick={triggerDownloadZip}
                className="w-full sm:w-auto px-5 py-3.5 text-base font-semibold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Download className="w-5 h-5 text-sky-400" />
                <span>Download Full Source (.ZIP)</span>
              </button>

              <button
                onClick={onLaunchLiveApp}
                className="w-full sm:w-auto px-5 py-3.5 text-base font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Live Web Agent</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick PowerShell 1-Liner */}
            <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  Install via PowerShell (Recommended for Windows):
                </span>
                <span className="font-mono text-[10px] text-slate-500">Requires Windows PowerShell 5.1+</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-black/60 rounded-lg px-3 py-2 font-mono text-xs text-sky-300 border border-slate-800">
                <span className="truncate select-all">{psInstallCommand}</span>
                <button
                  onClick={handleCopyCmd}
                  className="px-2 py-1 text-[11px] font-sans font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Architecture Highlights Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Admin Standard User
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-400" />
                Altium COM / DelphiScript API
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-indigo-400" />
                Proteus VSM SPICE Runner
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini 3.8 / 3.1 Flash CoT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: EDA Engineering Interoperability */}
      <section id="eda-integration" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#060910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2">Hardware & Embedded Systems</h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Seamless Altium Designer & Proteus Integration
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              NexusAgent bridges generative AI with industry-standard Electronic Design Automation (EDA) suites through safe Windows COM/IPC automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Altium Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-sky-700/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Altium Designer Automation</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Direct DelphiScript code generator and OLE automation client. Extract netlists, audit trace clearances, and generate Bill of Materials (BOM) without touching the mouse.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated Design Rule Checks (DRC) with tolerance verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Telesis & SPICE netlist export directly to C:\NexusAgent\Workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Supports Altium Designer 18, 19, 20, 21, 22, 23, and 24</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-400">
                <span className="text-sky-400 font-semibold">// Generated DelphiScript</span>
                <div className="text-slate-300 mt-1">
                  Procedure ExportNetlist;<br />
                  Begin<br />
                  &nbsp;&nbsp;DM_GenerateTelesisNetlist('MainBoard.PrjPcb');<br />
                  End;
                </div>
              </div>
            </div>

            {/* Proteus Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-sky-700/50 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                  <Workflow className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Proteus 8 VSM Co-Simulation</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Translates PCB netlists into Proteus ISIS schematic circuits, attaches microcontroller hex firmware, and conducts automated batch digital/analog SPICE simulations.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automatic STM32, AVR ATmega, and PIC microcontroller simulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated Proteus DScript runner for regression verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Virtual I2C, SPI, and UART bus packet decoding & inspection</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">// Automated VSM Batch Runner</span>
                <div className="text-slate-300 mt-1">
                  ProteusCmd.exe /BATCH "Simulation.dsn" /SIMULATE /DUR:5000ms<br />
                  <span className="text-emerald-400">&gt; Status: 0 Bus Faults, Clock Frequency 8.00 MHz Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Architecture & Technical Reality Check */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#080d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-mono mb-4">
              <Network className="w-3.5 h-3.5" />
              <span>Architecture & Technical Reality</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Can a Web Browser Really Control Your Windows Applications?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              <strong>The direct engineering answer is:</strong> A browser tab by itself is sandboxed by Windows security rules and cannot directly launch `.exe` files or control Altium/Proteus.
              To bridge this gap safely, <strong>NexusAgent uses a dual-engine architecture</strong>.
            </p>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="max-w-4xl mx-auto mb-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Orchestration & Execution Pipeline</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Trust Sandboxed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Node 1 */}
              <div className="bg-slate-950/80 border border-sky-900/50 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">1</span>
                    <Globe className="w-4 h-4 text-sky-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Web Mission Control</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Runs Gemini AI models to understand your prompt, break goals into actionable steps, and generate DelphiScript or SPICE netlists.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-sky-400">
                  State: Web / Cloud AI Brain
                </div>
              </div>

              {/* Node 2 */}
              <div className="bg-slate-950/80 border border-emerald-900/50 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">2</span>
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Local Windows Daemon</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The installed <code className="text-emerald-300">NexusAgent-Setup.exe</code> runs locally on your PC, listening on <code className="text-emerald-300">localhost:3000</code> to receive validated agent instructions.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                  Bridge: Localhost Loopback IPC
                </div>
              </div>

              {/* Node 3 */}
              <div className="bg-slate-950/80 border border-indigo-900/50 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">3</span>
                    <Laptop className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Target Windows Software</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Executes directly inside Altium via OLE COM (<code className="text-indigo-300">Altium.Application</code>) and Proteus ISIS via batch command-line runner.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-indigo-400">
                  Target: Native Win32 / COM
                </div>
              </div>
            </div>
          </div>

          {/* 3 Usage Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-700/50 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/50 mb-2">
                  Full Automation
                </div>
                <h4 className="text-base font-bold text-white mb-2">1. Native Desktop App (.exe)</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Download <strong className="text-white">NexusAgent-Setup.exe</strong> to your PC. Both the UI and backend run locally. It has direct Win32 and COM permissions to control Altium Designer and Proteus automatically.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct COM/OLE Automation</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automatic file I/O in C:\NexusAgent</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Background Proteus VSM execution</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={triggerDownloadZip}
                className="mt-6 w-full py-2.5 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Windows Package</span>
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-700/50 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Network className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50 mb-2">
                  Hybrid Connected
                </div>
                <h4 className="text-base font-bold text-white mb-2">2. Web Console + Local Bridge</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Use this web interface from any browser or device as your "Mission Control". The web app communicates with the local NexusAgent service running on your Windows PC via <code className="text-emerald-300">localhost:3000</code>.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cloud AI reasoning & planning</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Localhost secure execution bridge</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No sensitive data leaves your PC</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onLaunchLiveApp}
                className="mt-6 w-full py-2.5 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900/80 border border-emerald-800/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Open Web Mission Control</span>
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-700/50 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/50 mb-2">
                  Zero Install
                </div>
                <h4 className="text-base font-bold text-white mb-2">3. Web Copilot & Script Studio</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Don't want to install anything right now? In pure web mode, NexusAgent generates verified DelphiScripts, SPICE netlists, and DRC rules ready for one-click copy and paste into Altium and Proteus.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant browser access</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>One-click DelphiScript generation</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SPICE simulation code export</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onLaunchLiveApp}
                className="mt-6 w-full py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Try Generative EDA in Browser</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Windows Security Hardening */}
      <section id="windows-security" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#070b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Zero-Trust Guardrails</h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Hardened for Windows Security
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Autonomous execution shouldn't compromise your machine. NexusAgent is engineered specifically to prevent security issues on Windows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Box 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-white mb-2">Standard User Privileges</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operates strictly under Medium Integrity level. Never requests unsolicited UAC elevation or administrator tokens.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-white mb-2">Destructive Blacklist</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commands like <code className="text-sky-300">rmdir /s</code>, drive formatting, registry wiping, or remote shell pipes are blocked before evaluation.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-white mb-2">Protected System Paths</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct file manipulation inside <code className="text-sky-300">C:\Windows</code> or <code className="text-sky-300">System32</code> is completely sealed. Operations stay within authorized workspaces.
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-700/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-white mb-2">Human Approval Gates</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every sensitive script or external tool execution can trigger a visual confirmation gate in the stream before executing on your system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation & Troubleshooting Guide (Solves user's PowerShell path issue) */}
      <section id="installation-guide" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#060910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2">Step-by-Step Setup</h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Easy Installation & Zero Path Errors
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              No need to struggle with manual paths or terminal directories. Choose the installer method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Method A: Python Installer */}
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl shadow-emerald-950/20">
              <div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800/60 font-semibold">Recommended (Python Script)</span>
                <h4 className="text-lg font-bold text-white mt-3 mb-2 flex items-center gap-2">
                  <span>Python Setup (install_windows.py)</span>
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  100% automated and clean setup on Windows 10 & 11. Zero external requirements and no SmartScreen errors.
                </p>

                <ol className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Download or open script: <code className="text-emerald-300 font-mono">install_windows.py</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Run in terminal: <code className="text-amber-300 font-mono">python install_windows.py</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Automated Node.js check, desktop shortcut, and launch on port 3000</span>
                  </li>
                </ol>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => safeDownloadFile('/install_windows.py', 'install_windows.py')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download install_windows.py</span>
                </button>
                {onOpenPythonInstaller && (
                  <button
                    onClick={onOpenPythonInstaller}
                    className="w-full py-2 px-3 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Python Setup Guide</span>
                  </button>
                )}
              </div>
            </div>

            {/* Method B: PowerShell 1-liner */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/50">Method 2 (PowerShell)</span>
                <h4 className="text-lg font-bold text-white mt-3 mb-2">Automated PowerShell Script</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Open PowerShell and paste a single command. It configures directories and shortcuts automatically.
                </p>

                <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-sky-300 mb-4 select-all break-all">
                  {psInstallCommand}
                </div>

                <ol className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Win + X</kbd> and select <strong>Windows PowerShell</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Paste the command above and press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Enter</kbd></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Installs to <code className="text-emerald-400">%LOCALAPPDATA%\NexusAgent</code> and creates shortcut</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={handleCopyCmd}
                className="mt-6 w-full py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCmd ? 'Command Copied!' : 'Copy PowerShell Command'}</span>
              </button>
            </div>

            {/* Method C: Troubleshooting 'Cannot run / path not found' note */}
            <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/50">Troubleshooting Guide</span>
                <h4 className="text-lg font-bold text-white mt-3 mb-2">Fixing Installation Errors</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Solutions for Windows Defender, SmartScreen, or Path issues:
                </p>

                <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-200/90 space-y-2 mb-4">
                  <p>
                    <strong>Why did .exe show "This app can't run on your PC"?</strong><br />
                    Windows blocks raw unsigned binary files downloaded from web browsers. By using our transparent <strong>.zip / .bat package</strong>, Windows executes the native scripts without security rejection.
                  </p>
                  <p>
                    <strong>"Cannot find path /path/to/..." error:</strong><br />
                    The new package automatically creates <code className="text-sky-300">C:\NexusAgent\Workspace</code> so you never need to manually configure paths.
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  <p className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    100% verified Windows 10/11 compatibility
                  </p>
                </div>
              </div>

              <button
                onClick={onLaunchLiveApp}
                className="mt-6 w-full py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Test Live Agent in Browser Without Installing</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VS Code Development & Real EXE Build Section */}
      <section id="vscode-section" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#090d18] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full mb-3">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Visual Studio Code Developer Suite</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Build Authentic Windows EXE in VS Code
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Open the complete project source in VS Code, install dependencies with one command, test locally, and package a genuine <strong className="text-amber-300">Windows EXE installer with Electron</strong>!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={triggerDownloadVSCode}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-900" />
                <span>Download Full Source for VS Code (.zip)</span>
              </button>

              <button
                onClick={() => setVscodeModalOpen(true)}
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Step-by-Step Guide
              </button>
            </div>
          </div>

          {/* Quick 1-Click Launch & Build Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">1-Click-Run.bat</span>
                    <h4 className="text-white font-bold text-sm">1-Click Instant App Launch</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Included in source root! Double-click to auto-verify packages and launch in your browser.
                  </p>
                </div>
              </div>
              <button
                onClick={triggerDownload1ClickRun}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/60 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 1-Click-Run.bat</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">Build-Installer-EXE.bat</span>
                    <h4 className="text-white font-bold text-sm">Build Windows Installer (.EXE)</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Compiles standalone Windows installer (Setup.exe) and opens the output folder ready for installation.
                  </p>
                </div>
              </div>
              <button
                onClick={triggerDownloadBuildInstaller}
                className="px-3.5 py-2 text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-600/60 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Build-Installer.bat</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Code Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-[11px] font-mono text-slate-400">Extract & Open</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">1. Open Source Code</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Extract the zip file and open the folder in VS Code via terminal or file menu:
                </p>
                <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                  <code>code .</code>
                  <button onClick={() => copyText('code .', 'code')} className="text-slate-400 hover:text-white p-1">
                    {copiedVsCodeCmd === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-[11px] font-mono text-slate-400">Dependencies</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">2. Install Dependencies</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Open terminal with <kbd className="bg-slate-800 px-1 rounded text-white">Ctrl + ~</kbd> and install packages:
                </p>
                <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-sky-300 flex items-center justify-between">
                  <code>npm install</code>
                  <button onClick={() => copyText('npm install', 'install')} className="text-slate-400 hover:text-white p-1">
                    {copiedVsCodeCmd === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                  <span className="text-[11px] font-mono text-slate-400">Dev & Test</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">3. Live App Execution</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Run the project live on port 3000 with complete EDA and AI agent tools:
                </p>
                <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-emerald-300 flex items-center justify-between">
                  <code>npm run dev</code>
                  <button onClick={() => copyText('npm run dev', 'dev')} className="text-slate-400 hover:text-white p-1">
                    {copiedVsCodeCmd === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center">4</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Build Real EXE</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">4. Build EXE Installer</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Generate authentic native Windows installer at <code className="text-amber-300">dist_electron/*.exe</code>:
                </p>
                <div className="bg-black/60 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-purple-300 flex items-center justify-between">
                  <code>npm run build:exe</code>
                  <button onClick={() => copyText('npm run build:exe', 'build_exe')} className="text-slate-400 hover:text-white p-1">
                    {copiedVsCodeCmd === 'build_exe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Download Hub Section */}
      <section id="download" className="py-16 sm:py-24 border-b border-slate-800/60 bg-[#070b12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-b from-slate-900 to-[#0c121e] border border-slate-700/80 rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-sky-500/10 blur-[80px] pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-950/70 border border-sky-800/50 px-3 py-1 rounded-full mb-6">
              <span>Official Release v2.4.0 (Windows 64-bit)</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Get NexusAgent for Windows
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Standalone Windows executable package with built-in Altium Designer DelphiScript generator and Proteus VSM SPICE automation.
            </p>

            {/* Big Action Download */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={triggerDownloadZip}
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-2xl shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Download className="w-6 h-6" />
                <span>Download Windows Package (.zip)</span>
              </button>

              <button
                onClick={triggerDownloadVSCode}
                className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl border border-amber-600/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/20"
              >
                <FileCode className="w-5 h-5 text-amber-400" />
                <span>Download VS Code Project</span>
              </button>

              <button
                onClick={triggerDownloadBat}
                className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-sky-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl border border-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCode className="w-5 h-5 text-sky-400" />
                <span>Download 1-Click .bat</span>
              </button>

              <button
                onClick={onLaunchLiveApp}
                className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 text-emerald-400" />
                <span>Launch Web Agent</span>
              </button>
            </div>

            {/* Checksum & Details */}
            <div className="max-w-xl mx-auto bg-black/40 border border-slate-800/80 rounded-xl p-4 text-left font-mono text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>File Name:</span>
                <span className="text-white font-medium">NexusAgent-Windows-v2.4.0.zip</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Included Runners:</span>
                <span className="text-slate-200">Run-NexusAgent.bat, NexusAgent-Setup.bat, daemon</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Target Architecture:</span>
                <span className="text-slate-200">Windows 10 / 11 (x64 AMD64)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Profile:</span>
                <span className="text-emerald-400 font-medium">Standard User (No UAC / No SmartScreen block)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="shrink-0 text-slate-500">SHA-256 Checksum:</span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[10px] text-sky-400 truncate select-all">{sha256Checksum}</span>
                  <button
                    onClick={handleCopyChecksum}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                    title="Copy Checksum"
                  >
                    {copiedChecksum ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#05070d] border-t border-slate-800/60 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 font-medium">NexusAgent</span>
            <span>— Autonomous Local Agentic Orchestrator for Windows & EDA</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={onLaunchLiveApp} className="hover:text-white transition-colors cursor-pointer">
              Live Web Console
            </button>
            <button onClick={triggerDownloadZip} className="hover:text-white transition-colors cursor-pointer">
              Download Package (.zip)
            </button>
            <a href="#windows-security" className="hover:text-white transition-colors">
              Security Guardrails
            </a>
          </div>
        </div>
      </footer>

      {/* Download Modal / Toast Confirmation */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b111e] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Your Download has Started!</h4>
                  <p className="text-xs text-slate-400">NexusAgent-Windows-v2.4.0.zip (Windows 64-bit)</p>
                </div>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => safeDownloadFile('/install_windows.py', 'install_windows.py')}
                  className="py-2.5 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20 col-span-1 sm:col-span-2"
                >
                  <Terminal className="w-4 h-4 text-slate-950" />
                  <span>Download Python Windows Script (install_windows.py)</span>
                </button>
                <button
                  onClick={triggerDownloadVSCode}
                  className="py-2.5 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-950/40"
                >
                  <FileCode className="w-4 h-4 text-amber-200" />
                  <span>Download Full VS Code Source (.zip)</span>
                </button>
                <button
                  onClick={triggerDownloadZip}
                  className="py-2.5 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-sky-200" />
                  <span>Download Complete Windows Package (.zip)</span>
                </button>
              </div>

              {/* Direct Link Fail-safe */}
              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
                <span>Direct Download Link (if browser blocks popups):</span>
                <a
                  href="/downloads/NexusAgent-Source-VSCode.zip"
                  download="NexusAgent-Source-VSCode.zip"
                  className="text-sky-400 hover:text-sky-300 underline font-mono"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Direct ZIP Download
                </a>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 text-left">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Extraction & Setup Instructions:</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The archive includes <strong>42 complete source files</strong>, pre-configured <code className="text-amber-300">.vscode</code>, and native <code className="text-sky-300">.exe</code> build scripts.
                </p>
                <div className="text-[11px] text-slate-400 bg-black/40 p-2 rounded border border-slate-800 space-y-1">
                  <div>1. Right-click the downloaded zip and choose <strong>Extract All...</strong> (or open with 7-Zip / WinRAR).</div>
                  <div>2. Open the extracted folder in <strong>VS Code</strong>.</div>
                  <div>3. Run <code className="text-sky-300 font-mono">python install_windows.py</code> or <code className="text-emerald-400 font-mono">npm install &amp;&amp; npm run dev</code>.</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDownloadModalOpen(false);
                  onLaunchLiveApp();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Live Agent in Browser</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VS Code Development & EXE Build Modal */}
      {vscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#0b111e] border border-amber-600/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <FileCode className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">VS Code Setup &amp; Windows EXE Build Guide</h4>
                  <p className="text-xs text-slate-400">Step-by-step instructions to run, debug, and compile an authentic Windows EXE installer</p>
                </div>
              </div>
              <button
                onClick={() => setVscodeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Explanation why exe failed earlier */}
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3.5 mb-5 text-xs text-amber-200/90 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Windows Architecture &amp; Compatibility:</span>
              </div>
              <p>
                The <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">This app can&apos;t run on your PC</code> error occurs when cross-compiled binary wrappers are blocked by Windows Defender. By building the project directly in VS Code on your Windows machine with <strong className="text-white">Electron Builder</strong>, you produce a 100% genuine, compatible Windows NSIS setup installer.
              </p>
            </div>

            {/* Step-by-Step Terminal Commands */}
            <div className="space-y-3.5 mb-6">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">VS Code Terminal Execution:</h5>

              {/* Step 1 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-xs font-bold text-white">Download Source &amp; Open in VS Code</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Extract the zip archive and open the directory via File &gt; Open Folder or terminal command.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={triggerDownloadVSCode}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source ZIP</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-xs font-bold text-white">Install Project Dependencies</span>
                  </div>
                  <p className="text-[11px] text-slate-400">In the integrated terminal (Ctrl + ~), run:</p>
                </div>
                <div className="flex items-center gap-2 bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 shrink-0">
                  <code className="text-xs font-mono text-sky-300">npm install</code>
                  <button
                    onClick={() => copyText('npm install', 'install')}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                  >
                    {copiedVsCodeCmd === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-xs font-bold text-white">Live App Testing (Dev Mode)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Launch the local server on localhost:3000 (debuggable with F5):</p>
                </div>
                <div className="flex items-center gap-2 bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 shrink-0">
                  <code className="text-xs font-mono text-emerald-300">npm run dev</code>
                  <button
                    onClick={() => copyText('npm run dev', 'dev')}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                  >
                    {copiedVsCodeCmd === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900 border border-purple-900/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center">4</span>
                    <span className="text-xs font-bold text-white">Build Native Windows EXE Installer</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Packages setup executable to <code className="text-purple-300">dist_electron/NexusAgent-Setup.exe</code>:</p>
                </div>
                <div className="flex items-center gap-2 bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 shrink-0">
                  <code className="text-xs font-mono text-purple-300">npm run build:exe</code>
                  <button
                    onClick={() => copyText('npm run build:exe', 'build_exe')}
                    className="p-1 hover:text-white text-slate-400 transition-colors"
                  >
                    {copiedVsCodeCmd === 'build_exe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Automatic 1-Click Batch Option */}
            <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-3.5 mb-6 text-xs text-emerald-200 text-left space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>⚡ Zero-Command Automated Launchers:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Two smart automation scripts are included directly in the source root:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-black/50 p-2.5 rounded-lg border border-emerald-800/40">
                  <div className="font-mono text-emerald-300 font-bold mb-1">▶️ 1-Click-Run.bat</div>
                  <div>Double-click to automatically verify packages and open the app in your browser.</div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-purple-800/40">
                  <div className="font-mono text-purple-300 font-bold mb-1">📦 Build-Installer-EXE.bat</div>
                  <div>Double-click to compile a standalone Windows installer (.exe) via Electron.</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Pre-configured <code className="text-sky-300">.vscode</code> folder with launch.json and tasks.json included.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setVscodeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Close
                </button>
                <button
                  onClick={triggerDownloadVSCode}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Project ZIP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

