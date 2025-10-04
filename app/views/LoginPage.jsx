import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, KeyboardAvoidingView  } from 'react-native'
import React, { useState } from 'react'

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView>
        <ScrollView style={{ height: '100%', backgroundColor: '#ffffffff' }}
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                style: 'italic',
            
             
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
           
                }}
            />
            <TextInput
                placeholder='Password'
                placeholderTextColor="#adb5bd"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{width: 260,paddingVertical: 14,paddingHorizontal: 16,marginBottom: 24, backgroundColor: '#fff',borderColor: '#c9c9c9',borderWidth: 1,borderRadius: 12,fontSize: 16,color: '#22223b',elevation: 2,
                }}
            />
            <TouchableOpacity onPress={() => forgotpassword()}>
                <Text style={{ color: '#2164a3ff', marginBottom: 12 }}>Create an Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => forgotpassword()}>
                <Text style={{ color: '#2164a3ff', marginBottom: 12 }}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{ width: 260, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                <Button
                    title='Login'
                    onPress={() => console.log('Email:', email, 'Password:', password)}
                />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}


const forgotpassword = () => {
    console.log('Forgot Password Pressed');
}
const authenticateUser = (email, password) => {
    // Add authentication logic here
    console.log('Authenticating user with email:', email, 'and password:', password);
}

export default LoginPage