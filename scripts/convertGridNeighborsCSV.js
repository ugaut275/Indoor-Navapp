/**
 * Script to convert grid_neighbors.csv to gridNeighborsData.js
 * Run with: node scripts/convertGridNeighborsCSV.js
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../database_files/grid_neighbors.csv');
const outputPath = path.join(__dirname, '../utils/gridNeighborsData.js');

function parseNeighborRow(row) {
    try {
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
        parts.push(current.trim());
        
        if (parts.length < 3) return null;
        
        const gridId = parseInt(parts[0], 10);
        if (isNaN(gridId)) return null;
        
        // Parse neighbor_ids - format: "[1, 2, 3]"
        const neighborIdsStr = parts[1].replace(/^\[|\]$/g, '');
        const neighborIds = neighborIdsStr.split(',').map(s => parseInt(s.trim(), 10)).filter(id => !isNaN(id));
        
        // Parse distances - format: "[1.5, 2.3, 1.8]"
        const distancesStr = parts[2].replace(/^\[|\]$/g, '');
        const distances = distancesStr.split(',').map(s => parseFloat(s.trim())).filter(d => !isNaN(d));
        
        if (neighborIds.length !== distances.length) {
            console.warn(`Mismatch in neighbors for grid ${gridId}: ${neighborIds.length} neighbors, ${distances.length} distances`);
            return null;
        }
        
        // Create array of {neighborId, distance} pairs
        const neighbors = neighborIds.map((id, idx) => ({
            id,
            distance: distances[idx]
        }));
        
        return {
            gridId,
            neighbors
        };
    } catch (error) {
        console.error('Error parsing row:', error);
        return null;
    }
}

try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    const neighborsMap = {};
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const data = parseNeighborRow(line);
        if (data) {
            neighborsMap[data.gridId] = data.neighbors;
        }
    }
    
    // Generate JavaScript file
    const jsContent = `/**
 * Grid neighbors data loaded from CSV
 * Auto-generated from grid_neighbors.csv
 * DO NOT EDIT MANUALLY - Run: node scripts/convertGridNeighborsCSV.js
 */

export const gridNeighborsData = ${JSON.stringify(neighborsMap, null, 4)};
`;
    
    fs.writeFileSync(outputPath, jsContent, 'utf8');
    console.log(`✓ Converted grid neighbors from CSV to ${outputPath}`);
    console.log(`  Total grids with neighbors: ${Object.keys(neighborsMap).length}`);
} catch (error) {
    console.error('Error converting CSV:', error);
    process.exit(1);
}



