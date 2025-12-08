/**
 * Utility functions for hexagonal grid operations
 * Based on the backend Hexagon.py implementation
 */

import { getHexRadiusMeters } from './hexagonConstants';

/**
 * Calculate hexagon radius from grid spacing (fallback method)
 * This function now always returns the fixed radius from backend
 * For hexagonal grids: hex_width = hex_radius * 2, hex_height = hex_radius * sqrt(3)
 * col_spacing = hex_radius * 1.5, row_spacing = hex_radius * sqrt(3)
 * @param {Array} centers - Array of grid centers (unused, kept for compatibility)
 * @returns {number} - Fixed hexagon radius (approximately 4.0 meters)
 */
export const calculateHexRadius = (centers) => {
    // Always use the fixed radius from backend to match Hexagon.py
    return getHexRadiusMeters();
};

/**
 * Generate hexagon vertices (6 points) around a center
 * Matches the backend's create_hexagon() function exactly
 * @param {number} centerX - X coordinate of hexagon center
 * @param {number} centerY - Y coordinate of hexagon center
 * @param {number} radius - Hexagon radius (distance from center to vertex)
 * @returns {Array} - Array of 6 vertices [x, y] pairs
 */
export const generateHexagonVertices = (centerX, centerY, radius) => {
    // Match backend: np.linspace(0, 2*np.pi, 7)[:-1] creates 6 angles
    // This generates angles: 0, π/3, 2π/3, π, 4π/3, 5π/3
    const vertices = [];
    for (let i = 0; i < 6; i++) {
        const angle = (2 * Math.PI / 6) * i; // Same as (Math.PI / 3) * i
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        vertices.push([x, y]);
    }
    return vertices;
};

/**
 * Check if a point is inside a hexagon
 * Uses ray casting algorithm
 * @param {number} pointX - X coordinate of point
 * @param {number} pointY - Y coordinate of point
 * @param {number} centerX - X coordinate of hexagon center
 * @param {number} centerY - Y coordinate of hexagon center
 * @param {number} radius - Hexagon radius
 * @returns {boolean} - True if point is inside hexagon
 */
export const isPointInHexagon = (pointX, pointY, centerX, centerY, radius) => {
    // Calculate distance from center
    const dx = pointX - centerX;
    const dy = pointY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Simple circle check first (hexagon is inscribed in a circle)
    if (distance > radius) {
        return false;
    }
    
    // More precise hexagon check using the fact that a hexagon can be divided into 6 triangles
    // For a regular hexagon, we can check if the point is within the hexagon bounds
    // by checking if it's within the bounding box and then doing a more precise check
    
    // Get hexagon vertices
    const vertices = generateHexagonVertices(centerX, centerY, radius);
    
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i][0], yi = vertices[i][1];
        const xj = vertices[j][0], yj = vertices[j][1];
        
        const intersect = ((yi > pointY) !== (yj > pointY)) &&
            (pointX < (xj - xi) * (pointY - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

/**
 * Find the nearest grid ID to a given point
 * @param {number} pointX - X coordinate of point (in map coordinates)
 * @param {number} pointY - Y coordinate of point (in map coordinates)
 * @param {Array} grids - Array of grid objects with id and center
 * @param {number} hexRadius - Hexagon radius
 * @returns {number|null} - Grid ID or null if not found
 */
export const findNearestGridId = (pointX, pointY, grids, hexRadius) => {
    if (grids.length === 0) return null;
    
    let nearestGrid = null;
    let minDistance = Infinity;
    
    // First, try to find a grid where the point is inside the hexagon
    for (const grid of grids) {
        const [centerX, centerY] = grid.center;
        if (isPointInHexagon(pointX, pointY, centerX, centerY, hexRadius)) {
            return grid.id;
        }
    }
    
    // If no hexagon contains the point, find the nearest center
    for (const grid of grids) {
        const [centerX, centerY] = grid.center;
        const distance = Math.sqrt(
            Math.pow(pointX - centerX, 2) +
            Math.pow(pointY - centerY, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestGrid = grid;
        }
    }
    
    // Only return if within reasonable distance (2 * radius)
    if (nearestGrid && minDistance <= hexRadius * 2) {
        return nearestGrid.id;
    }
    
    return null;
};

/**
 * Convert screen coordinates to map coordinates
 * @param {number} screenX - X coordinate relative to the image (from locationX)
 * @param {number} screenY - Y coordinate relative to the image (from locationY)
 * @param {Object} mapBounds - Map bounds {minX, maxX, minY, maxY}
 * @param {number} imageWidth - Width of the map image in pixels (from source)
 * @param {number} imageHeight - Height of the map image in pixels (from source)
 * @param {Object} imageLayout - Layout object from onLayout {x, y, width, height}
 * @returns {Object} - Map coordinates {x, y}
 */
export const screenToMapCoordinates = (screenX, screenY, mapBounds, imageWidth, imageHeight, imageLayout) => {
    // Calculate scale factors
    const mapWidth = mapBounds.maxX - mapBounds.minX;
    const mapHeight = mapBounds.maxY - mapBounds.minY;
    
    // screenX and screenY are already relative to the Pressable/Image component
    // Get relative position within the displayed image (0.0 to 1.0)
    const relativeX = screenX / imageLayout.width;
    const relativeY = screenY / imageLayout.height;
    
    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const clampedY = Math.max(0, Math.min(1, relativeY));
    
    // Convert to map coordinates
    const mapX = mapBounds.minX + clampedX * mapWidth;
    const mapY = mapBounds.minY + clampedY * mapHeight;
    
    return { x: mapX, y: mapY };
};

