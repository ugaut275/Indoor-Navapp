/**
 * Script to convert frontend data files to CommonJS format for backend
 * Run this once: node backend/convertDataFiles.js
 */

const fs = require('fs');
const path = require('path');

// Read the frontend gridData file
const gridDataPath = path.join(__dirname, '..', 'utils', 'gridData.js');
const gridNeighborsPath = path.join(__dirname, '..', 'utils', 'gridNeighborsData.js');

// Create data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read and convert gridData
console.log('Converting gridData.js...');
const gridDataContent = fs.readFileSync(gridDataPath, 'utf8');
// Replace ES6 export with CommonJS
const gridDataCommonJS = gridDataContent
    .replace(/export const gridData = /, 'const gridData = ')
    .replace(/export const gridData;/, '')
    + '\n\nmodule.exports = { gridData };';

fs.writeFileSync(path.join(dataDir, 'gridData.js'), gridDataCommonJS);
console.log('✓ Created backend/data/gridData.js');

// Read and convert gridNeighborsData
console.log('Converting gridNeighborsData.js...');
const gridNeighborsContent = fs.readFileSync(gridNeighborsPath, 'utf8');
// Replace ES6 export with CommonJS
const gridNeighborsCommonJS = gridNeighborsContent
    .replace(/export const gridNeighborsData = /, 'const gridNeighborsData = ')
    .replace(/export const gridNeighborsData;/, '')
    + '\n\nmodule.exports = { gridNeighborsData };';

fs.writeFileSync(path.join(dataDir, 'gridNeighborsData.js'), gridNeighborsCommonJS);
console.log('✓ Created backend/data/gridNeighborsData.js');

console.log('\n✅ Data files converted successfully!');
console.log('You can now start the backend server with: npm start (in the backend directory)');

