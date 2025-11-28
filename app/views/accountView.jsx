import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

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
                <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
                <Text style={styles.errorText}>No profile data available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                    <View style={styles.iconContainer}>
                        <Ionicons name="mail-outline" size={22} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{userProfile.email}</Text>
                    </View>
                </View>

                {/* Phone Field */}
                {userProfile.phone && (
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="call-outline" size={22} color={colors.accent2} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{userProfile.phone || 'Not provided'}</Text>
                        </View>
                    </View>
                )}

                {/* Age Field */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="calendar-outline" size={22} color={colors.accent1} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <Text style={styles.infoValue}>{userProfile.age} years old</Text>
                    </View>
                </View>

                {/* Physical Condition Field */}
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="accessibility-outline" size={22} color={colors.accent4} />
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
                    <View style={styles.iconContainer}>
                        <Ionicons name="gift-outline" size={22} color={colors.secondary} />
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
                    <Ionicons name="navigate-outline" size={20} color={colors.background} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.actionButtonText}>Start Navigation</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
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
        backgroundColor: colors.background,
        padding: spacing.xl,
    },
    errorText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    profileHeader: {
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        paddingTop: spacing.xxl + 20,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    profileImageText: {
        ...typography.h1,
        color: colors.primary,
        fontSize: 40,
    },
    profileImageBorder: {
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        borderRadius: 53,
        borderWidth: 2,
        borderColor: colors.borderAccent,
    },
    profileName: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    profileSubtitle: {
        ...typography.caption,
        color: colors.textMuted,
    },
    detailsCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        margin: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.medium,
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
        borderBottomColor: colors.border,
    },
    infoRowLast: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.backgroundElevated,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    infoValue: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    actionsContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    actionButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.medium,
    },
    actionButtonText: {
        ...typography.bodyBold,
        color: colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AccountView;