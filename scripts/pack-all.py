#!/usr/bin/env python3
import os
import zipfile

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
public_downloads = os.path.join(base_dir, 'public', 'downloads')
os.makedirs(public_downloads, exist_ok=True)

include_items = [
    'install_windows.py',
    'run_nexus.py',
    'build_windows_exe.py',
    '1-Click-Run.bat',
    'Build-Installer-EXE.bat',
    'Start-App.ps1',
    '.vscode',
    'electron',
    'src',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'electron-builder.yml',
    'index.html',
    'server.ts',
    '.env.example',
    'Dockerfile',
    'docker-compose.yml',
    'vercel.json',
    'VSCODE_GUIDE.md',
    'PUBLISH_GUIDE.md',
    'README.md',
    'public/downloads/README.txt'
]

def create_archive(zip_destination):
    print(f"Creating archive {zip_destination} ...")
    with zipfile.ZipFile(zip_destination, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for item in include_items:
            full_path = os.path.join(base_dir, item)
            if not os.path.exists(full_path):
                continue
            if os.path.isdir(full_path):
                for root, dirs, files in os.walk(full_path):
                    # Filter out unwanted directories
                    for d in ['node_modules', 'dist', 'dist-electron', '.git', '.aistudio']:
                        if d in dirs:
                            dirs.remove(d)
                    for file in files:
                        if file.endswith('.zip') or file.endswith('.exe'):
                            continue
                        file_full = os.path.join(root, file)
                        arcname = os.path.relpath(file_full, base_dir).replace('\\', '/')
                        z.write(file_full, arcname)
            else:
                arcname = os.path.basename(full_path) if item.startswith('public/downloads/') else item
                z.write(full_path, arcname)

    size = os.path.getsize(zip_destination)
    print(f"Done: {zip_destination} ({size:,} bytes)")

def main():
    target_zips = [
        os.path.join(public_downloads, 'NexusAgent-Windows-v2.4.0.zip'),
        os.path.join(public_downloads, 'NexusAgent-Source-VSCode.zip'),
        os.path.join(public_downloads, 'NexusAgent-Full-Package.zip')
    ]

    for dest in target_zips:
        create_archive(dest)

if __name__ == '__main__':
    main()
