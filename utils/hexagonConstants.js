/**
 * Hexagon grid constants matching the backend Hexagon.py
 * These values must match exactly with the backend implementation
 */

/**
 * Fixed area per hexagon in square meters
 * Each hexagon has exactly 41.569216 m² area (diameter = 8m, radius = 4m)
 * This matches HEX_AREA_SQUARE_METERS from backend
 */
export const HEX_AREA_SQUARE_METERS = 41.569216;

/**
 * Fixed hexagon radius in meters
 * Calculated as: sqrt(HEX_AREA_SQUARE_METERS / 2.598076)
 * This matches HEX_RADIUS_METERS from backend (approximately 4.0 meters)
 * 
 * Formula: For a regular hexagon, area = (3 * sqrt(3) / 2) * radius²
 * Therefore: radius = sqrt(area / (3 * sqrt(3) / 2))
 * Simplified: radius = sqrt(area / 2.598076)
 */
export const HEX_RADIUS_METERS = Math.sqrt(HEX_AREA_SQUARE_METERS / 2.598076);

/**
 * Hexagon dimensions for grid generation
 * These match the backend's create_hexagonal_grid() function
 */
export const HEX_WIDTH = HEX_RADIUS_METERS * 2; // Width across flat sides
export const HEX_HEIGHT = HEX_RADIUS_METERS * Math.sqrt(3); // Height across pointy sides

/**
 * Grid spacing for hexagonal tiling
 * These match the backend's col_spacing and row_spacing calculations
 */
export const COL_SPACING = HEX_RADIUS_METERS * 1.5; // Horizontal spacing (0.75 * hex_width)
export const ROW_SPACING = HEX_HEIGHT; // Vertical spacing

/**
 * Get the fixed hexagon radius in meters
 * This matches the backend's get_hex_radius_meters() function
 * @returns {number} - Fixed hexagon radius (approximately 4.0 meters)
 */
export const getHexRadiusMeters = () => {
    return HEX_RADIUS_METERS;
};

/**
 * Get the fixed hexagon area in square meters
 * This matches the backend's get_hex_area_square_meters() function
 * @returns {number} - Fixed hexagon area (41.569216 m²)
 */
export const getHexAreaSquareMeters = () => {
    return HEX_AREA_SQUARE_METERS;
};

