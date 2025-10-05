import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig.js'
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

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
            navigation.navigate('accountView');
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
       
        navigation.navigate('SignUpScreen');
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView 
                style={{ flex: 1, backgroundColor: '#ffffff' }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 32,
                }}
            >
                <Text
                    style={{
                        fontSize: 36,
                        color: '#57575aff',
                        fontWeight: '700',
                        marginBottom: 32,
                        letterSpacing: 1,
                    }}
                >
                    Login Page
                </Text>
                <TextInput
                    placeholder='Email'
                    placeholderTextColor="#a59f9fff"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                        width: 260,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 18,
                        backgroundColor: '#fff',
                        borderColor: '#c9c9c9',
                        borderWidth: 1,
                        borderRadius: 12,
                        fontSize: 16,
                        color: '#22223b',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}
                />
                <TextInput
                    placeholder='Password'
                    placeholderTextColor="#adb5bd"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        width: 260,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 24,
                        backgroundColor: '#fff',
                        borderColor: '#c9c9c9',
                        borderWidth: 1,
                        borderRadius: 12,
                        fontSize: 16,
                        color: '#22223b',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}
                />
                <TouchableOpacity onPress={handleCreateAccount}>
                    <Text style={{ color: '#2164a3ff', marginBottom: 12, fontSize: 16 }}>
                        Create an Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={{ color: '#2164a3ff', marginBottom: 24, fontSize: 16 }}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={authenticateUser}
                    disabled={isLoading}
                    style={{
                        width: 260,
                        backgroundColor: isLoading ? '#ccc' : '#007AFF',
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {isLoading ? 'Signing In...' : 'Login'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginPage;