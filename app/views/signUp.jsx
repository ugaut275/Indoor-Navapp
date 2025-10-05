import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [physicalCondition, setPhysicalCondition] = useState('without wheelchair');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

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
                        onPress: () => navigation.navigate('LoginPage', { user: userProfile }) 
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
        navigation.navigate('LoginPage');
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
            style={{ flex: 1 }}
        >
            <ScrollView 
                style={{ flex: 1, backgroundColor: '#ffffff' }}
                contentContainerStyle={{
                    flexGrow: 1,
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
                        textAlign: 'center',
                    }}
                >
                    Create Account
                </Text>

                {/* Email */}
                <TextInput
                    placeholder='Email Address'
                    placeholderTextColor="#a59f9fff"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                        width: '100%',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 18,
                        backgroundColor: '#fff',
                        borderColor: '#c9c9c9',
                        borderWidth: 1,
                        borderRadius: 12,
                        fontSize: 16,
                        color: '#22223b',
                    }}
                />

                {/* Password */}
                <TextInput
                    placeholder='Password'
                    placeholderTextColor="#a59f9fff"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        width: '100%',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 18,
                        backgroundColor: '#fff',
                        borderColor: '#c9c9c9',
                        borderWidth: 1,
                        borderRadius: 12,
                        fontSize: 16,
                        color: '#22223b',
                    }}
                />

                {/* Full Name */}
                <TextInput
                    placeholder='Full Name'
                    placeholderTextColor="#a59f9fff"
                    value={fullName}
                    onChangeText={setFullName}
                    style={{
                        width: '100%',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        marginBottom: 18,
                        backgroundColor: '#fff',
                        borderColor: '#c9c9c9',
                        borderWidth: 1,
                        borderRadius: 12,
                        fontSize: 16,
                        color: '#22223b',
                    }}
                />

                {/* Birthday Section */}
                <Text style={{ fontSize: 16, color: '#57575aff', marginBottom: 12, fontWeight: '600' }}>
                    Birthday
                </Text>
                
                <View style={{ flexDirection: 'row', marginBottom: 18, gap: 12 }}>
                    <TextInput
                        placeholder='Year'
                        placeholderTextColor="#a59f9fff"
                        value={birthYear}
                        onChangeText={setBirthYear}
                        keyboardType="numeric"
                        maxLength={4}
                        style={{
                            flex: 1,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            backgroundColor: '#fff',
                            borderColor: '#c9c9c9',
                            borderWidth: 1,
                            borderRadius: 12,
                            fontSize: 16,
                            color: '#22223b',
                            textAlign: 'center',
                        }}
                    />
                    <TextInput
                        placeholder='Month'
                        placeholderTextColor="#a59f9fff"
                        value={birthMonth}
                        onChangeText={setBirthMonth}
                        keyboardType="numeric"
                        maxLength={2}
                        style={{
                            flex: 1,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            backgroundColor: '#fff',
                            borderColor: '#c9c9c9',
                            borderWidth: 1,
                            borderRadius: 12,
                            fontSize: 16,
                            color: '#22223b',
                            textAlign: 'center',
                        }}
                    />
                    <TextInput
                        placeholder='Day'
                        placeholderTextColor="#a59f9fff"
                        value={birthDay}
                        onChangeText={setBirthDay}
                        keyboardType="numeric"
                        maxLength={2}
                        style={{
                            flex: 1,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            backgroundColor: '#fff',
                            borderColor: '#c9c9c9',
                            borderWidth: 1,
                            borderRadius: 12,
                            fontSize: 16,
                            color: '#22223b',
                            textAlign: 'center',
                        }}
                    />
                </View>

                {/* Age Display */}
                <Text style={{ 
                    fontSize: 14, 
                    color: '#2164a3ff', 
                    marginBottom: 18, 
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}>
                    {displayAge()}
                </Text>

                {/* Physical Condition */}
                <Text style={{ fontSize: 16, color: '#57575aff', marginBottom: 12, fontWeight: '600' }}>
                    Physical Condition
                </Text>
                
                {conditionOptions.map((condition) => (
                    <TouchableOpacity
                        key={condition.value}
                        onPress={() => setPhysicalCondition(condition.value)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            padding: 16,
                            marginBottom: 8,
                            backgroundColor: physicalCondition === condition.value ? '#e8f4ff' : '#fff',
                            borderColor: physicalCondition === condition.value ? '#007AFF' : '#c9c9c9',
                            borderWidth: 2,
                            borderRadius: 12,
                        }}
                    >
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: physicalCondition === condition.value ? '#007AFF' : '#c9c9c9',
                            backgroundColor: physicalCondition === condition.value ? '#007AFF' : 'transparent',
                            marginRight: 12,
                            marginTop: 2,
                        }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#22223b', marginBottom: 4 }}>
                                {condition.label}
                            </Text>
                            <Text style={{ fontSize: 14, color: '#666', lineHeight: 18 }}>
                                {condition.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Sign Up Button */}
                <TouchableOpacity
                    onPress={handleSignUp}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        backgroundColor: isLoading ? '#ccc' : '#007AFF',
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginTop: 24,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                </TouchableOpacity>

                {/* Login Redirect */}
                <TouchableOpacity onPress={handleLoginRedirect}>
                    <Text style={{ 
                        color: '#2164a3ff', 
                        textAlign: 'center', 
                        fontSize: 16,
                    }}>
                        Already have an account? Sign In
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen;