==============================================================================
NEXUSAGENT v2.4.0 - WINDOWS & EDA AUTONOMOUS HARNESS
==============================================================================

What is this package?
NexusAgent is a local agentic orchestrator that bridges web mission control
with native Windows applications, specifically:
  - Altium Designer (COM OLE automation, DelphiScript .pas generation, DRC rule audits)
  - Proteus 8 Professional (VSM SPICE co-simulation, MCU firmware testbenches)
  - Windows PowerShell & CMD administration (under Standard User guardrails)

------------------------------------------------------------------------------
Method 1: Automated Python Setup (Recommended for Windows):
------------------------------------------------------------------------------
In PowerShell or Command Prompt in this folder, run:

    python install_windows.py

This script automatically handles:
  1. Node.js & npm environment detection and automatic setup
  2. Project dependencies installation (npm install)
  3. Desktop shortcut creation (NexusAgent.lnk)
  4. Server launch and opening http://localhost:3000 in your browser

------------------------------------------------------------------------------
Method 2: 1-Click Instant Launch:
------------------------------------------------------------------------------
Double-click "1-Click-Run.bat" to start the application and open the browser.
To generate a standalone Windows installer (.exe), run "Build-Installer-EXE.bat".

------------------------------------------------------------------------------
Method 3: Visual Studio Code Development:
------------------------------------------------------------------------------
1. Open this directory in VS Code:
   code .
2. Open terminal (Ctrl + ~) and run:
   npm install
   npm run dev
3. To package into a native Windows installer:
   npm run build:exe
==============================================================================
