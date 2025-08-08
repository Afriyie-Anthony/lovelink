import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to send reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to OTP verification
      router.push('/(auth)/otp-verification');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Forgot Password</Text>
        </View>

        {/* Logo */}
        <View className="items-center mb-8">
          <View className="flex-row justify-center mb-6">
            <Image source={require('../../assets/images/logo.png')} className="" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Reset Password</Text>
          <Text className="text-gray-600 text-center">
            Enter your email address and we'll send you a verification code to reset your password.
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-8">
          <Text className="text-gray-600 text-sm mb-2">Email Address</Text>
          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <TextInput
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-lg"
            />
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSendResetEmail}
          disabled={loading}
          className={`py-4 rounded-lg mb-8 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">Remember your password? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-red-500 font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
