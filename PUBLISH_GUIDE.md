# 🚀 Complete Website Publishing & Deployment Guide

NexusAgent is fully ready to be deployed online or packaged for Windows desktop environments.

---

## 1. Cloud & Server Deployment

### Method A: Vercel (Fastest & Free)
1. Push your repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. The included `vercel.json` will automatically configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. Your site will be live on a custom `.vercel.app` domain with free SSL.

### Method B: Render / Railway / Cloud Run (Full-Stack Mode)
1. Link your repository on [render.com](https://render.com) or [railway.app](https://railway.app).
2. Set Environment:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`

### Method C: Docker Deployment (Self-Hosted VPS)
Use the included `Dockerfile` and `docker-compose.yml`:
```bash
docker compose up -d --build
```
Your app will be running in high-performance production mode on port 3000.

---

## 2. Windows Desktop Distribution (.EXE)

To compile the application into a standalone Windows installer (.exe):
```bash
npm run build:exe
```
This produces `NexusAgent Setup.exe` using Electron Builder with NSIS packaging.