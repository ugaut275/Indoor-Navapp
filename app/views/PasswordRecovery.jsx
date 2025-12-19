import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const PasswordRecovery = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Security Questions, 3: New Password
    const [email, setEmail] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailSubmit = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            // Retrieve user profile from AsyncStorage
            const existingUsersJSON = await AsyncStorage.getItem('userProfiles');
            const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : {};

            if (!existingUsers[email]) {
                Alert.alert('Error', 'No account found with this email address.');
                setIsLoading(false);
                return;
            }

            const profile = existingUsers[email];

            if (!profile.securityQuestion1 || !profile.securityQuestion2) {
                Alert.alert('Error', 'This account does not have security questions set up. Please contact support.');
                setIsLoading(false);
                return;
            }

            setUserProfile(profile);
            setStep(2);
        } catch (error) {
            console.error('Error loading user profile:', error);
            Alert.alert('Error', 'Failed to load account information.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSecurityQuestionsSubmit = () => {
        if (!answer1.trim() || !answer2.trim()) {
            Alert.alert('Error', 'Please answer both security questions.');
            return;
        }

        // Compare answers (case-insensitive)
        const answer1Match = answer1.trim().toLowerCase() === userProfile.securityAnswer1;
        const answer2Match = answer2.trim().toLowerCase() === userProfile.securityAnswer2;

        if (!answer1Match || !answer2Match) {
            Alert.alert('Error', 'One or more security answers are incorrect. Please try again.');
            setAnswer1('');
            setAnswer2('');
            return;
        }

        // Answers are correct, proceed to password reset
        setStep(3);
    };

    const handlePasswordReset = async () => {
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
    
            const existingUsersJSON = await AsyncStorage.getItem('userProfiles');
            const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : {};

            if (existingUsers[email]) {

                existingUsers[email] = {
                    ...existingUsers[email],
                    lastPasswordReset: new Date().toISOString()
                };

                await AsyncStorage.setItem('userProfiles', JSON.stringify(existingUsers));

                Alert.alert(
                    'Success',
                    'Your security verification is complete. Please use the "Forgot Password" feature in Firebase Console or contact support to reset your password.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/views/LoginPage')
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            Alert.alert('Error', 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="lock-closed-outline" size={48} color={colors.primary} />
                        </View>
                        <Text style={styles.title}>Password Recovery</Text>
                        <Text style={styles.subtitle}>
                            {step === 1 && 'Enter your email to begin'}
                            {step === 2 && 'Answer your security questions'}
                            {step === 3 && 'Create a new password'}
                        </Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Email Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Enter your email'
                                        placeholderTextColor={colors.textMuted}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleEmailSubmit}
                                    disabled={isLoading}
                                    style={[styles.button, isLoading && styles.buttonDisabled]}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Checking...' : 'Continue'}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={20} color={colors.background} style={{ marginLeft: spacing.sm }} />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Step 2: Security Questions */}
                        {step === 2 && userProfile && (
                            <>
                                <View style={styles.questionSection}>
                                    <View style={styles.questionBox}>
                                        <Ionicons name="help-circle-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                                        <Text style={styles.questionText}>{userProfile.securityQuestion1}</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Your answer'
                                        placeholderTextColor={colors.textMuted}
                                        value={answer1}
                                        onChangeText={setAnswer1}
                                        autoCapitalize="words"
                                    />
                                </View>

                                <View style={styles.questionSection}>
                                    <View style={styles.questionBox}>
                                        <Ionicons name="help-circle-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                                        <Text style={styles.questionText}>{userProfile.securityQuestion2}</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Your answer'
                                        placeholderTextColor={colors.textMuted}
                                        value={answer2}
                                        onChangeText={setAnswer2}
                                        autoCapitalize="words"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleSecurityQuestionsSubmit}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Verify Answers</Text>
                                    <Ionicons name="checkmark" size={20} color={colors.background} style={{ marginLeft: spacing.sm }} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setStep(1)}
                                    style={styles.backButton}
                                >
                                    <Ionicons name="arrow-back" size={18} color={colors.textSecondary} style={{ marginRight: spacing.xs }} />
                                    <Text style={styles.backButtonText}>Back to Email</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <View style={styles.successBox}>
                                    <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                                    <Text style={styles.successText}>Security verification successful!</Text>
                                    <Text style={styles.successSubtext}>Create a new password for your account</Text>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>New Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Enter new password'
                                        placeholderTextColor={colors.textMuted}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Confirm Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Re-enter new password'
                                        placeholderTextColor={colors.textMuted}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handlePasswordReset}
                                    disabled={isLoading}
                                    style={[styles.button, isLoading && styles.buttonDisabled]}
                                >
                                    <Text style={styles.buttonText}>
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </Text>
                                    <Ionicons name="shield-checkmark" size={20} color={colors.background} style={{ marginLeft: spacing.sm }} />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={() => router.replace('/views/LoginPage')}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel & Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl + 20,
        justifyContent: 'center',
    },
    contentContainer: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.medium,
    },
    inputWrapper: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
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
    questionSection: {
        marginBottom: spacing.lg,
    },
    questionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryMuted,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    questionText: {
        ...typography.body,
        color: colors.primary,
        flex: 1,
        fontWeight: '500',
    },
    successBox: {
        alignItems: 'center',
        padding: spacing.lg,
        marginBottom: spacing.lg,
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.success,
    },
    successText: {
        ...typography.h3,
        color: colors.success,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    successSubtext: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        alignItems: 'center',
        marginBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        ...shadows.medium,
    },
    buttonDisabled: {
        backgroundColor: colors.gray700,
        opacity: 0.5,
    },
    buttonText: {
        ...typography.bodyBold,
        color: colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        marginBottom: spacing.md,
    },
    backButtonText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginTop: spacing.sm,
    },
    cancelButtonText: {
        ...typography.body,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default PasswordRecovery;
