#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
        ⚡ NexusAgent - Python Local Runtime Daemon & Launcher
==============================================================================
Launches and monitors the NexusAgent server, handles automatic browser opening,
and provides graceful Ctrl+C shutdown.
==============================================================================
"""

import os
import sys
import subprocess
import platform
import time
import webbrowser
import threading

def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    url = "http://localhost:3000"
    
    print("\033[96m==============================================================================\033[0m")
    print("\033[92m\033[1m       🚀 NexusAgent - Local Python Agent Daemon Active\033[0m")
    print(f"       Serving on: \033[93m{url}\033[0m")
    print("\033[96m==============================================================================\033[0m")

    # Open browser in a separate thread after 2 seconds
    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    t = threading.Thread(target=open_browser)
    t.daemon = True
    t.start()

    use_shell = platform.system() == "Windows"
    try:
        subprocess.run(["npm", "run", "dev"], cwd=project_dir, shell=use_shell)
    except KeyboardInterrupt:
        print("\n\033[93m[*] NexusAgent daemon stopped.\033[0m")

if __name__ == "__main__":
    main()
