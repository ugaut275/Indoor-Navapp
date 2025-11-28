import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig.js'
import { useRouter } from 'expo-router';
import { colors, shadows, typography, spacing, borderRadius } from '../../theme';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const authenticateUser = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in!');
            Alert.alert('Success', 'Signed in successfully!');
            router.replace('/views/accountView');
        } catch (error) {
            console.log('Error:', error.code);
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Error', 'No account found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                Alert.alert('Error', 'Incorrect password.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Invalid email address.');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Feature coming soon!');
    };

    const handleCreateAccount = () => {
       
        router.push('/views/signUp');
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
                {/* Decorative Circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />
                
                <View style={styles.contentContainer}>
                    {/* Logo/Title Section */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Email</Text>
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

                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                placeholder='Enter your password'
                                placeholderTextColor={colors.gray400}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>

                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={authenticateUser}
                            disabled={isLoading}
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity onPress={handleCreateAccount} style={styles.signUpButton}>
                            <Text style={styles.signUpButtonText}>
                                Create an Account
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
        height: '60%',
        backgroundColor: colors.gradientStart,
        opacity: 0.9,
    },
    gradientLayer2: {
        position: 'absolute',
        top: '20%',
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.secondary,
        opacity: 0.6,
    },
    gradientLayer3: {
        position: 'absolute',
        bottom: '10%',
        left: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: colors.accent1,
        opacity: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl + 20,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 100,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.accent3,
        opacity: 0.3,
    },
    decorativeCircle2: {
        position: 'absolute',
        top: 200,
        left: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.accent4,
        opacity: 0.25,
    },
    decorativeCircle3: {
        position: 'absolute',
        bottom: 150,
        right: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondary,
        opacity: 0.2,
    },
    contentContainer: {
        zIndex: 1,
    },
    titleContainer: {
        marginBottom: spacing.xxl,
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
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
    },
    forgotPasswordText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.medium,
    },
    loginButtonDisabled: {
        backgroundColor: colors.gray400,
        opacity: 0.6,
    },
    loginButtonText: {
        ...typography.bodyBold,
        color: colors.white,
        fontSize: 18,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray300,
    },
    dividerText: {
        ...typography.caption,
        color: colors.gray500,
        marginHorizontal: spacing.md,
    },
    signUpButton: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md + 4,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.secondary,
    },
    signUpButtonText: {
        ...typography.bodyBold,
        color: colors.secondary,
        fontSize: 16,
    },
});

export default LoginPage;