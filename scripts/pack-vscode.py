#!/usr/bin/env python3
import os
import zipfile

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
public_downloads = os.path.join(base_dir, 'public', 'downloads')
os.makedirs(public_downloads, exist_ok=True)

out_zip = os.path.join(public_downloads, 'NexusAgent-Source-VSCode.zip')

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
    'README.md'
]

print(f"Creating {out_zip} ...")
with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for item in include_items:
        full_path = os.path.join(base_dir, item)
        if not os.path.exists(full_path):
            continue
        if os.path.isdir(full_path):
            for root, dirs, files in os.walk(full_path):
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
            arcname = item
            z.write(full_path, arcname)

size = os.path.getsize(out_zip)
print(f"Done: {out_zip} ({size:,} bytes)")
