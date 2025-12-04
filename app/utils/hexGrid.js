/**
 * Hexagonal Grid Utilities
 *
 * This module provides utilities for working with the hexagonal grid system
 * used for indoor navigation. It replicates the backend hex grid generation
 * algorithm to enable coordinate-to-grid-ID mapping in the frontend.
 */

// Constants matching backend configuration (from Hexagon.py)
export const HEX_AREA_SQUARE_METERS = 41.569216;
export const HEX_RADIUS_METERS = Math.sqrt(HEX_AREA_SQUARE_METERS / 2.598076); // ~4.0 meters

// Map bounds (from building_info.csv)
export const MAP_WIDTH_METERS = 101.12;
export const MAP_HEIGHT_METERS = 123.64;
export const TOTAL_HEX_COUNT = 342;

// Hexagon geometry calculations
export const HEX_WIDTH = HEX_RADIUS_METERS * 2;
export const HEX_HEIGHT = HEX_RADIUS_METERS * Math.sqrt(3);
export const COL_SPACING = HEX_RADIUS_METERS * 1.5; // 6.0 meters
export const ROW_SPACING = HEX_HEIGHT; // ~6.928 meters

/**
 * Generate all hexagon centers in the same order as backend
 * This ensures grid IDs match between frontend and backend
 */
export function generateHexCenters() {
  const cols = Math.ceil(MAP_WIDTH_METERS / COL_SPACING) + 1;
  const rows = Math.ceil(MAP_HEIGHT_METERS / ROW_SPACING) + 1;

  const centers = [];

  // Generate centers in row-major order (by y, then x)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * COL_SPACING;
      let y = row * ROW_SPACING;

      // Offset every other column for hexagonal tiling
      if (col % 2 === 1) {
        y += ROW_SPACING / 2;
      }

      centers.push({ x, y, row, col });
    }
  }

  // Sort by y first, then x (row-major order) for consistent ID assignment
  centers.sort((a, b) => {
    const yDiff = Math.round(a.y * 1e6) - Math.round(b.y * 1e6);
    if (yDiff !== 0) return yDiff;
    return Math.round(a.x * 1e6) - Math.round(b.x * 1e6);
  });

  return centers;
}

/**
 * Create hexagon vertices for a given center point
 * Returns 6 vertices forming a regular hexagon
 */
export function createHexagonVertices(centerX, centerY, radius = HEX_RADIUS_METERS) {
  const vertices = [];

  // Generate 6 equally-spaced vertices around the center
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // 60 degrees in radians
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push({ x, y });
  }

  return vertices;
}

/**
 * Check if a point is inside a hexagon using ray casting algorithm
 */
export function isPointInHexagon(point, hexVertices) {
  let inside = false;
  const { x, y } = point;

  for (let i = 0, j = hexVertices.length - 1; i < hexVertices.length; j = i++) {
    const xi = hexVertices[i].x;
    const yi = hexVertices[i].y;
    const xj = hexVertices[j].x;
    const yj = hexVertices[j].y;

    const intersect = ((yi > y) !== (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Calculate Euclidean distance between two points
 */
export function calculateDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert click coordinate (in meters) to grid ID
 *
 * This is the reverse of the grid generation process.
 * Given a coordinate in meters, find which hex grid it belongs to.
 *
 * @param {number} x - X coordinate in meters
 * @param {number} y - Y coordinate in meters
 * @param {Array} gridCenters - Array of hex centers (from generateHexCenters or database)
 * @returns {number|null} - Grid ID or null if outside all grids
 */
export function getGridIdFromCoordinate(x, y, gridCenters) {
  // Quick method: Find the closest center
  let minDistance = Infinity;
  let closestGridId = null;

  for (let i = 0; i < gridCenters.length; i++) {
    const center = gridCenters[i];
    const distance = calculateDistance({ x, y }, { x: center.x, y: center.y });

    if (distance < minDistance) {
      minDistance = distance;
      closestGridId = i;
    }
  }

  // Verify the point is actually inside the hexagon
  if (closestGridId !== null) {
    const center = gridCenters[closestGridId];
    const hexVertices = createHexagonVertices(center.x, center.y);

    if (isPointInHexagon({ x, y }, hexVertices)) {
      return closestGridId;
    }
  }

  return null; // Outside all grids
}

/**
 * Convert pixel coordinates to meter coordinates
 *
 * @param {number} pixelX - X coordinate in pixels
 * @param {number} pixelY - Y coordinate in pixels
 * @param {number} imageWidth - Image width in pixels
 * @param {number} imageHeight - Image height in pixels
 * @returns {Object} - {x, y} in meters
 */
export function pixelToMeter(pixelX, pixelY, imageWidth, imageHeight) {
  // Calculate pixels per meter
  const pixelsPerMeterX = imageWidth / MAP_WIDTH_METERS;
  const pixelsPerMeterY = imageHeight / MAP_HEIGHT_METERS;

  // Convert to meters
  const x = pixelX / pixelsPerMeterX;
  const y = pixelY / pixelsPerMeterY;

  return { x, y };
}

/**
 * Convert meter coordinates to pixel coordinates
 *
 * @param {number} meterX - X coordinate in meters
 * @param {number} meterY - Y coordinate in meters
 * @param {number} imageWidth - Image width in pixels
 * @param {number} imageHeight - Image height in pixels
 * @returns {Object} - {x, y} in pixels
 */
export function meterToPixel(meterX, meterY, imageWidth, imageHeight) {
  // Calculate pixels per meter
  const pixelsPerMeterX = imageWidth / MAP_WIDTH_METERS;
  const pixelsPerMeterY = imageHeight / MAP_HEIGHT_METERS;

  // Convert to pixels
  const x = meterX * pixelsPerMeterX;
  const y = meterY * pixelsPerMeterY;

  return { x, y };
}

/**
 * Load grid centers from database data
 * This should be called with the actual grid data from your backend
 *
 * @param {Array} gridsData - Array of grid objects from database with {id, center} format
 * @returns {Array} - Array of centers in grid ID order
 */
export function loadGridCentersFromData(gridsData) {
  // Sort by ID to ensure correct ordering
  const sorted = [...gridsData].sort((a, b) => a.id - b.id);

  return sorted.map(grid => ({
    x: grid.center[0],
    y: grid.center[1],
    id: grid.id
  }));
}
