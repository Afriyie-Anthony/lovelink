import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  
  const otpInputs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to password reset step
      setStep('password');
      
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    Alert.alert('Success', 'Verification code sent again!');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            {step === 'otp' ? 'Verify Code' : 'Reset Password'}
          </Text>
        </View>

        {/* Logo */}
        <View className="items-center mb-8">
          <View className="flex-row justify-center mb-6">
            <Image source={require('../../assets/images/logo.png')} className="" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {step === 'otp' ? 'Enter Verification Code' : 'Create New Password'}
          </Text>
          <Text className="text-gray-600 text-center">
            {step === 'otp' 
              ? 'We\'ve sent a 4-digit verification code to your email'
              : 'Enter your new password below'
            }
          </Text>
        </View>

        {step === 'otp' ? (
          <>
            {/* OTP Input */}
            <View className="mb-8">
              <View className="flex-row justify-center gap-10">
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) otpInputs.current[index] = ref;
                    }}
                    className="w-16 h-16 border border-gray-300 rounded-lg text-center text-2xl font-bold bg-white"
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={loading}
              className={`py-4 rounded-lg mb-8 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>

            {/* Resend OTP */}
            <TouchableOpacity onPress={resendOtp} className="mb-8">
              <Text className="text-red-500 text-center font-medium">
                Didn't receive code? Resend
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* New Password */}
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2">New Password</Text>
              <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
                <View className="flex-row items-center">
                  <TextInput
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
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

            {/* Confirm Password */}
            <View className="mb-8">
              <Text className="text-gray-600 text-sm mb-2">Confirm New Password</Text>
              <View className="bg-white rounded-lg px-4 border border-gray-300 py-2">
                <View className="flex-row items-center">
                  <TextInput
                    placeholder="Confirm new password"
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

            {/* Reset Password Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              className={`py-4 rounded-lg mb-8 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Back to Login */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">Remember your password? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-red-500 font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
