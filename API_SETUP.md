# API Integration Setup Guide

This guide explains how to set up and use the backend API for pathfinding in the Indoor Navigation app.

## Overview

The pathfinding algorithm has been migrated from the frontend to a backend API. The app now communicates with the backend using HTTP POST requests to calculate paths.

## Backend Setup

### 1. Install Backend Dependencies

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### 2. Convert Data Files

The data files need to be converted from ES6 modules to CommonJS format:

```bash
node convertDataFiles.js
```

This creates `backend/data/gridData.js` and `backend/data/gridNeighborsData.js`.

### 3. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

For development with auto-reload:

```bash
npm run dev
```

## Frontend Configuration

### Development Setup

1. **For iOS Simulator**: The default `localhost:3000` should work.

2. **For Android Emulator**: Update `utils/apiConfig.js` to use `10.0.2.2` instead of `localhost`:
   ```javascript
   export const API_BASE_URL = 'http://10.0.2.2:3000/api';
   ```

3. **For Physical Devices**: Use your computer's local IP address:
   ```javascript
   export const API_BASE_URL = 'http://192.168.1.XXX:3000/api';  // Replace XXX with your IP
   ```

### Production Setup

When deploying to production:

1. Deploy your backend API to a hosting service (Heroku, Railway, Render, etc.)
2. Update `utils/apiConfig.js` with your production API URL:
   ```javascript
   export const API_BASE_URL = 'https://your-api-domain.com/api';
   ```

## API Endpoints

### Health Check
```
GET /api/health
```

### Pathfinding
```
POST /api/pathfinding
```

**Request:**
```json
{
  "startGridId": 83,
  "endGridId": 104,
  "options": {
    "avoidStairs": false,
    "wheelchairFriendly": false,
    "elevatorOnly": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "path": [83, 84, 85, 104],
  "startGridId": 83,
  "endGridId": 104,
  "pathLength": 4
}
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Pathfinding
curl -X POST http://localhost:3000/api/pathfinding \
  -H "Content-Type: application/json" \
  -d '{"startGridId": 83, "endGridId": 104}'
```

### Using the App

1. Start the backend server
2. Start your Expo app
3. Navigate to the Map View
4. Select start and destination points
5. The app will automatically call the API to calculate the path

## Troubleshooting

### "Network request failed" Error

- **iOS Simulator**: Make sure the backend is running on `localhost:3000`
- **Android Emulator**: Change `localhost` to `10.0.2.2` in `apiConfig.js`
- **Physical Device**: Use your computer's IP address instead of `localhost`

### "No path found" Error

- Verify that both grid IDs exist in the system
- Check the backend console for error messages
- Ensure the data files were converted correctly

### Backend Won't Start

- Make sure you ran `node convertDataFiles.js` to create the data files
- Check that all dependencies are installed: `npm install`
- Verify the port 3000 is not already in use

## Deployment Options

### Heroku

1. Create a `Procfile` in the backend directory:
   ```
   web: node server.js
   ```

2. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Railway

1. Connect your GitHub repository
2. Set the root directory to `backend`
3. Railway will auto-detect Node.js and start the server

### Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`

## Next Steps

- Implement accessibility options filtering in the backend
- Add caching for frequently requested paths
- Add authentication if needed
- Add rate limiting for production

