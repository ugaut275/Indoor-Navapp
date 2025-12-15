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

// TODO: Update this URL based on your testing environment
// For Android emulator, change localhost to 10.0.2.2
// For physical devices, replace with your computer's local IP address
export const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3000/api'  // Development - local backend
    : 'https://your-api-domain.com/api';  // Production - replace with your actual URL

export const API_ENDPOINTS = {
    PATHFINDING: '/pathfinding',
    HEALTH: '/health',
};

