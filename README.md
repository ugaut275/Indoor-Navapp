# Indoor Navigation App

A React Native mobile application for indoor navigation with pathfinding capabilities using a hexagonal grid system.

## Features

- Interactive map with hexagonal grid overlay
- Pathfinding using A* algorithm
- Accessibility options (avoid stairs, wheelchair friendly, elevator only)
- User authentication with Firebase
- Backend API for pathfinding calculations

## Project Structure

```
Indoor-Navapp/
├── app/                    # Expo Router app files
│   ├── views/             # Screen components
│   └── _layout.js         # Root layout
├── components/            # Reusable components
├── utils/                 # Utility functions and API clients
├── backend/               # Backend API server
│   ├── server.js           # Express server
│   ├── pathfinding.js   # A* algorithm
│   └── data/            # Grid data files
└── scripts/              # Utility scripts
```

## Setup

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Configure API URL:**
   - For local development: Update `utils/apiConfig.js` if needed
   - For production: Update `utils/apiConfig.js` with your deployed API URL
   - Or use the helper script: `node scripts/updateApiUrl.js https://your-api-url.com`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Convert data files:**
   ```bash
   node convertDataFiles.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

The API will run on `http://localhost:3000`

## Deployment

### Quick Deploy (Recommended)

See `QUICK_DEPLOY.md` for the fastest deployment options (Railway or Render).

### Detailed Deployment

See `backend/DEPLOYMENT.md` for comprehensive deployment instructions for various platforms.

### Deployment Checklist

See `DEPLOYMENT_CHECKLIST.md` for a step-by-step checklist.

## API Endpoints

### Health Check
```
GET /api/health
```

### Pathfinding
```
POST /api/pathfinding
Content-Type: application/json

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

## Configuration

### Frontend API Configuration

Edit `utils/apiConfig.js` to set your API URL:

```javascript
export const API_BASE_URL = 'https://your-api-url.com/api';
```

### Backend Configuration

The backend uses environment variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Testing

### Test Backend Locally

```bash
# Health check
curl http://localhost:3000/api/health

# Pathfinding
curl -X POST http://localhost:3000/api/pathfinding \
  -H "Content-Type: application/json" \
  -d '{"startGridId": 83, "endGridId": 104}'
```

### Test in App

1. Start the backend server
2. Start the Expo app
3. Navigate to Map View
4. Select start and destination points
5. Verify path is calculated and displayed

## Troubleshooting

### API Connection Issues

- **iOS Simulator**: Use `localhost:3000`
- **Android Emulator**: Use `10.0.2.2:3000` instead of `localhost`
- **Physical Device**: Use your computer's IP address

### Backend Issues

- Ensure data files are converted: `node convertDataFiles.js`
- Check that all dependencies are installed
- Verify PORT environment variable is set

## Documentation

- `API_SETUP.md` - API integration guide
- `QUICK_DEPLOY.md` - Quick deployment guide
- `backend/DEPLOYMENT.md` - Detailed deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `backend/README.md` - Backend API documentation

## License

ISC
