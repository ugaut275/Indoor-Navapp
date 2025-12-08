/**
 * Pathfinding utilities using A* algorithm
 * Works with the hexagonal grid system
 */

/**
 * A* pathfinding algorithm
 * @param {number} startId - Starting grid ID
 * @param {number} goalId - Destination grid ID
 * @param {Object} neighborsMap - Map of gridId -> [{id, distance}, ...]
 * @param {Object} gridCentersMap - Map of gridId -> [x, y] center coordinates
 * @returns {Array} - Array of grid IDs representing the path, or empty array if no path found
 */
export const findPath = (startId, goalId, neighborsMap, gridCentersMap) => {
    if (startId === goalId) {
        return [startId];
    }
    
    if (!neighborsMap[startId] || !neighborsMap[goalId]) {
        console.warn(`Missing neighbor data for start ${startId} or goal ${goalId}`);
        return [];
    }
    
    // Heuristic function: Euclidean distance between grid centers
    const heuristic = (id1, id2) => {
        const center1 = gridCentersMap[id1];
        const center2 = gridCentersMap[id2];
        if (!center1 || !center2) return Infinity;
        
        const dx = center1[0] - center2[0];
        const dy = center1[1] - center2[1];
        return Math.sqrt(dx * dx + dy * dy);
    };
    
    // A* algorithm
    const openSet = new Set([startId]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    gScore.set(startId, 0);
    fScore.set(startId, heuristic(startId, goalId));
    
    while (openSet.size > 0) {
        // Find node in openSet with lowest fScore
        let current = null;
        let lowestF = Infinity;
        for (const id of openSet) {
            const f = fScore.get(id) ?? Infinity;
            if (f < lowestF) {
                lowestF = f;
                current = id;
            }
        }
        
        if (current === null) break;
        
        if (current === goalId) {
            // Reconstruct path
            const path = [current];
            while (cameFrom.has(current)) {
                current = cameFrom.get(current);
                path.unshift(current);
            }
            return path;
        }
        
        openSet.delete(current);
        
        // Check all neighbors
        const neighbors = neighborsMap[current] || [];
        for (const neighbor of neighbors) {
            const neighborId = neighbor.id;
            const tentativeGScore = (gScore.get(current) ?? Infinity) + neighbor.distance;
            
            if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
                cameFrom.set(neighborId, current);
                gScore.set(neighborId, tentativeGScore);
                fScore.set(neighborId, tentativeGScore + heuristic(neighborId, goalId));
                
                if (!openSet.has(neighborId)) {
                    openSet.add(neighborId);
                }
            }
        }
    }
    
    // No path found
    return [];
};

/**
 * Create a map of gridId -> center coordinates from grid data
 * @param {Array} grids - Array of grid objects with {id, center}
 * @returns {Object} - Map of gridId -> [x, y]
 */
export const createGridCentersMap = (grids) => {
    const map = {};
    grids.forEach(grid => {
        map[grid.id] = grid.center;
    });
    return map;
};



