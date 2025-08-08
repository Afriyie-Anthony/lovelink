import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login:', { email, password });
    router.replace('/(tabs)/discover');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login`);
    // Handle social login
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        {/* Logo at top */}
        <View className="items-center mb-8">
          <View className="flex-row justify-center mb-6">
            <Image source={require('../../assets/images/logo.png')} className="" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</Text>
          <Text className="text-gray-600 text-center">Sign in to continue your journey</Text>
        </View>

        {/* Login Form */}
        <View className="flex-col gap-10 mb-8">
          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <Text className="text-gray-600 text-sm mb-1">Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-lg"
            />
          </View>

          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <Text className="text-gray-600 text-sm mb-1">Password</Text>
            <View className="flex-row items-center">
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="text-lg flex-1"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} className="mb-8">
          <Text className="text-red-500 text-center font-medium">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-red-500 py-4 rounded-lg mb-8"
        >
          <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
        </TouchableOpacity>

        {/* Social Login */}
        <View className="items-center mb-8">
          <Text className="text-gray-500 text-sm mb-4">Or continue with</Text>
          <View className="flex-row flex-row gap-10">
            <TouchableOpacity
              onPress={() => handleSocialLogin('Google')}
              className="w-16 h-16 bg-white border border-gray-300 rounded-lg items-center justify-center"
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSocialLogin('Apple')}
              className="w-16 h-16 bg-white border border-gray-300 rounded-lg items-center justify-center"
            >
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup-options')}>
            <Text className="text-red-500 font-medium">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
