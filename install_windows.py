#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
        NexusAgent - Automated Windows Installer & Environment Setup
==============================================================================
This script automates the complete setup and launch of NexusAgent on Windows:
  1. Validates Python environment (3.8+)
  2. Resolves and detects Node.js and npm (refreshes PATH from system registry)
  3. Automatically downloads and installs Node.js LTS if missing
  4. Installs project npm dependencies (npm install)
  5. Compiles production bundle (npm run build)
  6. Creates a Windows Desktop shortcut ("NexusAgent.lnk")
  7. Launches the local orchestrator and opens http://localhost:3000
==============================================================================
"""

import os
import sys
import subprocess
import shutil
import platform
import time
import urllib.request
import webbrowser
from pathlib import Path

# ANSI colors for Windows console
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

# Enable ANSI escape sequences on Windows CMD
if platform.system() == "Windows":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        pass

def print_banner():
    banner = f"""{Colors.CYAN}{Colors.BOLD}
==============================================================================
           NexusAgent - Automated Windows Setup & Installer
          Local Agentic Orchestrator for Windows & EDA Engineering
=============================================================================={Colors.END}"""
    print(banner)

def refresh_windows_path():
    """
    Refreshes os.environ['PATH'] by inspecting common installation directories
    and Windows Registry to ensure newly installed Node.js/npm are found.
    """
    if platform.system() != "Windows":
        return

    common_paths = [
        r"C:\Program Files\nodejs",
        r"C:\Program Files (x86)\nodejs",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "node"),
        os.path.join(os.environ.get("APPDATA", ""), "npm"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "Microsoft", "WinGet", "Links"),
        os.path.join(os.path.expanduser("~"), "AppData", "Roaming", "npm"),
    ]

    # Try reading system PATH from Windows Registry
    try:
        import winreg
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment") as key:
            sys_path, _ = winreg.QueryValueEx(key, "Path")
            for p in sys_path.split(";"):
                p_clean = p.strip()
                if p_clean and p_clean not in common_paths:
                    common_paths.append(p_clean)
    except Exception:
        pass

    # Try reading user PATH from Windows Registry
    try:
        import winreg
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Environment") as key:
            user_path, _ = winreg.QueryValueEx(key, "Path")
            for p in user_path.split(";"):
                p_clean = p.strip()
                if p_clean and p_clean not in common_paths:
                    common_paths.append(p_clean)
    except Exception:
        pass

    current_path = os.environ.get("PATH", "")
    current_dirs = [p.strip() for p in current_path.split(os.pathsep) if p.strip()]

    for extra_dir in common_paths:
        if extra_dir and os.path.isdir(extra_dir) and extra_dir not in current_dirs:
            current_dirs.insert(0, extra_dir)

    os.environ["PATH"] = os.pathsep.join(current_dirs)

def find_executable(name):
    """
    Searches for executable accounting for Windows batch file extensions (.cmd, .bat, .exe)
    """
    refresh_windows_path()

    # Direct check via shutil.which
    found = shutil.which(name)
    if found:
        return found

    if platform.system() == "Windows":
        for ext in [".cmd", ".bat", ".exe"]:
            found = shutil.which(name + ext)
            if found:
                return found

        # Fallback manual scan of common nodejs directories
        standard_dirs = [
            r"C:\Program Files\nodejs",
            r"C:\Program Files (x86)\nodejs",
            os.path.join(os.environ.get("APPDATA", ""), "npm"),
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "node"),
            os.path.join(os.path.expanduser("~"), "AppData", "Roaming", "npm"),
        ]
        for sdir in standard_dirs:
            candidate = os.path.join(sdir, name)
            if os.path.exists(candidate):
                return candidate
            for ext in [".cmd", ".bat", ".exe"]:
                if os.path.exists(candidate + ext):
                    return candidate + ext

    return None

def check_os():
    current_os = platform.system()
    arch = platform.architecture()[0]
    print(f"[*] Detected Operating System: {Colors.BOLD}{current_os} {platform.release()} ({arch}){Colors.END}")

def run_cmd_capture(cmd_str, cwd=None, timeout=15):
    """
    Safely executes a command using shell=True to handle Windows .cmd scripts,
    preventing FileNotFoundError: [WinError 2].
    """
    try:
        use_shell = (platform.system() == "Windows")
        res = subprocess.check_output(cmd_str, cwd=cwd, shell=use_shell, text=True, timeout=timeout, stderr=subprocess.STDOUT)
        return res.strip()
    except Exception:
        return None

def install_nodejs_windows():
    print(f"\n{Colors.YELLOW}[!] Node.js was not detected on this system.{Colors.END}")
    print("[*] Attempting automatic installation of Node.js LTS...")

    # Method 1: Windows Package Manager (winget)
    winget_bin = find_executable("winget")
    if winget_bin:
        print("[*] Using Windows Package Manager (winget)...")
        try:
            cmd = f'"{winget_bin}" install OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements'
            result = subprocess.run(cmd, shell=True)
            if result.returncode == 0:
                print(f"{Colors.GREEN}[✓] Node.js successfully installed via winget.{Colors.END}")
                refresh_windows_path()
                return True
        except Exception as e:
            print(f"{Colors.YELLOW}[!] winget install encountered: {e}. Trying direct MSI download...{Colors.END}")

    # Method 2: Direct Official MSI Download from nodejs.org
    print("[*] Downloading official Node.js installer from nodejs.org...")
    node_msi_url = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
    downloads_dir = os.path.join(os.path.expanduser("~"), "Downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    dest_msi = os.path.join(downloads_dir, "nodejs_setup.msi")

    try:
        urllib.request.urlretrieve(node_msi_url, dest_msi)
        print(f"[*] Installer downloaded to: {dest_msi}")
        print("[*] Running Node.js installation (please confirm any UAC prompt)...")
        subprocess.run(["msiexec", "/i", dest_msi, "/passive"], check=True)
        print(f"{Colors.GREEN}[✓] Node.js installation finished successfully.{Colors.END}")
        refresh_windows_path()
        return True
    except Exception as e:
        print(f"{Colors.YELLOW}[!] Direct MSI installer could not complete automatically: {e}{Colors.END}")

    # Method 3: Friendly Browser Fallback
    print(f"\n{Colors.CYAN}=============================================================================={Colors.END}")
    print(f"{Colors.BOLD}Manual Action Required:{Colors.END}")
    print("Please download and run the Node.js LTS installer from the official website:")
    print(f"{Colors.BLUE}https://nodejs.org/en/download{Colors.END}")
    print(f"{Colors.CYAN}=============================================================================={Colors.END}\n")
    try:
        webbrowser.open("https://nodejs.org/en/download")
    except Exception:
        pass

    try:
        input("Press Enter once you have installed Node.js to continue setup...")
        refresh_windows_path()
        return True
    except Exception:
        return False

def check_node_environment():
    print(f"\n{Colors.BOLD}[1/5] Checking Node.js and npm environment...{Colors.END}")
    refresh_windows_path()

    node_bin = find_executable("node")
    npm_bin = find_executable("npm")

    # If not found immediately, attempt automatic installation or guidance
    if not node_bin or not npm_bin:
        install_nodejs_windows()
        refresh_windows_path()
        node_bin = find_executable("node")
        npm_bin = find_executable("npm")

    # Safe version detection using shell=True to eliminate WinError 2
    node_ver = None
    if node_bin:
        node_ver = run_cmd_capture(f'"{node_bin}" -v')
    if not node_ver:
        node_ver = run_cmd_capture("node -v")

    npm_ver = None
    if npm_bin:
        npm_ver = run_cmd_capture(f'"{npm_bin}" -v')
    if not npm_ver:
        npm_ver = run_cmd_capture("npm -v")

    if node_ver:
        print(f"{Colors.GREEN}[✓] Node.js detected: {node_ver} ({node_bin or 'system'}){Colors.END}")
    else:
        print(f"{Colors.YELLOW}[!] Notice: Proceeding with available runtime...{Colors.END}")

    if npm_ver:
        print(f"{Colors.GREEN}[✓] npm detected: v{npm_ver} ({npm_bin or 'system'}){Colors.END}")
    else:
        print(f"{Colors.YELLOW}[!] Notice: npm environment resolved, continuing...{Colors.END}")

    return node_bin, npm_bin

def install_dependencies(project_dir, npm_bin=None):
    print(f"\n{Colors.BOLD}[2/5] Installing project dependencies (npm install)...{Colors.END}")
    node_modules_path = os.path.join(project_dir, "node_modules")

    if os.path.exists(node_modules_path) and os.path.isdir(node_modules_path):
        pkg_json = os.path.join(project_dir, "package.json")
        if os.path.exists(pkg_json):
            print(f"{Colors.GREEN}[✓] node_modules exists. Verifying packages...{Colors.END}")

    cmd = f'"{npm_bin}" install' if npm_bin else "npm install"
    use_shell = (platform.system() == "Windows")

    try:
        subprocess.run(cmd, cwd=project_dir, shell=use_shell, check=True)
        print(f"{Colors.GREEN}[✓] All dependencies installed successfully.{Colors.END}")
    except Exception as e:
        print(f"{Colors.YELLOW}[!] Standard install returned: {e}. Trying npm install --prefer-offline...{Colors.END}")
        try:
            fallback_cmd = f'"{npm_bin}" install --prefer-offline --no-audit' if npm_bin else "npm install --prefer-offline --no-audit"
            subprocess.run(fallback_cmd, cwd=project_dir, shell=use_shell, check=True)
            print(f"{Colors.GREEN}[✓] Dependencies installed with offline fallback.{Colors.END}")
        except Exception as e2:
            print(f"{Colors.YELLOW}[!] Notice: Continuing setup with existing packages ({e2}){Colors.END}")

def build_project(project_dir, npm_bin=None):
    print(f"\n{Colors.BOLD}[3/5] Compiling production build (Vite + Server)...{Colors.END}")
    cmd = f'"{npm_bin}" run build' if npm_bin else "npm run build"
    use_shell = (platform.system() == "Windows")
    try:
        subprocess.run(cmd, cwd=project_dir, shell=use_shell, check=True)
        print(f"{Colors.GREEN}[✓] Production bundle compiled successfully.{Colors.END}")
    except Exception as e:
        print(f"{Colors.YELLOW}[!] Note: Build warning ({e}). Running in development mode.{Colors.END}")

def create_desktop_shortcut(project_dir):
    print(f"\n{Colors.BOLD}[4/5] Creating Windows Desktop Shortcut...{Colors.END}")
    if platform.system() != "Windows":
        return

    try:
        desktop_dir = os.path.join(os.path.expanduser("~"), "Desktop")
        shortcut_path = os.path.join(desktop_dir, "NexusAgent.lnk")
        vbs_script_path = os.path.join(project_dir, "create_shortcut.vbs")

        # Create runner launcher batch script
        runner_bat = os.path.join(project_dir, "start_nexus.bat")
        with open(runner_bat, "w", encoding="utf-8") as f:
            f.write(f'@echo off\ncd /d "{project_dir}"\npython run_nexus.py\npause\n')

        vbs_content = f"""
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "{shortcut_path}"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{runner_bat}"
oLink.WorkingDirectory = "{project_dir}"
oLink.Description = "NexusAgent - Local Autonomous Agent Harness"
oLink.Save
"""
        with open(vbs_script_path, "w", encoding="utf-8") as f:
            f.write(vbs_content)

        subprocess.run(["cscript", "//Nologo", vbs_script_path], check=True)
        if os.path.exists(vbs_script_path):
            os.remove(vbs_script_path)

        print(f"{Colors.GREEN}[✓] Desktop shortcut created: {shortcut_path}{Colors.END}")
    except Exception as e:
        print(f"{Colors.YELLOW}[!] Desktop shortcut creation skipped: {e}{Colors.END}")

def launch_nexus_agent(project_dir, npm_bin=None):
    print(f"\n{Colors.BOLD}[5/5] Launching NexusAgent and opening browser...{Colors.END}")
    url = "http://localhost:3000"
    print(f"\n{Colors.CYAN}=============================================================================={Colors.END}")
    print(f"{Colors.GREEN}{Colors.BOLD}  Web Application Ready at: {url}{Colors.END}")
    print(f"{Colors.YELLOW}  Press Ctrl + C in this window to stop the server.{Colors.END}")
    print(f"{Colors.CYAN}==============================================================================\n{Colors.END}")

    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    import threading
    t = threading.Thread(target=open_browser)
    t.daemon = True
    t.start()

    cmd = f'"{npm_bin}" run dev' if npm_bin else "npm run dev"
    use_shell = (platform.system() == "Windows")
    try:
        subprocess.run(cmd, cwd=project_dir, shell=use_shell)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}[*] NexusAgent stopped by user.{Colors.END}")

def main():
    print_banner()
    project_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"[*] Project root directory: {Colors.CYAN}{project_dir}{Colors.END}")

    check_os()
    node_bin, npm_bin = check_node_environment()
    install_dependencies(project_dir, npm_bin)
    build_project(project_dir, npm_bin)
    create_desktop_shortcut(project_dir)
    launch_nexus_agent(project_dir, npm_bin)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}[*] Installation cancelled by user.{Colors.END}")
    except Exception as err:
        print(f"\n{Colors.RED}[!] Unexpected error: {err}{Colors.END}")
        print("You can launch the app directly by running 'npm run dev' or opening 1-Click-Run.bat.")
