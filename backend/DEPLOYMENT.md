# Backend Deployment Guide

This guide covers deploying the Indoor Navigation API to various remote hosting platforms.

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your repository
4. Railway will auto-detect Node.js
5. Set the **Root Directory** to `backend` in project settings
6. Railway will automatically deploy and give you a URL
7. Update your frontend `apiConfig.js` with the Railway URL

**Railway automatically:**
- Detects Node.js
- Runs `npm install`
- Runs `npm start`
- Provides HTTPS URL

### Option 2: Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `indoor-nav-api`
   - **Root Directory**: `backend`
   - **Build Command**: `cd backend && npm install && node convertDataFiles.js`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Click "Create Web Service"
6. Render will deploy and give you a URL (e.g., `https://indoor-nav-api.onrender.com`)
7. Update your frontend `apiConfig.js` with the Render URL

### Option 3: Heroku

1. Install Heroku CLI: [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Deploy:
   ```bash
   cd backend
   git init  # if not already a git repo
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
6. The Procfile is already included, so Heroku will auto-detect it
7. Get your URL: `heroku info` or check the Heroku dashboard
8. Update your frontend `apiConfig.js` with the Heroku URL

### Option 4: DigitalOcean App Platform

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create → Apps → GitHub
3. Connect repository
4. Configure:
   - **Type**: Web Service
   - **Source Directory**: `backend`
   - **Build Command**: `npm install && node convertDataFiles.js`
   - **Run Command**: `npm start`
5. Deploy and get your URL
6. Update your frontend `apiConfig.js`

### Option 5: AWS/Google Cloud/Azure

For these platforms, you'll need to:
1. Set up a VM or container service
2. Install Node.js
3. Clone your repository
4. Run `npm install` and `node convertDataFiles.js`
5. Use PM2 or similar to keep the server running
6. Set up reverse proxy (nginx) for HTTPS
7. Configure firewall rules

## Important Pre-Deployment Steps

### 1. Convert Data Files

Make sure the data files are converted before deploying:

```bash
cd backend
node convertDataFiles.js
```

**Note**: Some platforms (like Render) can run this in the build command.

### 2. Environment Variables

Set these in your hosting platform's environment variables:

- `PORT` - Usually auto-set by the platform (Heroku, Railway, etc.)
- `NODE_ENV=production` - For production mode

### 3. Update Frontend Configuration

After deployment, update `utils/apiConfig.js`:

```javascript
export const API_BASE_URL = 'https://your-deployed-api-url.com/api';
```

## Testing Your Deployment

### 1. Health Check

```bash
curl https://your-api-url.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Indoor Navigation API is running",
  "timestamp": "..."
}
```

### 2. Pathfinding Test

```bash
curl -X POST https://your-api-url.com/api/pathfinding \
  -H "Content-Type: application/json" \
  -d '{"startGridId": 83, "endGridId": 104}'
```

## Troubleshooting

### Build Fails

- Make sure `convertDataFiles.js` runs during build
- Check that data files exist in `backend/data/`
- Verify Node.js version (should be 14+)

### Server Crashes

- Check logs in your hosting platform
- Verify PORT environment variable is set
- Ensure all dependencies are in `package.json`

### CORS Issues

- The server already has CORS enabled
- If issues persist, check the `cors` middleware in `server.js`

### Data Files Not Found

- Ensure `convertDataFiles.js` runs before `npm start`
- Check that `backend/data/` directory exists
- Verify file paths in `server.js`

## Custom Domain Setup

Most platforms allow custom domains:

1. **Railway**: Settings → Domains → Add Custom Domain
2. **Render**: Settings → Custom Domains
3. **Heroku**: Settings → Domains → Add Domain

After adding a custom domain, update your frontend `apiConfig.js` with the new domain.

## Monitoring

Consider adding:
- Health check monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Log aggregation (Logtail, Papertrail)

## Cost Estimates

- **Railway**: Free tier available, ~$5/month for production
- **Render**: Free tier available, ~$7/month for production
- **Heroku**: Free tier discontinued, ~$7/month minimum
- **DigitalOcean**: ~$5/month for basic droplet

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting for production
2. **Authentication**: Add API keys if needed
3. **HTTPS**: Most platforms provide this automatically
4. **Environment Variables**: Never commit secrets

## Next Steps After Deployment

1. Update frontend `apiConfig.js` with production URL
2. Test the app with the remote API
3. Set up monitoring
4. Configure custom domain (optional)
5. Add error tracking (optional)

