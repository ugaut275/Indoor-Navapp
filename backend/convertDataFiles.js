/**
 * Script to convert frontend data files to CommonJS format for backend
 * Run this once: node backend/convertDataFiles.js
 */

const fs = require('fs');
const path = require('path');

// Create data directory
const dataDir = path.join(__dirname, 'data');
const existingGridData = path.join(dataDir, 'gridData.js');
const existingGridNeighbors = path.join(dataDir, 'gridNeighborsData.js');

// Check if data files already exist
if (fs.existsSync(existingGridData) && fs.existsSync(existingGridNeighbors)) {
    console.log('✅ Data files already exist, skipping conversion');
    process.exit(0);
}

// Try multiple paths for source files (handles different contexts)
const possibleGridDataPaths = [
    path.join(__dirname, '..', 'utils', 'gridData.js'),  // Local development
    path.join(__dirname, 'utils', 'gridData.js'),         // If utils is copied to backend
    path.join(process.cwd(), 'utils', 'gridData.js'),    // Absolute from cwd
];

const possibleGridNeighborsPaths = [
    path.join(__dirname, '..', 'utils', 'gridNeighborsData.js'),
    path.join(__dirname, 'utils', 'gridNeighborsData.js'),
    path.join(process.cwd(), 'utils', 'gridNeighborsData.js'),
];

// Find existing source files
const gridDataPath = possibleGridDataPaths.find(p => fs.existsSync(p));
const gridNeighborsPath = possibleGridNeighborsPaths.find(p => fs.existsSync(p));

if (!gridDataPath || !gridNeighborsPath) {
    console.error('❌ Error: Could not find source data files');
    console.error('Tried paths:', possibleGridDataPaths);
    console.error('Make sure utils/gridData.js and utils/gridNeighborsData.js exist');
    console.error('Or ensure backend/data/ files are already converted and committed');
    process.exit(1);
}

// Create data directory if it doesn't exist
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

