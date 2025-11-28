import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [physicalCondition, setPhysicalCondition] = useState('without wheelchair');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const conditionOptions = [
        { value: 'without wheelchair', label: 'Without Wheelchair', description: 'No mobility limitations' },
        { value: 'limited accessability', label: 'Limited Accessibility', description: 'Significant limitations, needs accessible routes' },
        { value: 'wheelchair', label: 'Wheelchair', description: 'Uses wheelchair, requires accessible paths' }
    ];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const calculateAge = (year, month, day) => {
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateBirthday = (year, month, day) => {
        const currentYear = new Date().getFullYear();
        
        if (year < 1900 || year > currentYear) return { valid: false, message: 'Please enter a valid birth year (1900-current)' };
        if (month < 1 || month > 12) return { valid: false, message: 'Please enter a valid month (1-12)' };
        if (day < 1 || day > 31) return { valid: false, message: 'Please enter a valid day (1-31)' };
        
        const date = new Date(year, month - 1, day);
        if (date.getMonth() !== month - 1 || date.getDate() !== day) {
            return { valid: false, message: 'Please enter a valid date' };
        }
        
        const today = new Date();
        if (date > today) return { valid: false, message: 'Birthday cannot be in the future' };
        
        const age = calculateAge(year, month, day);
        if (age < 0 || age > 150) return { valid: false, message: 'Please enter a valid age (0-150)' };
        
        return { valid: true, age };
    };

    // Save user profile to local JSON file (AsyncStorage)
    const saveUserProfileToLocal = async (userData) => {
        try {
            // Get existing users or initialize empty object
            const existingUsersJSON = await AsyncStorage.getItem('userProfiles');
            const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : {};
            
            // Add new user profile (using email as key)
            existingUsers[userData.email] = {
                ...userData,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            // Save back to AsyncStorage
            await AsyncStorage.setItem('userProfiles', JSON.stringify(existingUsers));
            console.log('User profile saved locally:', userData.email);
            
            return true;
        } catch (error) {
            console.error('Error saving user profile locally:', error);
            return false;
        }
    };

    const handleSignUp = async () => {
        // Validation
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name.');
            return;
        }

        const year = parseInt(birthYear);
        const month = parseInt(birthMonth);
        const day = parseInt(birthDay);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            Alert.alert('Error', 'Please enter valid birthday numbers.');
            return;
        }

        const birthdayValidation = validateBirthday(year, month, day);
        if (!birthdayValidation.valid) {
            Alert.alert('Error', birthdayValidation.message);
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userProfile = {
                uid: user.uid,
                email: email,
                fullName: fullName.trim(),
                birthYear: year,
                birthMonth: month,
                birthDay: day,
                age: birthdayValidation.age,
                physicalCondition: physicalCondition,
            };

            // 3. Save user profile to local JSON storage
            const saveSuccess = await saveUserProfileToLocal(userProfile);
            
            if (saveSuccess) {
                await AsyncStorage.setItem('currentUser', JSON.stringify(userProfile));
                
                Alert.alert('Success', 'Account created successfully!', [
                    { 
                        text: 'OK', 
                        onPress: () => router.replace('/views/LoginPage') 
                    }
                ]);
            } else {
                throw new Error('Failed to save user profile locally');
            }

        } catch (error) {
            console.log('Error:', error.code);
            
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'An account with this email already exists.');
            } else if (error.code === 'auth/weak-password') {
                Alert.alert('Error', 'Password is too weak.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Invalid email address.');
            } else {
                Alert.alert('Error', error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        router.replace('/views/LoginPage');
    };

    const displayAge = () => {
        const year = parseInt(birthYear);
        const month = parseInt(birthMonth);
        const day = parseInt(birthDay);
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const validation = validateBirthday(year, month, day);
            if (validation.valid) {
                return `Age: ${validation.age} years old`;
            }
        }
        return 'Age: --';
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
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and start navigating</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                placeholder='Enter your email'
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                placeholder='Create a password'
                                placeholderTextColor={colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>

                        {/* Full Name */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                placeholder='Enter your full name'
                                placeholderTextColor={colors.textMuted}
                                value={fullName}
                                onChangeText={setFullName}
                                style={styles.input}
                            />
                        </View>

                        {/* Birthday Section */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Birthday</Text>
                            <View style={styles.birthdayRow}>
                                <View style={styles.birthdayInputContainer}>
                                    <TextInput
                                        placeholder='Year'
                                        placeholderTextColor={colors.textMuted}
                                        value={birthYear}
                                        onChangeText={setBirthYear}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        style={styles.birthdayInput}
                                    />
                                </View>
                                <View style={styles.birthdayInputContainer}>
                                    <TextInput
                                        placeholder='Month'
                                        placeholderTextColor={colors.textMuted}
                                        value={birthMonth}
                                        onChangeText={setBirthMonth}
                                        keyboardType="numeric"
                                        maxLength={2}
                                        style={styles.birthdayInput}
                                    />
                                </View>
                                <View style={styles.birthdayInputContainer}>
                                    <TextInput
                                        placeholder='Day'
                                        placeholderTextColor={colors.textMuted}
                                        value={birthDay}
                                        onChangeText={setBirthDay}
                                        keyboardType="numeric"
                                        maxLength={2}
                                        style={styles.birthdayInput}
                                    />
                                </View>
                            </View>
                            <Text style={styles.ageDisplay}>
                                {displayAge()}
                            </Text>
                        </View>

                        {/* Physical Condition */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Physical Condition</Text>
                            {conditionOptions.map((condition) => (
                                <TouchableOpacity
                                    key={condition.value}
                                    onPress={() => setPhysicalCondition(condition.value)}
                                    style={[
                                        styles.conditionOption,
                                        physicalCondition === condition.value && styles.conditionOptionSelected
                                    ]}
                                >
                                    <View style={[
                                        styles.radioButton,
                                        physicalCondition === condition.value && styles.radioButtonSelected
                                    ]}>
                                        {physicalCondition === condition.value && (
                                            <View style={styles.radioButtonInner} />
                                        )}
                                    </View>
                                    <View style={styles.conditionContent}>
                                        <Text style={[
                                            styles.conditionLabel,
                                            physicalCondition === condition.value && styles.conditionLabelSelected
                                        ]}>
                                            {condition.label}
                                        </Text>
                                        <Text style={styles.conditionDescription}>
                                            {condition.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={isLoading}
                            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                        >
                            <Text style={styles.signUpButtonText}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        {/* Login Redirect */}
                        <TouchableOpacity onPress={handleLoginRedirect} style={styles.loginRedirectButton}>
                            <Text style={styles.loginRedirectText}>
                                Already have an account? Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

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
    },
    contentContainer: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    titleContainer: {
        marginBottom: spacing.xl,
        alignItems: 'flex-start',
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
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
    birthdayRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    birthdayInputContainer: {
        flex: 1,
    },
    birthdayInput: {
        backgroundColor: colors.backgroundElevated,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.sm,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
        textAlign: 'center',
    },
    ageDisplay: {
        ...typography.caption,
        color: colors.primary,
        textAlign: 'center',
        marginTop: spacing.sm,
        fontWeight: '500',
    },
    conditionOption: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: colors.backgroundElevated,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: borderRadius.md,
    },
    conditionOptionSelected: {
        backgroundColor: colors.primaryMuted,
        borderColor: colors.primary,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.borderLight,
        backgroundColor: colors.backgroundElevated,
        marginRight: spacing.md,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    radioButtonInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.backgroundCard,
    },
    conditionContent: {
        flex: 1,
    },
    conditionLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        fontWeight: '500',
    },
    conditionLabelSelected: {
        color: colors.primary,
    },
    conditionDescription: {
        ...typography.caption,
        color: colors.textMuted,
        lineHeight: 18,
    },
    signUpButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    signUpButtonDisabled: {
        backgroundColor: colors.gray700,
        opacity: 0.5,
    },
    signUpButtonText: {
        ...typography.bodyBold,
        color: colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    loginRedirectButton: {
        paddingVertical: spacing.sm,
    },
    loginRedirectText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default SignUpScreen;