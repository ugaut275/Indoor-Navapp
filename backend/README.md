# Indoor Navigation API Backend

Backend API server for the Indoor Navigation mobile app. Provides pathfinding services using the A* algorithm.

## Features

- RESTful API for pathfinding calculations
- A* pathfinding algorithm implementation
- Health check endpoint
- CORS enabled for cross-origin requests

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Convert data files (if needed):**
   ```bash
   node convertDataFiles.js
   ```
   This converts the frontend data files to CommonJS format.

3. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

**Response:**
```json
{
  "status": "ok",
  "message": "Indoor Navigation API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Pathfinding
```
POST /api/pathfinding
```

**Request Body:**
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

**Response (Success):**
```json
{
  "success": true,
  "path": [83, 84, 85, 104],
  "startGridId": 83,
  "endGridId": 104,
  "pathLength": 4
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Deployment

This API can be deployed to various platforms:

- **Heroku**: Add a `Procfile` with `web: node server.js`
- **Railway**: Automatically detects Node.js
- **Render**: Connect your repository
- **AWS/Google Cloud/Azure**: Use their Node.js hosting services

Make sure to:
1. Set the `PORT` environment variable if required by your hosting platform
2. Update the frontend `apiConfig.js` with your production API URL
3. Ensure CORS is configured correctly for your frontend domain

## Development

The server uses Express.js and includes:
- CORS middleware for cross-origin requests
- JSON body parsing
- Error handling
- Logging

## Future Enhancements

- Implement accessibility options filtering (avoidStairs, wheelchairFriendly, elevatorOnly)
- Add caching for frequently requested paths
- Add rate limiting
- Add authentication/authorization
- Add path optimization options

