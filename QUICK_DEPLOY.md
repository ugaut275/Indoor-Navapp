# Quick Deployment Guide

## Fastest Option: Railway (Recommended)

### Step 1: Prepare Repository
Make sure your code is pushed to GitHub.

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login (free with GitHub)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect everything!
6. In project settings, set **Root Directory** to `backend`
7. Railway will automatically:
   - Install dependencies
   - Run the server
   - Give you a URL like `https://your-app.up.railway.app`

### Step 3: Update Frontend
Update `utils/apiConfig.js`:

```javascript
export const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

**That's it!** Your API is live. 🎉

---

## Alternative: Render (Also Easy)

### Step 1: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/login
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `indoor-nav-api`
   - **Root Directory**: `backend`
   - **Build Command**: `cd backend && npm install && node convertDataFiles.js`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
6. Click **"Create Web Service"**
7. Wait for deployment (takes 2-3 minutes)
8. Get your URL: `https://indoor-nav-api.onrender.com`

### Step 2: Update Frontend
Update `utils/apiConfig.js`:

```javascript
export const API_BASE_URL = 'https://indoor-nav-api.onrender.com/api';
```

---

## Test Your Deployment

### Health Check
```bash
curl https://your-api-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Indoor Navigation API is running",
  "timestamp": "..."
}
```

### Pathfinding Test
```bash
curl -X POST https://your-api-url.com/api/pathfinding \
  -H "Content-Type: application/json" \
  -d '{"startGridId": 83, "endGridId": 104}'
```

Expected response:
```json
{
  "success": true,
  "path": [83, ...],
  "startGridId": 83,
  "endGridId": 104,
  "pathLength": 4
}
```

---

## Troubleshooting

### "Data files not found" error
- Make sure `convertDataFiles.js` runs during build
- Check that `backend/data/` directory exists in your repository

### CORS errors
- The server already has CORS enabled
- If issues persist, check your hosting platform's CORS settings

### Server won't start
- Check the logs in your hosting platform
- Verify PORT environment variable is set (usually auto-set)

---

## Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Test the API endpoints
3. ✅ Update frontend `apiConfig.js` with production URL
4. ✅ Test the app with remote API
5. ✅ (Optional) Set up custom domain

For detailed instructions, see `backend/DEPLOYMENT.md`

