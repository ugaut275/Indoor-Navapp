/**
 * Indoor Navigation API Server
 * Provides pathfinding API endpoint for the mobile app
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { findPath, createGridCentersMap } = require('./pathfinding');

// Load data files
let gridData, gridNeighborsData;

try {
    gridData = require('./data/gridData').gridData;
    gridNeighborsData = require('./data/gridNeighborsData').gridNeighborsData;
} catch (error) {
    console.error('Error loading data files:', error.message);
    console.error('Make sure to run: node convertDataFiles.js');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create grid centers map once at startup
const gridCentersMap = createGridCentersMap(gridData);
console.log(`Loaded ${gridData.length} grids and ${Object.keys(gridNeighborsData).length} grid neighbors`);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Indoor Navigation API is running',
        timestamp: new Date().toISOString(),
    });
});

// Pathfinding endpoint
app.post('/api/pathfinding', (req, res) => {
    try {
        const { startGridId, endGridId, options = {} } = req.body;

        // Validate input
        if (startGridId === undefined || endGridId === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: startGridId and endGridId are required',
            });
        }

        const startId = Number(startGridId);
        const endId = Number(endGridId);

        if (isNaN(startId) || isNaN(endId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid grid IDs: startGridId and endGridId must be numbers',
            });
        }

        // Check if grid IDs exist
        if (!gridNeighborsData[startId] || !gridNeighborsData[endId]) {
            return res.status(404).json({
                success: false,
                message: `Grid ID ${startId} or ${endId} not found in the grid system`,
            });
        }

        // TODO: Apply accessibility options (avoidStairs, wheelchairFriendly, elevatorOnly)
        // For now, we'll use the basic pathfinding algorithm
        // In the future, you can filter neighbors based on these options
        
        console.log(`Calculating path from grid ${startId} to grid ${endId}`);
        console.log('Options:', options);

        // Calculate path using A* algorithm
        const path = findPath(startId, endId, gridNeighborsData, gridCentersMap);

        if (path.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No path found between the specified grid IDs',
            });
        }

        console.log(`Path found: ${path.length} grids`);

        res.json({
            success: true,
            path: path,
            startGridId: startId,
            endGridId: endId,
            pathLength: path.length,
        });
    } catch (error) {
        console.error('Pathfinding error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while calculating path',
            error: error.message,
        });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Indoor Navigation API server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Pathfinding: http://localhost:${PORT}/api/pathfinding`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

