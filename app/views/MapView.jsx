import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';

const MapView = () => {
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [avoidStairs, setAvoidStairs] = useState(false);
    const [wheelchairFriendly, setWheelchairFriendly] = useState(false);
    const [elevatorOnly, setElevatorOnly] = useState(false);
    const [showDirections, setShowDirections] = useState(false);
    const [directions, setDirections] = useState([]);
    const router = useRouter();

    // Generate sample directions based on locations
    const generateDirections = () => {
        // Sample directions - in a real app, this would come from a routing API
        const sampleDirections = [
            { step: 1, instruction: 'Head north from your starting point', distance: '0 m', icon: '🚶' },
            { step: 2, instruction: 'Turn right at the main corridor', distance: '25 m', icon: '➡️' },
            { step: 3, instruction: 'Continue straight past the reception desk', distance: '50 m', icon: '⬆️' },
            { step: 4, instruction: 'Take the elevator to floor 2', distance: '75 m', icon: '🛗' },
            { step: 5, instruction: 'Exit elevator and turn left', distance: '100 m', icon: '⬅️' },
            { step: 6, instruction: 'Walk straight for 30 meters', distance: '130 m', icon: '🚶' },
            { step: 7, instruction: 'Turn right at the hallway intersection', distance: '160 m', icon: '➡️' },
            { step: 8, instruction: 'Your destination is on the left', distance: '180 m', icon: '🎯' },
        ];
        return sampleDirections;
    };

    const handleStartNavigation = () => {
        if (!startLocation || !destination) {
            Alert.alert('Error', 'Please enter both start and destination locations');
            return;
        }
        
        // Generate directions
        const generatedDirections = generateDirections();
        setDirections(generatedDirections);
        setShowDirections(true);
        
        // In a real app, this would call a routing API
        console.log('Starting navigation from:', startLocation, 'to:', destination);
        console.log('Accessibility options:', {
            avoidStairs,
            wheelchairFriendly,
            elevatorOnly
        });
    };

    return (
        <View style={styles.container}>
            {/* Decorative Background Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
            
            {/* Map Container */}
            <View style={styles.mapContainer}>
                <View style={styles.mapContent}>
                    <View style={styles.mapIconContainer}>
                        <Text style={styles.mapIcon}>🗺️</Text>
                    </View>
                    <Text style={styles.placeholderText}>Interactive Map</Text>
                    <Text style={styles.placeholderSubtext}>
                        {startLocation && destination 
                            ? `Route from ${startLocation} to ${destination}`
                            : 'Your navigation will appear here'
                        }
                    </Text>
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
                        <Text style={styles.inputIcon}>📍</Text>
                        <Text style={styles.inputLabel}>Start Location</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Where are you now?"
                        placeholderTextColor={colors.gray400}
                        value={startLocation}
                        onChangeText={setStartLocation}
                    />
                </View>

                {/* Destination Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputLabelContainer}>
                        <Text style={styles.inputIcon}>🎯</Text>
                        <Text style={styles.inputLabel}>Destination</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Where do you want to go?"
                        placeholderTextColor={colors.gray400}
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
                            <Text style={styles.toggleIcon}>🚫</Text>
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
                            <Text style={styles.toggleIcon}>♿</Text>
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
                            <Text style={styles.toggleIcon}>🛗</Text>
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
                    <Text style={styles.buttonText}>Start Navigation</Text>
                    <Text style={styles.buttonIcon}>🚀</Text>
                </TouchableOpacity>

                {/* Back to Profile Button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.push('/views/accountView')}
                >
                    <Text style={styles.backButtonIcon}>👤</Text>
                    <Text style={styles.backButtonText}>Back to Profile</Text>
                </TouchableOpacity>

                {/* Directions Panel */}
                {showDirections && directions.length > 0 && (
                    <View style={styles.directionsPanel}>
                        <View style={styles.directionsHeader}>
                            <Text style={styles.directionsTitle}>📋 Turn-by-Turn Directions</Text>
                            <TouchableOpacity 
                                onPress={() => setShowDirections(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
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
                                            <Text style={styles.stepIcon}>{direction.icon}</Text>
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
        backgroundColor: colors.gradientStart,
        position: 'relative',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 50,
        right: -30,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.accent3,
        opacity: 0.3,
    },
    decorativeCircle2: {
        position: 'absolute',
        top: 150,
        left: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.accent4,
        opacity: 0.25,
    },
    decorativeCircle3: {
        position: 'absolute',
        top: 250,
        right: 50,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondary,
        opacity: 0.2,
    },
    mapContainer: {
        height: 300,
        backgroundColor: colors.gray800,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    mapContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    mapIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    mapIcon: {
        fontSize: 60,
    },
    placeholderText: {
        ...typography.h3,
        color: colors.white,
        marginBottom: spacing.xs,
    },
    placeholderSubtext: {
        ...typography.body,
        color: colors.gray300,
    },
    controlsContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        ...shadows.large,
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
        color: colors.textSecondary,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    inputIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    inputLabel: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 2,
        borderColor: colors.gray200,
        ...shadows.small,
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
        color: colors.white,
        fontSize: 18,
        marginRight: spacing.sm,
    },
    buttonIcon: {
        fontSize: 20,
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
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    toggleContainer: {
        gap: spacing.sm,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.gray200,
        ...shadows.small,
    },
    toggleButtonActive: {
        backgroundColor: colors.primaryLight + '15',
        borderColor: colors.primary,
    },
    toggleIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    toggleContent: {
        flex: 1,
    },
    toggleLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
    },
    toggleLabelActive: {
        color: colors.primary,
    },
    toggleDescription: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    toggleSwitch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.gray300,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleSwitchActive: {
        backgroundColor: colors.primary,
    },
    toggleSwitchDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.white,
        alignSelf: 'flex-end',
    },
    directionsPanel: {
        marginTop: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.primary,
        ...shadows.medium,
        maxHeight: 400,
    },
    directionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
        backgroundColor: colors.primaryLight + '10',
    },
    directionsTitle: {
        ...typography.bodyBold,
        color: colors.primary,
        fontSize: 18,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: 'bold',
    },
    directionsList: {
        maxHeight: 300,
    },
    directionStep: {
        flexDirection: 'row',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    stepNumberContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    stepNumber: {
        ...typography.bodyBold,
        color: colors.white,
        fontSize: 14,
    },
    stepContent: {
        flex: 1,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    stepIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    stepDistance: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '600',
        backgroundColor: colors.primaryLight + '20',
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
        borderTopColor: colors.gray200,
        backgroundColor: colors.gray50,
        borderBottomLeftRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    totalDistance: {
        ...typography.bodyBold,
        color: colors.primary,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        ...shadows.medium,
    },
    backButtonIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    backButtonText: {
        ...typography.bodyBold,
        color: colors.white,
        fontSize: 16,
    },
});

export default MapView;