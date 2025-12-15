/**
 * Pathfinding API Service
 * Handles communication with the backend pathfinding API
 */

import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';

/**
 * Request pathfinding from the backend API
 * @param {number} startGridId - Starting grid ID
 * @param {number} endGridId - Destination grid ID
 * @param {Object} options - Optional pathfinding preferences
 * @param {boolean} options.avoidStairs - Whether to avoid stairs
 * @param {boolean} options.wheelchairFriendly - Whether path should be wheelchair friendly
 * @param {boolean} options.elevatorOnly - Whether to use elevators only
 * @returns {Promise<Array<number>>} - Array of grid IDs representing the path
 */
export const findPath = async (startGridId, endGridId, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PATHFINDING}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startGridId: Number(startGridId),
                endGridId: Number(endGridId),
                options: {
                    avoidStairs: options.avoidStairs || false,
                    wheelchairFriendly: options.wheelchairFriendly || false,
                    elevatorOnly: options.elevatorOnly || false,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.path)) {
            return data.path;
        } else {
            throw new Error(data.message || 'Invalid response format');
        }
    } catch (error) {
        console.error('Pathfinding API error:', error);
        throw error;
    }
};

/**
 * Check if the API is available
 * @returns {Promise<boolean>} - True if API is available
 */
export const checkApiHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`, {
            method: 'GET',
        });
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
};

