import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { Pressable } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { calculateMapBounds } from '../utils/gridDataLoader';
import { 
    findNearestGridId, 
    screenToMapCoordinates,
    generateHexagonVertices
} from '../utils/hexagonUtils';
import { getHexRadiusMeters } from '../utils/hexagonConstants';
import { mapToScreenCoordinates } from '../utils/mapCoordinates';
import { colors } from '../theme';
import { gridData } from '../utils/gridData';

/**
 * MapViewer Component
 * Displays an AutoCAD map with an invisible hexagonal grid overlay.
 * When users click on the map, it determines the associated grid ID.
 * Can visualize a path by highlighting grid IDs.
 */
const MapViewer = ({ onGridSelected, showDebugInfo = true, pathGridIds = [], startGridId = null, destinationGridId = null }) => {
    const [grids, setGrids] = useState([]);
    const [mapBounds, setMapBounds] = useState(null);
    const [hexRadius, setHexRadius] = useState(6.0);
    const [imageLayout, setImageLayout] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedGridId, setSelectedGridId] = useState(null);
    const [lastClickPosition, setLastClickPosition] = useState(null);

    // Load grid data on component mount
    useEffect(() => {
        loadGridData();
    }, []);

    /**
     * Load grid data from the imported gridData module
     */
    const loadGridData = () => {
        try {
            console.log('Loading grid data...', gridData.length, 'grids');
            
            setGrids(gridData);
            const bounds = calculateMapBounds(gridData);
            setMapBounds(bounds);
            
            // Use fixed hex radius from backend (matches Hexagon.py)
            const radius = getHexRadiusMeters();
            setHexRadius(radius);
            
            console.log('Map bounds:', bounds);
            console.log('Hex radius (fixed):', radius, 'meters');
            console.log('Hex area (fixed):', 41.569216, 'm²');
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading grid data:', error);
            setLoading(false);
        }
    };

    /**
     * Handle image load to get actual image dimensions
     */
    const handleImageLoad = (event) => {
        const { width, height } = event.nativeEvent.source;
        setImageSize({ width, height });
    };

    /**
     * Handle image layout to get position and size on screen
     */
    const handleImageLayout = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setImageLayout({ x, y, width, height });
    };

    /**
     * Handle press/tap on the map
     */
    const handleMapPress = (event) => {
        if (!mapBounds || !imageLayout || grids.length === 0) {
            console.warn('Map not ready for interaction');
            return;
        }

        // Get the touch coordinates relative to the Pressable/Image
        const { locationX, locationY } = event.nativeEvent;
        
        // Convert screen coordinates to map coordinates
        // locationX and locationY are already relative to the Pressable
        const mapCoords = screenToMapCoordinates(
            locationX,
            locationY,
            mapBounds,
            imageSize.width || imageLayout.width,
            imageSize.height || imageLayout.height,
            imageLayout
        );

        // Find the grid ID for this point
        const gridId = findNearestGridId(
            mapCoords.x,
            mapCoords.y,
            grids,
            hexRadius
        );

        if (gridId !== null) {
            setSelectedGridId(gridId);
            setLastClickPosition({ x: locationX, y: locationY });
            
            // Call the callback if provided
            if (onGridSelected) {
                onGridSelected(gridId, mapCoords);
            }
            
            if (showDebugInfo) {
                Alert.alert(
                    'Grid Selected',
                    `Grid ID: ${gridId}\nMap Coordinates: (${mapCoords.x.toFixed(2)}, ${mapCoords.y.toFixed(2)})`
                );
            }
        } else {
            if (showDebugInfo) {
                Alert.alert(
                    'No Grid Found',
                    `No grid found at coordinates: (${mapCoords.x.toFixed(2)}, ${mapCoords.y.toFixed(2)})`
                );
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading map...</Text>
            </View>
        );
    }

    /**
     * Render path visualization overlay
     */
    const renderPathOverlay = () => {
        if (!imageLayout || !mapBounds || grids.length === 0) {
            return null;
        }

        // Only show path if we have both start and destination
        if (!startGridId || !destinationGridId || pathGridIds.length === 0) {
            return null;
        }

        const hexRadius = getHexRadiusMeters();
        const pathHexagons = [];
        const startMarker = grids.find(g => g.id === startGridId);
        const destMarker = grids.find(g => g.id === destinationGridId);

        // Create hexagon paths for each grid in the path
        pathGridIds.forEach(gridId => {
            const grid = grids.find(g => g.id === gridId);
            if (!grid) return;

            const [centerX, centerY] = grid.center;
            
            // Generate hexagon vertices in map coordinates
            const vertices = generateHexagonVertices(centerX, centerY, hexRadius);
            
            // Convert vertices to screen coordinates
            const screenVertices = vertices.map(([mapX, mapY]) => {
                const screen = mapToScreenCoordinates(mapX, mapY, mapBounds, imageLayout);
                return `${screen.x},${screen.y}`;
            }).join(' ');

            pathHexagons.push({
                id: gridId,
                points: screenVertices
            });
        });

        return (
            <Svg
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            >
                {/* Draw path hexagons */}
                {pathHexagons.map((hex) => (
                    <Polygon
                        key={`path-${hex.id}`}
                        points={hex.points}
                        fill={colors.primary}
                        fillOpacity={0.4}
                        stroke={colors.primary}
                        strokeWidth={2}
                        strokeOpacity={0.8}
                    />
                ))}
                
                {/* Start marker (green) */}
                {startMarker && (() => {
                    const [centerX, centerY] = startMarker.center;
                    const screenCenter = mapToScreenCoordinates(centerX, centerY, mapBounds, imageLayout);
                    return (
                        <Circle
                            cx={screenCenter.x}
                            cy={screenCenter.y}
                            r={10}
                            fill={colors.accent2}
                            stroke={colors.background}
                            strokeWidth={3}
                        />
                    );
                })()}
                
                {/* Destination marker (red) */}
                {destMarker && (() => {
                    const [centerX, centerY] = destMarker.center;
                    const screenCenter = mapToScreenCoordinates(centerX, centerY, mapBounds, imageLayout);
                    return (
                        <Circle
                            cx={screenCenter.x}
                            cy={screenCenter.y}
                            r={10}
                            fill={colors.accent3}
                            stroke={colors.background}
                            strokeWidth={3}
                        />
                    );
                })()}
            </Svg>
        );
    };

    return (
        <View style={styles.container}>
            <Pressable 
                style={styles.mapPressable}
                onPress={handleMapPress}
            >
                <Image
                    source={require('../Automate_floor_plan.dwg.png')}
                    style={styles.mapImage}
                    resizeMode="contain"
                    onLoad={handleImageLoad}
                    onLayout={handleImageLayout}
                />
                {renderPathOverlay()}
            </Pressable>
            
            {showDebugInfo && selectedGridId !== null && (
                <View style={styles.debugInfo}>
                    <Text style={styles.debugText}>
                        Selected Grid ID: {selectedGridId}
                    </Text>
                    {lastClickPosition && (
                        <Text style={styles.debugText}>
                            Click: ({lastClickPosition.x.toFixed(0)}, {lastClickPosition.y.toFixed(0)})
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundCard,
    },
    mapPressable: {
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
        backgroundColor: colors.backgroundCard,
    },
    loadingText: {
        marginTop: 16,
        color: colors.textSecondary,
        fontSize: 14,
    },
    debugInfo: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 4,
    },
    debugText: {
        color: colors.primary,
        fontSize: 12,
        fontFamily: 'monospace',
    },
});

export default MapViewer;

