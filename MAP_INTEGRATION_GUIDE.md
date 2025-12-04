# Indoor Map Integration Guide

## Overview

The indoor navigation system uses an invisible hexagonal grid overlay to map user clicks to navigable grid IDs. This document explains how the system works and how to integrate it with your backend.

## Architecture

### Components

1. **hexGrid.js** - Utility functions for hex grid calculations
2. **IndoorMap.jsx** - Map display component with click handling
3. **MapView.jsx** - Main navigation interface

### Coordinate System

- **Backend**: Meters (0,0) to (101.12, 123.64)
- **Frontend**: Pixels → converted to meters → mapped to grid IDs
- **Grid**: 342 hexagonal cells, radius 4 meters

## How It Works

### 1. Hex Grid Generation

The frontend replicates the backend's hex grid algorithm:

```javascript
// From hexGrid.js
export const HEX_RADIUS_METERS = 4.0;
export const COL_SPACING = 6.0; // hex_radius * 1.5
export const ROW_SPACING = 6.928; // hex_radius * sqrt(3)

// Grid centers generated in row-major order (y, then x)
// Every other column is offset vertically by ROW_SPACING / 2
```

### 2. Click-to-Grid-ID Mapping

```
User taps map → Pixel coordinates
              ↓
         Convert to meters (using image dimensions)
              ↓
         Find closest hex center
              ↓
         Verify point is inside hexagon
              ↓
         Return grid ID
```

### 3. Route Display

```
Backend pathfinding → [grid_id_1, grid_id_2, ..., grid_id_n]
                   ↓
            Get grid centers for each ID
                   ↓
            Convert meters to pixels
                   ↓
            Draw path on map
```

## Usage

### Basic Setup

1. **Add Floor Plan Image**
   ```
   /assets/floorplan.png
   ```

2. **The Map Automatically**:
   - Scales the image to fit
   - Maps pixel coordinates to meters
   - Converts clicks to grid IDs
   - Displays selected start/end points
   - Renders routes when provided

### Selecting Points

```javascript
// User workflow:
1. Tap on map → Selects start point (green marker)
2. Tap again → Selects end point (red marker)
3. Press "Start Navigation" → Calls backend pathfinding
```

### Integration with Backend

```javascript
// In MapView.jsx - Update handleStartNavigation():

const handleStartNavigation = async () => {
  if (selectedStartGrid === null || selectedEndGrid === null) return;

  // Call your backend pathfinding API
  const response = await fetch('YOUR_BACKEND_URL/find_path', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start_id: selectedStartGrid,
      goal_id: selectedEndGrid,
      accessibility: {
        avoid_stairs: avoidStairs,
        wheelchair_friendly: wheelchairFriendly,
        elevator_only: elevatorOnly
      }
    })
  });

  const pathData = await response.json();

  // Expected format:
  // {
  //   success: true,
  //   path: [0, 9, 18, 27, ...],
  //   total_distance: 45.67,
  //   steps: [...]
  // }

  setRoutePath(pathData.path);
  setRouteDistance(pathData.total_distance);

  // Generate turn-by-turn directions from steps
  const directions = pathData.steps.map((step, index) => ({
    step: index + 1,
    instruction: `Walk ${step.distance.toFixed(1)}m`,
    distance: `${step.distance.toFixed(1)} m`,
    icon: 'walk',
    iconType: 'ion'
  }));

  setDirections(directions);
  setShowDirections(true);
};
```

### Loading Grid Data from Backend

```javascript
// Option: Load actual grid centers from database

import { loadGridCentersFromData } from '../utils/hexGrid';

// In your component:
const [gridsData, setGridsData] = useState(null);

useEffect(() => {
  // Fetch grid data from backend
  fetch('YOUR_BACKEND_URL/grids')
    .then(res => res.json())
    .then(data => {
      // Expected format: [{id: 0, center: [x, y]}, ...]
      setGridsData(data);
    });
}, []);

// Pass to IndoorMap:
<IndoorMap
  gridsData={gridsData}
  ...
/>
```

## Debugging

### Visualize Hex Grid

Set `showDebugGrid={true}` in MapView.jsx:

```javascript
<IndoorMap
  showDebugGrid={true}  // Shows red dots at grid centers
  ...
/>
```

### Check Coordinate Mapping

```javascript
// In browser console:
import { pixelToMeter, getGridIdFromCoordinate } from './utils/hexGrid';

// Test a click
const pixel = { x: 100, y: 200 };
const meter = pixelToMeter(pixel.x, pixel.y, 800, 600);
console.log('Meter coords:', meter);

const gridId = getGridIdFromCoordinate(meter.x, meter.y, gridCenters);
console.log('Grid ID:', gridId);
```

## File Structure

```
/app
  /components
    IndoorMap.jsx          # Map component
  /utils
    hexGrid.js             # Hex grid utilities
  /views
    MapView.jsx            # Main navigation UI
/assets
  floorplan.png            # Floor plan image
```

## Constants Reference

```javascript
// Map dimensions (from backend building_info)
MAP_WIDTH_METERS = 101.12
MAP_HEIGHT_METERS = 123.64
TOTAL_HEX_COUNT = 342

// Hex geometry
HEX_RADIUS_METERS = 4.0
HEX_AREA_SQUARE_METERS = 41.569216
COL_SPACING = 6.0 meters
ROW_SPACING = 6.928 meters
```

## Next Steps

1. **Add Backend API Integration**
   - Update `handleStartNavigation()` with actual API call
   - Handle authentication if needed
   - Add error handling

2. **Load Grid Data**
   - Fetch grid centers from backend
   - Load availability status
   - Filter grids based on accessibility options

3. **Enhance Route Display**
   - Add route animation
   - Show turn-by-turn navigation overlay
   - Add estimated time based on step costs

4. **Testing**
   - Test grid selection accuracy
   - Verify route rendering
   - Test accessibility filtering
