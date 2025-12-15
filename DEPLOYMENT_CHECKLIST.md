# Deployment Checklist

Use this checklist when deploying the backend API to a remote host.

## Pre-Deployment

- [ ] Data files converted (`node convertDataFiles.js`)
- [ ] All dependencies in `package.json`
- [ ] Environment variables documented
- [ ] CORS configured correctly
- [ ] Error handling in place

## Deployment Steps

### 1. Choose Hosting Platform
- [ ] Railway
- [ ] Render
- [ ] Heroku
- [ ] DigitalOcean
- [ ] AWS/Google Cloud/Azure
- [ ] Other: _______________

### 2. Platform Setup
- [ ] Create account on hosting platform
- [ ] Connect GitHub repository (if applicable)
- [ ] Set root directory to `backend`
- [ ] Configure build command (if needed)
- [ ] Configure start command (if needed)
- [ ] Set environment variables

### 3. Build Configuration
- [ ] Build command includes: `npm install && node convertDataFiles.js`
- [ ] Start command: `npm start` or `node server.js`
- [ ] Node.js version specified (if needed)

### 4. Deploy
- [ ] Initial deployment successful
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Pathfinding endpoint works

### 5. Frontend Update
- [ ] Update `utils/apiConfig.js` with production URL
- [ ] Test API connection from app
- [ ] Verify pathfinding works in app

### 6. Testing
- [ ] Health check: `GET /api/health`
- [ ] Pathfinding: `POST /api/pathfinding` with test data
- [ ] Error handling (invalid grid IDs)
- [ ] CORS working (if testing from browser)

### 7. Post-Deployment
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up error tracking (optional)
- [ ] Document API URL for team

## Quick Test Commands

```bash
# Health check
curl https://your-api-url.com/api/health

# Pathfinding test
curl -X POST https://your-api-url.com/api/pathfinding \
  -H "Content-Type: application/json" \
  -d '{"startGridId": 83, "endGridId": 104}'
```

## Common Issues

- **Data files not found**: Run `convertDataFiles.js` in build step
- **Port issues**: Platform usually sets PORT automatically
- **CORS errors**: Already configured, but check if domain needs whitelisting
- **Build fails**: Check Node.js version and dependencies

## Support

Refer to `backend/DEPLOYMENT.md` for detailed platform-specific instructions.

