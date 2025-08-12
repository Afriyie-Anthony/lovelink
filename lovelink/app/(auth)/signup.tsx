import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from "@/api/auth"; // your updated auth.ts
import * as ImagePicker from "expo-image-picker";

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<any>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0]); // store file info in state
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!profilePicture) {
      Alert.alert('Error', 'Please select a profile picture');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        profilePicture: {
          uri: profilePicture.uri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any, // type assertion for FormData
      });

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/profile-details');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        {/* Header */}
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Create Account</Text>
        </View>

        {/* Logo */}
        <View className="items-center mb-5">
          <View className="flex-row justify-center mb-10">
            <Image source={require('../../assets/images/logo.png')} className="" />
          </View>
          <Text className="text-lg text-gray-600 text-center">
            Join LoveLink and find your perfect match
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4 flex-col gap-5">
          {/* Full Name */}
          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <Text className="text-gray-600 text-sm mb-1">Full Name</Text>
            <TextInput
              placeholder="Enter your full name "
              value={fullName}
              onChangeText={setFullName}
              className="text-lg"
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
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

          {/* Password */}
          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <Text className="text-gray-600 text-sm mb-1">Password</Text>
            <View className="flex-row items-center">
              <TextInput
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
            <Text className="text-gray-600 text-sm mb-1">Confirm Password</Text>
            <View className="flex-row items-center">
              <TextInput
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="text-lg flex-1"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleImagePick}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture.uri }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                <Ionicons name="camera" size={32} color="gray" />
              </View>
            )}
          </TouchableOpacity>
          <Text className="mt-2 text-gray-600 text-sm">Add Profile Picture</Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className={`py-4 rounded-lg mt-8 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                Creating Account...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text className="text-gray-500 text-center mt-6 text-sm">
          By creating an account, you agree to our{' '}
          <Text className="text-red-500">Terms of Service</Text> and{' '}
          <Text className="text-red-500">Privacy Policy</Text>
        </Text>

        {/* Already have account */}
        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-red-500 font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
