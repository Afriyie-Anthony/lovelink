import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupOptions() {
  const handleEmailSignup = () => {
    router.push('/(auth)/signup');
  };

  // const handlePhoneSignup = () => {
  //   // Handle phone signup
  //   console.log('Phone signup');
  // };

  const handleManualSignup = () => {
    router.push('/profile-details');
  };

  const handleSocialSignup = (provider: string) => {
    // Handle social signup
    console.log(`${provider} signup`);
  };

  return (
    <View className="flex-1 bg-white px-6">
     
      {/* Top Section with Logo */}
      <View className="items-center pt-16 pb-8">
      <View className="flex-row justify-center mb-10 mt-10">
       <Image source={require('../../assets/images/logo.png')} className="" />
      </View>
        <Text className="text-2xl font-bold text-gray-800">Sign up to continue</Text>
      </View>

      

      {/* Centered Content */}
      <View className="flex-1 justify-center mb-10 flex-col gap-10">
        {/* Primary Sign-up Options */}
        <View className="space-y-4 mb-8 flex-col gap-10">
          <TouchableOpacity
            onPress={handleEmailSignup}
            className="bg-red-500 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Continue with email
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={handlePhoneSignup}
            className="bg-white border border-gray-300 py-4 rounded-lg my-5"
          >
            <Text className="text-red-500 text-center font-semibold text-lg">
              Use phone number
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={handleManualSignup}
            className="bg-white border border-gray-300 py-4 rounded-lg"
          >
            <Text className="text-red-500 text-center font-semibold text-lg">
              Sign up manually
            </Text>
          </TouchableOpacity>
        </View>

        {/* Separator */}
        {/* <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-300" />
         
          <View className="flex-1 h-px bg-gray-300" />
        </View> */}

        {/* Social Login Options */}
        <View className="flex-row justify-center gap-12 mb-8">
          {/* <TouchableOpacity
            onPress={() => handleSocialSignup('Facebook')}
            className="w-16 h-16 bg-white border border-gray-300 rounded-lg items-center justify-center"
          >
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </TouchableOpacity> */}
{/* 
          <TouchableOpacity
            onPress={() => handleSocialSignup('Google')}
            className="w-16 h-16 bg-white border border-gray-300 rounded-lg items-center justify-center"
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            onPress={() => handleSocialSignup('Apple')}
            className="w-16 h-16 bg-white border border-gray-300 rounded-lg items-center justify-center"
          >
            <Ionicons name="logo-apple" size={24} color="#000000" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Footer Links */}
      <View className="flex-row justify-center space-x-4 pb-8">
        <TouchableOpacity>
          <Text className="text-red-500 font-medium">Terms of use</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-red-500 font-medium">Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
