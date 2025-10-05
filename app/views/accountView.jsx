import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountView = () => {
    const [userProfile, setUserProfile] = useState(null);
    const navigation = useNavigation();
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!userProfile) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No profile data available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0'}}>
            <View style={{ alignItems: 'center', backgroundColor: '#171a1fff', borderBottomRightRadius:20, borderBottomLeftRadius:20, paddingVertical: 20}}>
                {/* Profile Image */}
                <View style={{width: 120,height: 120,borderRadius: 60,overflow: 'hidden',backgroundColor: '#ddd', justifyContent: 'center',alignItems: 'center',marginBottom: 10}}>
                    {userProfile.imageUrl ? (
                        <Image
                            source={{ uri: userProfile.imageUrl }}
                            style={{ width: 120, height: 120 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={{ color: '#888' }}>No Image</Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: 20 }}>
                    <Text style={{ fontSize: 20, color: '#ece6e6ff' }}>
                        {userProfile.fullName} | something 
                    </Text>
                </View>
               
            </View>

            <View style={{ 
                padding: 20, 
                margin: 20, 
                backgroundColor: '#fff', 
                borderRadius: 15,
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.3, 
                shadowRadius: 4, 
                elevation: 5 
            }}>
                {/* Email Field */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                }}>
                    <Text style={{ fontSize: 24, marginRight: 10 }}>📧</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Email</Text>
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{userProfile.email}</Text>
                    </View>
                </View>

                {/* Phone Field */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                }}>
                    <Text style={{ fontSize: 24, marginRight: 10 }}>📱</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Phone</Text>
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{userProfile.phone}</Text>
                    </View>
                </View>

                {/* Age Field */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                }}>
                    <Text style={{ fontSize: 24, marginRight: 10 }}>🎂</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Age</Text>
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{userProfile.age}</Text>
                    </View>
                </View>

                {/* Physical Condition Field */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee'
                }}>
                    <Text style={{ fontSize: 24, marginRight: 10 }}>♿</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Physical Condition</Text>
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{userProfile.physicalCondition}</Text>
                    </View>
                </View>

                {/* Birthday Field */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15
                }}>
                    <Text style={{ fontSize: 24, marginRight: 10 }}>📅</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Birthday</Text>
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
                            {`${userProfile.birthYear}-${userProfile.birthMonth}-${userProfile.birthDay}`}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default AccountView;