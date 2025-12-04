import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import IndoorMap from '../components/IndoorMap';

const MapView = () => {
    // Grid selection state
    const [selectedStartGrid, setSelectedStartGrid] = useState(null);
    const [selectedEndGrid, setSelectedEndGrid] = useState(null);
    const [selectionMode, setSelectionMode] = useState('start'); // 'start' or 'end'

    // Route state
    const [routePath, setRoutePath] = useState(null);
    const [routeDistance, setRouteDistance] = useState(null);

    // Legacy text inputs (keeping for now as fallback)
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');

    // Accessibility options
    const [avoidStairs, setAvoidStairs] = useState(false);
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [elevatorOnly, setElevatorOnly] = useState(false);

    // Directions
    const [showDirections, setShowDirections] = useState(false);
    const [directions, setDirections] = useState([]);

    const router = useRouter();

    // Generate sample directions based on locations
    const generateDirections = () => {
        // Sample directions - in a real app, this would come from a routing API
        const sampleDirections = [
            { step: 1, instruction: 'Head north from your starting point', distance: '0 m', icon: 'walk', iconType: 'ion' },
            { step: 2, instruction: 'Turn right at the main corridor', distance: '25 m', icon: 'arrow-forward', iconType: 'ion' },
            { step: 3, instruction: 'Continue straight past the reception desk', distance: '50 m', icon: 'arrow-up', iconType: 'ion' },
            { step: 4, instruction: 'Take the elevator to floor 2', distance: '75 m', icon: 'elevator', iconType: 'mci' },
            { step: 5, instruction: 'Exit elevator and turn left', distance: '100 m', icon: 'arrow-back', iconType: 'ion' },
            { step: 6, instruction: 'Walk straight for 30 meters', distance: '130 m', icon: 'walk', iconType: 'ion' },
            { step: 7, instruction: 'Turn right at the hallway intersection', distance: '160 m', icon: 'arrow-forward', iconType: 'ion' },
            { step: 8, instruction: 'Your destination is on the left', distance: '180 m', icon: 'location', iconType: 'ion' },
        ];
        return sampleDirections;
    };

    // Handle grid selection on map click
    const handleGridSelect = (gridId, coordinates) => {
        if (selectionMode === 'start') {
            setSelectedStartGrid(gridId);
            setStartLocation(`Grid ${gridId}`);
            console.log('Selected start grid:', gridId, 'at', coordinates);
            // Automatically switch to selecting end point
            setSelectionMode('end');
        } else {
            setSelectedEndGrid(gridId);
            setDestination(`Grid ${gridId}`);
            console.log('Selected end grid:', gridId, 'at', coordinates);
        }
    };

    // Clear selections
    const handleClearSelections = () => {
        setSelectedStartGrid(null);
        setSelectedEndGrid(null);
        setRoutePath(null);
        setRouteDistance(null);
        setShowDirections(false);
        setDirections([]);
        setStartLocation('');
        setDestination('');
        setSelectionMode('start');
    };

    const handleStartNavigation = () => {
        if (selectedStartGrid === null || selectedEndGrid === null) {
            Alert.alert('Error', 'Please select both start and destination points on the map');
            return;
        }

        // Generate directions (sample for now)
        const generatedDirections = generateDirections();
        setDirections(generatedDirections);
        setShowDirections(true);

        // In a real app, this would call the backend pathfinding API
        // Example: const pathData = await findPath(selectedStartGrid, selectedEndGrid, {avoidStairs, wheelchairFriendly, elevatorOnly});
        // setRoutePath(pathData.path);
        // setRouteDistance(pathData.total_distance);

        // For now, create a mock path (straight line between start and end)
        const mockPath = [selectedStartGrid, selectedEndGrid];
        setRoutePath(mockPath);

        console.log('Starting navigation from grid:', selectedStartGrid, 'to:', selectedEndGrid);
        console.log('Accessibility options:', {
            avoidStairs,
            wheelchairFriendly,
            elevatorOnly
        });
    };

    return (
        <View style={styles.container}>
            {/* Map Container */}
            <View style={styles.mapContainer}>
                <IndoorMap
                    mapImageSource={require('../../assets/floorplan.png')} // Add your map image here
                    gridsData={null} // Will be populated with actual grid data from backend
                    onGridSelect={handleGridSelect}
                    selectedStartGrid={selectedStartGrid}
                    selectedEndGrid={selectedEndGrid}
                    routePath={routePath}
                    showDebugGrid={false} // Set to true to visualize hex grid for debugging
                />

                {/* Selection Mode Indicator */}
                <View style={styles.selectionIndicator}>
                    <View style={[styles.selectionBadge, selectionMode === 'start' ? styles.selectionBadgeStart : styles.selectionBadgeEnd]}>
                        <Ionicons
                            name={selectionMode === 'start' ? 'location-outline' : 'navigate-outline'}
                            size={16}
                            color={colors.background}
                        />
                        <Text style={styles.selectionText}>
                            {selectionMode === 'start' ? 'Select Start Point' : 'Select Destination'}
                        </Text>
                    </View>
                    {(selectedStartGrid !== null || selectedEndGrid !== null) && (
                        <TouchableOpacity onPress={handleClearSelections} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={24} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Navigation Controls */}
            <ScrollView 
                style={styles.controlsContainer}
                contentContainerStyle={styles.controlsContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.controlsHeader}>
                    <Text style={styles.controlsTitle}>Plan Your Route</Text>
                    <Text style={styles.controlsSubtitle}>Enter your locations to begin</Text>
                </View>

                {/* Start Location Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputLabelContainer}>
                        <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                        <Text style={styles.inputLabel}>Start Location</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Where are you now?"
                        placeholderTextColor={colors.textMuted}
                        value={startLocation}
                        onChangeText={setStartLocation}
                    />
                </View>

                {/* Destination Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputLabelContainer}>
                        <Ionicons name="navigate-outline" size={20} color={colors.accent2} style={{ marginRight: spacing.sm }} />
                        <Text style={styles.inputLabel}>Destination</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Where do you want to go?"
                        placeholderTextColor={colors.textMuted}
                        value={destination}
                        onChangeText={setDestination}
                    />
                </View>

                {/* Accessibility Options */}
                <View style={styles.accessibilitySection}>
                    <Text style={styles.sectionTitle}>Accessibility Options</Text>
                    <Text style={styles.sectionSubtitle}>Customize your route preferences</Text>
                    
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, avoidStairs && styles.toggleButtonActive]}
                            onPress={() => setAvoidStairs(!avoidStairs)}
                        >
                            <View style={styles.toggleIconContainer}>
                                <MaterialCommunityIcons
                                    name="stairs"
                                    size={22}
                                    color={avoidStairs ? colors.primary : colors.textMuted}
                                />
                            </View>
                            <View style={styles.toggleContent}>
                                <Text style={[styles.toggleLabel, avoidStairs && styles.toggleLabelActive]}>
                                    Avoid Stairs
                                </Text>
                                <Text style={styles.toggleDescription}>
                                    Use ramps and elevators only
                                </Text>
                            </View>
                            <View style={[styles.toggleSwitch, avoidStairs && styles.toggleSwitchActive]}>
                                {avoidStairs && <View style={styles.toggleSwitchDot} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.toggleButton, wheelchairFriendly && styles.toggleButtonActive]}
                            onPress={() => setWheelchairFriendly(!wheelchairFriendly)}
                        >
                            <View style={styles.toggleIconContainer}>
                                <Ionicons
                                    name="accessibility-outline"
                                    size={22}
                                    color={wheelchairFriendly ? colors.primary : colors.textMuted}
                                />
                            </View>
                            <View style={styles.toggleContent}>
                                <Text style={[styles.toggleLabel, wheelchairFriendly && styles.toggleLabelActive]}>
                                    Wheelchair Friendly
                                </Text>
                                <Text style={styles.toggleDescription}>
                                    Accessible paths only
                                </Text>
                            </View>
                            <View style={[styles.toggleSwitch, wheelchairFriendly && styles.toggleSwitchActive]}>
                                {wheelchairFriendly && <View style={styles.toggleSwitchDot} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.toggleButton, elevatorOnly && styles.toggleButtonActive]}
                            onPress={() => setElevatorOnly(!elevatorOnly)}
                        >
                            <View style={styles.toggleIconContainer}>
                                <MaterialCommunityIcons
                                    name="elevator-passenger"
                                    size={22}
                                    color={elevatorOnly ? colors.primary : colors.textMuted}
                                />
                            </View>
                            <View style={styles.toggleContent}>
                                <Text style={[styles.toggleLabel, elevatorOnly && styles.toggleLabelActive]}>
                                    Elevator Only
                                </Text>
                                <Text style={styles.toggleDescription}>
                                    Prefer elevators over escalators
                                </Text>
                            </View>
                            <View style={[styles.toggleSwitch, elevatorOnly && styles.toggleSwitchActive]}>
                                {elevatorOnly && <View style={styles.toggleSwitchDot} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Start Navigation Button */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartNavigation}
                >
                    <Ionicons name="navigate" size={20} color={colors.background} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.buttonText}>Start Navigation</Text>
                </TouchableOpacity>

                {/* Back to Profile Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/views/accountView')}
                >
                    <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.backButtonText}>Back to Profile</Text>
                </TouchableOpacity>

                {/* Directions Panel */}
                {showDirections && directions.length > 0 && (
                    <View style={styles.directionsPanel}>
                        <View style={styles.directionsHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="list-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                                <Text style={styles.directionsTitle}>Turn-by-Turn Directions</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowDirections(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.directionsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {directions.map((direction, index) => (
                                <View key={index} style={styles.directionStep}>
                                    <View style={styles.stepNumberContainer}>
                                        <Text style={styles.stepNumber}>{direction.step}</Text>
                                    </View>
                                    <View style={styles.stepContent}>
                                        <View style={styles.stepHeader}>
                                            {direction.iconType === 'ion' ? (
                                                <Ionicons name={direction.icon} size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
                                            ) : (
                                                <MaterialCommunityIcons name={direction.icon} size={18} color={colors.primary} style={{ marginRight: spacing.sm }} />
                                            )}
                                            <Text style={styles.stepDistance}>{direction.distance}</Text>
                                        </View>
                                        <Text style={styles.stepInstruction}>{direction.instruction}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        
                        <View style={styles.directionsFooter}>
                            <Text style={styles.totalDistance}>
                                Total Distance: {directions[directions.length - 1]?.distance || '0 m'}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mapContainer: {
        height: 400,
        backgroundColor: colors.backgroundCard,
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectionIndicator: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        right: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.medium,
        gap: spacing.xs,
    },
    selectionBadgeStart: {
        backgroundColor: colors.success,
    },
    selectionBadgeEnd: {
        backgroundColor: colors.error,
    },
    selectionText: {
        ...typography.caption,
        color: colors.background,
        fontWeight: '600',
        fontSize: 12,
    },
    clearButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    mapContent: {
        alignItems: 'center',
    },
    mapIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    placeholderText: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    placeholderSubtext: {
        ...typography.caption,
        color: colors.textMuted,
    },
    controlsContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    controlsContent: {
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    controlsHeader: {
        marginBottom: spacing.lg,
    },
    controlsTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    controlsSubtitle: {
        ...typography.caption,
        color: colors.textMuted,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    inputLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.lg,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    startButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        ...shadows.medium,
    },
    buttonText: {
        ...typography.bodyBold,
        color: colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    accessibilitySection: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: spacing.md,
    },
    toggleContainer: {
        gap: spacing.sm,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    toggleButtonActive: {
        backgroundColor: colors.primaryMuted,
        borderColor: colors.primary,
    },
    toggleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    toggleContent: {
        flex: 1,
    },
    toggleLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
        fontWeight: '500',
    },
    toggleLabelActive: {
        color: colors.primary,
    },
    toggleDescription: {
        ...typography.caption,
        color: colors.textMuted,
    },
    toggleSwitch: {
        width: 48,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.border,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleSwitchActive: {
        backgroundColor: colors.primary,
    },
    toggleSwitchDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.backgroundCard,
        alignSelf: 'flex-end',
    },
    directionsPanel: {
        marginTop: spacing.lg,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.borderAccent,
        ...shadows.medium,
        maxHeight: 400,
    },
    directionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.primaryMuted,
    },
    directionsTitle: {
        ...typography.bodyBold,
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundElevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsList: {
        maxHeight: 300,
    },
    directionStep: {
        flexDirection: 'row',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    stepNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    stepNumber: {
        ...typography.bodyBold,
        color: colors.background,
        fontSize: 14,
        fontWeight: '600',
    },
    stepContent: {
        flex: 1,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    stepDistance: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '500',
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    stepInstruction: {
        ...typography.body,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    directionsFooter: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.backgroundElevated,
        borderBottomLeftRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    totalDistance: {
        ...typography.bodyBold,
        color: colors.primary,
        textAlign: 'center',
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    backButtonText: {
        ...typography.bodyBold,
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default MapView;