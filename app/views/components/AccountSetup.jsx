import {View, Text, TextInput, TouchableOpacity,Button} from 'react-native';
import React from 'react';
import { useState } from 'react';

const AccountSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <View className="bg-white p-10 rounded-2xl shadow-md w-80">
        <Text className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Account Setup
        </Text>

        <View className="flex flex-col gap-5 mb-4">
          <TextInput
            onChange={text => setEmail(text)}
            placeholder="Email"
            className="px-5 py-4 border-2 border-gray-100 rounded-xl text-base font-normal w-full bg-gray-50 text-gray-800"
            placeholderTextColor="#888"
          />
          <TextInput
            onChange={text => setPassword(text)}
            placeholder="Password"
            secureTextEntry
            className="px-5 py-4 border-2 border-gray-100 rounded-xl text-base font-normal w-full bg-gray-50 text-gray-800"
            placeholderTextColor="#888"
          />
          <Button className="bg-primary py-4 rounded-xl active:opacity-80" onClick={() => RegisterUser(email,password)}>
            <Text className="text-white text-center font-semibold text-base">
              Create Account
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const RegisterUser = (Email, Password) => {
    // Registration logic here
}

export default AccountSetup;