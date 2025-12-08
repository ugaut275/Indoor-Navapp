/**
 * Utility to load and parse grid data from CSV
 */

/**
 * Parse a CSV row and extract grid information
 * @param {string} row - CSV row string
 * @returns {Object|null} - Grid object with id and center coordinates, or null if invalid
 */
export const parseGridRow = (row) => {
    try {
        // Split by comma, but handle quoted values
        const parts = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim()); // Add last part
        
        if (parts.length < 2) return null;
        
        const id = parseInt(parts[0], 10);
        if (isNaN(id)) return null;
        
        // Parse center coordinates - format: "[x, y]"
        const centerStr = parts[1].replace(/^\[|\]$/g, ''); // Remove brackets
        const centerParts = centerStr.split(',').map(s => parseFloat(s.trim()));
        
        if (centerParts.length !== 2 || isNaN(centerParts[0]) || isNaN(centerParts[1])) {
            return null;
        }
        
        return {
            id,
            center: [centerParts[0], centerParts[1]],
            availability: parts[2] === 't',
        };
    } catch (error) {
        console.error('Error parsing grid row:', error);
        return null;
    }
};

/**
 * Load grid data from CSV file
 * @param {string} csvContent - CSV file content as string
 * @returns {Array} - Array of grid objects
 */
export const loadGridDataFromCSV = (csvContent) => {
    const lines = csvContent.split('\n');
    const grids = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const grid = parseGridRow(line);
        if (grid) {
            grids.push(grid);
        }
    }
    
    return grids;
};

/**
 * Calculate map bounds from grid data
 * @param {Array} grids - Array of grid objects
 * @returns {Object} - Bounds object with minX, maxX, minY, maxY
 */
export const calculateMapBounds = (grids) => {
    if (grids.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    grids.forEach(grid => {
        const [x, y] = grid.center;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    });
    
    return { minX, maxX, minY, maxY };
};

