import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import {
  generateHexCenters,
  getGridIdFromCoordinate,
  pixelToMeter,
  meterToPixel,
  loadGridCentersFromData,
  MAP_WIDTH_METERS,
  MAP_HEIGHT_METERS,
} from '../utils/hexGrid';

/**
 * IndoorMap Component
 *
 * Displays the floor plan map with invisible hexagonal grid overlay.
 * Handles user taps to select start/end points for navigation.
 */
export default function IndoorMap({
  mapImageSource,
  gridsData = null,
  onGridSelect,
  selectedStartGrid = null,
  selectedEndGrid = null,
  routePath = null,
  showDebugGrid = false, // Set to true to see hex grid for debugging
}) {
  const [imageLayout, setImageLayout] = useState(null);
  const [gridCenters, setGridCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize grid centers
  useEffect(() => {
    if (gridsData) {
      // Load from actual database data
      const centers = loadGridCentersFromData(gridsData);
      setGridCenters(centers);
    } else {
      // Generate theoretical centers (for testing without backend)
      const centers = generateHexCenters();
      setGridCenters(centers);
    }
    setLoading(false);
  }, [gridsData]);

  // Handle image load to get dimensions
  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageLayout({ width, height });
  };

  // Handle tap on map
  const handleMapPress = (event) => {
    if (!imageLayout || gridCenters.length === 0) return;

    const { locationX, locationY } = event.nativeEvent;

    // Convert pixel coordinates to meters
    const { x, y } = pixelToMeter(
      locationX,
      locationY,
      imageLayout.width,
      imageLayout.height
    );

    // Get grid ID from coordinate
    const gridId = getGridIdFromCoordinate(x, y, gridCenters);

    if (gridId !== null && onGridSelect) {
      onGridSelect(gridId, { x, y });
    }
  };

  // Render route path
  const renderRoutePath = () => {
    if (!routePath || !imageLayout || routePath.length < 2) return null;

    // Convert grid IDs to pixel coordinates
    const pathPoints = routePath
      .map((gridId) => {
        const center = gridCenters[gridId];
        if (!center) return null;

        const pixel = meterToPixel(
          center.x,
          center.y,
          imageLayout.width,
          imageLayout.height
        );
        return `${pixel.x},${pixel.y}`;
      })
      .filter(Boolean)
      .join(' ');

    return (
      <Polyline
        points={pathPoints}
        stroke="#00D9FF"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  // Render selected grid markers
  const renderMarkers = () => {
    if (!imageLayout) return null;

    const markers = [];

    // Start point (green)
    if (selectedStartGrid !== null && gridCenters[selectedStartGrid]) {
      const center = gridCenters[selectedStartGrid];
      const pixel = meterToPixel(
        center.x,
        center.y,
        imageLayout.width,
        imageLayout.height
      );

      markers.push(
        <Circle
          key="start"
          cx={pixel.x}
          cy={pixel.y}
          r="12"
          fill="#00FF7F"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      );
    }

    // End point (red)
    if (selectedEndGrid !== null && gridCenters[selectedEndGrid]) {
      const center = gridCenters[selectedEndGrid];
      const pixel = meterToPixel(
        center.x,
        center.y,
        imageLayout.width,
        imageLayout.height
      );

      markers.push(
        <Circle
          key="end"
          cx={pixel.x}
          cy={pixel.y}
          r="12"
          fill="#FF4757"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      );
    }

    return markers;
  };

  // Render hex grid overlay (for debugging only)
  const renderDebugGrid = () => {
    if (!showDebugGrid || !imageLayout) return null;

    return gridCenters.map((center, index) => {
      const pixel = meterToPixel(
        center.x,
        center.y,
        imageLayout.width,
        imageLayout.height
      );

      return (
        <Circle
          key={`debug-${index}`}
          cx={pixel.x}
          cy={pixel.y}
          r="2"
          fill="rgba(255, 0, 0, 0.3)"
        />
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleMapPress}
        style={styles.touchable}
      >
        {mapImageSource ? (
          <Image
            source={mapImageSource}
            style={styles.mapImage}
            resizeMode="contain"
            onLayout={handleImageLayout}
            onError={() => {
              console.log('Error loading map image');
              // Set default layout for error case
              setImageLayout({ width: 400, height: 500 });
            }}
          />
        ) : (
          <View
            style={[styles.mapImage, styles.placeholderContainer]}
            onLayout={handleImageLayout}
          >
            <Text style={styles.placeholderText}>
              Add floorplan.png to /assets folder
            </Text>
          </View>
        )}

        {imageLayout && (
          <Svg
            style={StyleSheet.absoluteFill}
            width={imageLayout.width}
            height={imageLayout.height}
          >
            {renderDebugGrid()}
            {renderRoutePath()}
            {renderMarkers()}
          </Svg>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  touchable: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
