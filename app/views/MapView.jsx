import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const MapView = () => {
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const navigation = useNavigation();

    const handleStartNavigation = () => {
        if (!startLocation || !destination) {
            Alert.alert('Error', 'Please select both start and destination locations');
            return;
        }
        // Navigation logic will go here
        console.log('Starting navigation from:', startLocation, 'to:', destination);
    };

    return (
        <View style={styles.container}>
            {/* Map Container */}
            <View style={styles.mapContainer}>
                <Text style={styles.placeholderText}>Map will be displayed here</Text>
            </View>

            {/* Navigation Controls */}
            <View style={styles.controlsContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📍 Start Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Select starting point"
                        value={startLocation}
                        onChangeText={setStartLocation}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🎯 Destination</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Select destination"
                        value={destination}
                        onChangeText={setDestination}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.startButton}
                    onPress={handleStartNavigation}
                >
                    <Text style={styles.buttonText}>Start Navigation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mapContainer: {
        flex: 2,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    controlsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    startButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MapView;