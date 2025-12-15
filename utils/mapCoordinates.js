/**
 * Coordinate transformation utilities for map visualization
 */

/**
 * Convert map coordinates to screen coordinates
 * @param {number} mapX - X coordinate in map space
 * @param {number} mapY - Y coordinate in map space
 * @param {Object} mapBounds - Map bounds {minX, maxX, minY, maxY}
 * @param {Object} imageLayout - Layout object from onLayout {x, y, width, height}
 * @returns {Object} - Screen coordinates {x, y}
 */
export const mapToScreenCoordinates = (mapX, mapY, mapBounds, imageLayout) => {
    const mapWidth = mapBounds.maxX - mapBounds.minX;
    const mapHeight = mapBounds.maxY - mapBounds.minY;
    
    // Get relative position in map (0.0 to 1.0)
    const relativeX = (mapX - mapBounds.minX) / mapWidth;
    const relativeY = (mapY - mapBounds.minY) / mapHeight;
    
    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const clampedY = Math.max(0, Math.min(1, relativeY));
    
    // Convert to screen coordinates
    const screenX = imageLayout.x + clampedX * imageLayout.width;
    const screenY = imageLayout.y + clampedY * imageLayout.height;
    
    return { x: screenX, y: screenY };
};

