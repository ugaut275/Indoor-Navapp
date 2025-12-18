/**
 * API Configuration
 * Change this to your backend API URL when deploying
 * 
 * IMPORTANT NOTES:
 * - iOS Simulator: Use 'http://localhost:3000/api'
 * - Android Emulator: Use 'http://10.0.2.2:3000/api' (10.0.2.2 is the Android emulator's alias for localhost)
 * - Physical Devices: Use 'http://YOUR_COMPUTER_IP:3000/api' (e.g., 'http://192.168.1.100:3000/api')
 * - Production: Replace with your deployed API URL
 */

// For development - use localhost or your backend URL
// For production, replace with your actual API URL
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

// Railway API URL - Production
export const API_BASE_URL = 'https://indoor-navapp-production.up.railway.app/api';

export const API_ENDPOINTS = {
    PATHFINDING: '/pathfinding',
    HEALTH: '/health',
};

