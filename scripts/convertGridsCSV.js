/**
 * Script to convert grids.csv to gridData.js
 * Run with: node scripts/convertGridsCSV.js
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../database_files/grids.csv');
const outputPath = path.join(__dirname, '../utils/gridData.js');

function parseGridRow(row) {
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
        
        if (parts.length < 2) return null;
        
        const id = parseInt(parts[0], 10);
        if (isNaN(id)) return null;
        
        const centerStr = parts[1].replace(/^\[|\]$/g, '');
        const centerParts = centerStr.split(',').map(s => parseFloat(s.trim()));
        
        if (centerParts.length !== 2 || isNaN(centerParts[0]) || isNaN(centerParts[1])) {
            return null;
        }
        
        return {
            id,
            center: centerParts,
            availability: parts[2] === 't',
        };
    } catch (error) {
        console.error('Error parsing row:', error);
        return null;
    }
}

try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    const grids = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const grid = parseGridRow(line);
        if (grid) {
            grids.push(grid);
        }
    }
    
    // Generate JavaScript file
    const jsContent = `/**
 * Grid data loaded from CSV
 * Auto-generated from grids.csv
 * DO NOT EDIT MANUALLY - Run: node scripts/convertGridsCSV.js
 */

export const gridData = ${JSON.stringify(grids, null, 4)};
`;
    
    fs.writeFileSync(outputPath, jsContent, 'utf8');
    console.log(`✓ Converted ${grids.length} grids from CSV to ${outputPath}`);
} catch (error) {
    console.error('Error converting CSV:', error);
    process.exit(1);
}

