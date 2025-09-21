import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";

export default function LoginView() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <View className="bg-white p-10 rounded-2xl shadow-md w-80">
        <Text className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Gallery App
        </Text>

        <View className="flex flex-col gap-5 mb-4">
          <TextInput
            placeholder="Email"
            className="px-5 py-4 border-2 border-gray-100 rounded-xl text-base font-normal w-full bg-gray-50 text-gray-800"
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="px-5 py-4 border-2 border-gray-100 rounded-xl text-base font-normal w-full bg-gray-50 text-gray-800"
            placeholderTextColor="#888"
          />
          <Link href="/gallery" asChild>
            <Pressable className="bg-primary py-4 rounded-xl active:opacity-80">
              <Text className="text-white text-center font-semibold text-base">
                Login
              </Text>
            </Pressable>
          </Link>
        </View>

        <Text className="text-xs text-gray-500 mt-6 font-light text-center">
          Photo by who
        </Text>
      </View>
    </View>
  );
}
