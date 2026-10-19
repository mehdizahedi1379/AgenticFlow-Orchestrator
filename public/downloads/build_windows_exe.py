#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
        📦 NexusAgent - Python Windows EXE Package Builder
==============================================================================
This script compiles and packages NexusAgent into a standalone Windows installer (.exe).
==============================================================================
"""

import os
import sys
import subprocess
import platform

def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    print("\033[96m[*] Starting Windows EXE Package Build...\033[0m")
    
    # 1. Build frontend bundle
    print("\033[92m[1/2] Compiling web bundle (Vite + esbuild)...\033[0m")
    use_shell = platform.system() == "Windows"
    subprocess.run(["npm", "run", "build"], cwd=project_dir, shell=use_shell, check=True)

    # 2. Package with electron-builder
    print("\033[92m[2/2] Packaging Windows EXE installer via electron-builder...\033[0m")
    subprocess.run(["npx", "electron-builder", "--win", "nsis"], cwd=project_dir, shell=use_shell, check=True)
    
    print("\033[92m\033[1m[✓] Build complete! Check dist/ or dist-electron/ folder for NexusAgent Setup.exe\033[0m")

if __name__ == "__main__":
    main()
