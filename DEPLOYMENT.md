# GitHub Deployment Guide

## Option 1: Frontend Only (GitHub Pages)

For a frontend-only deployment using GitHub Pages:

### Steps:

1. **Create a GitHub repository** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Update the base path** in `vite.config.github.ts`:
   - Replace `/your-repo-name/` with your actual repository name

3. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy when you push to main

4. **Build command for GitHub Pages**:
   ```bash
   vite build --config vite.config.github.ts
   ```

⚠️ **Note**: This will deploy only the frontend. The backend features (database, API) won't work.

## Option 2: Full Stack Deployment

For full-stack deployment with database support:

### Recommended Platforms:

1. **Vercel + Neon Database**:
   - Deploy frontend to Vercel
   - Use Neon for PostgreSQL database
   - Set up serverless functions for API

2. **Railway**:
   - Full-stack deployment with PostgreSQL
   - Simple configuration, supports Node.js
   - Automatic HTTPS and custom domains

3. **Render**:
   - Free tier available
   - PostgreSQL database included
   - Easy environment variable management

### Environment Variables Needed:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_session_secret
```

## Current Architecture

Your app is built with:
- **Frontend**: React + Vite (builds to static files)
- **Backend**: Express.js server with PostgreSQL
- **Development**: Full-stack running on single port (5000)

The GitHub Actions workflow is already configured and will automatically deploy your frontend when you push to the main branch.