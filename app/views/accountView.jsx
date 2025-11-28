import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';

const AccountView = () => {
    const [userProfile, setUserProfile] = useState(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const userProfileJSON = await AsyncStorage.getItem('currentUser');
            const profile = userProfileJSON ? JSON.parse(userProfileJSON) : null;
            setUserProfile(profile);
            console.log('User Profile:', profile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            Alert.alert('Error', 'Failed to load user profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingCircle} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!userProfile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>😕</Text>
                <Text style={styles.errorText}>No profile data available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Decorative Background */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                    {userProfile.imageUrl ? (
                        <Image
                            source={{ uri: userProfile.imageUrl }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <Text style={styles.profileImageText}>
                                {userProfile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.profileImageBorder} />
                </View>
                <Text style={styles.profileName}>{userProfile.fullName}</Text>
                <Text style={styles.profileSubtitle}>Member since {new Date().getFullYear()}</Text>
            </View>

            {/* Profile Details Card */}
            <View style={styles.detailsCard}>
                <Text style={styles.cardTitle}>Profile Information</Text>
                
                {/* Email Field */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={styles.icon}>📧</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{userProfile.email}</Text>
                    </View>
                </View>

                {/* Phone Field */}
                {userProfile.phone && (
                    <View style={styles.infoRow}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.accent2 + '20' }]}>
                            <Text style={styles.icon}>📱</Text>
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{userProfile.phone || 'Not provided'}</Text>
                        </View>
                    </View>
                )}

                {/* Age Field */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.accent1 + '20' }]}>
                        <Text style={styles.icon}>🎂</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <Text style={styles.infoValue}>{userProfile.age} years old</Text>
                    </View>
                </View>

                {/* Physical Condition Field */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.accent4 + '20' }]}>
                        <Text style={styles.icon}>♿</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Physical Condition</Text>
                        <Text style={styles.infoValue}>
                            {userProfile.physicalCondition?.charAt(0).toUpperCase() + userProfile.physicalCondition?.slice(1) || 'Not specified'}
                        </Text>
                    </View>
                </View>

                {/* Birthday Field */}
                <View style={[styles.infoRow, styles.infoRowLast]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                        <Text style={styles.icon}>📅</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Birthday</Text>
                        <Text style={styles.infoValue}>
                            {`${userProfile.birthYear}-${String(userProfile.birthMonth).padStart(2, '0')}-${String(userProfile.birthDay).padStart(2, '0')}`}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push('/views/MapView')}
                >
                    <Text style={styles.actionButtonIcon}>🗺️</Text>
                    <Text style={styles.actionButtonText}>Start Navigation</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray50,
        position: 'relative',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 0,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.primary,
        opacity: 0.15,
    },
    decorativeCircle2: {
        position: 'absolute',
        top: 100,
        left: -40,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.secondary,
        opacity: 0.12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray50,
    },
    loadingCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: colors.primary,
        borderTopColor: 'transparent',
        marginBottom: spacing.md,
    },
    loadingText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray50,
        padding: spacing.xl,
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        paddingTop: spacing.xxl + 20,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageText: {
        ...typography.h1,
        color: colors.primary,
        fontSize: 48,
    },
    profileImageBorder: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: colors.white,
    },
    profileName: {
        ...typography.h2,
        color: colors.white,
        marginBottom: spacing.xs,
    },
    profileSubtitle: {
        ...typography.caption,
        color: colors.gray100,
        opacity: 0.9,
    },
    detailsCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        margin: spacing.xl,
        marginTop: spacing.lg,
        ...shadows.large,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 24,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    infoValue: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    actionsContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    actionButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.medium,
    },
    actionButtonIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    actionButtonText: {
        ...typography.bodyBold,
        color: colors.white,
        fontSize: 16,
    },
});

export default AccountView;