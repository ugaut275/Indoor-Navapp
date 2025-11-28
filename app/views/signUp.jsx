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
            {/* Gradient Background Layers */}
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Decorative Elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                
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
                                placeholderTextColor={colors.gray400}
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
                                placeholderTextColor={colors.gray400}
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
                                placeholderTextColor={colors.gray400}
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
                                        placeholderTextColor={colors.gray400}
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
                                        placeholderTextColor={colors.gray400}
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
                                        placeholderTextColor={colors.gray400}
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
        position: 'relative',
    },
    gradientLayer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: colors.secondary,
        opacity: 0.85,
    },
    gradientLayer2: {
        position: 'absolute',
        top: '15%',
        left: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: colors.accent3,
        opacity: 0.6,
    },
    gradientLayer3: {
        position: 'absolute',
        bottom: '20%',
        right: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: colors.accent1,
        opacity: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 80,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.accent4,
        opacity: 0.3,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: 200,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        opacity: 0.25,
    },
    contentContainer: {
        zIndex: 1,
    },
    titleContainer: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    title: {
        ...typography.h1,
        color: colors.white,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.gray100,
        textAlign: 'center',
        opacity: 0.9,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        ...shadows.large,
    },
    inputWrapper: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
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
    birthdayRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    birthdayInputContainer: {
        flex: 1,
    },
    birthdayInput: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 2,
        borderColor: colors.gray200,
        textAlign: 'center',
        ...shadows.small,
    },
    ageDisplay: {
        ...typography.caption,
        color: colors.primary,
        textAlign: 'center',
        marginTop: spacing.sm,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    conditionOption: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: colors.white,
        borderColor: colors.gray300,
        borderWidth: 2,
        borderRadius: borderRadius.md,
    },
    conditionOptionSelected: {
        backgroundColor: colors.primaryLight + '15',
        borderColor: colors.primary,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.gray300,
        backgroundColor: colors.white,
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
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.white,
    },
    conditionContent: {
        flex: 1,
    },
    conditionLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    conditionLabelSelected: {
        color: colors.primary,
    },
    conditionDescription: {
        ...typography.caption,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    signUpButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    signUpButtonDisabled: {
        backgroundColor: colors.gray400,
        opacity: 0.6,
    },
    signUpButtonText: {
        ...typography.bodyBold,
        color: colors.white,
        fontSize: 18,
    },
    loginRedirectButton: {
        paddingVertical: spacing.sm,
    },
    loginRedirectText: {
        ...typography.body,
        color: colors.primary,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default SignUpScreen;