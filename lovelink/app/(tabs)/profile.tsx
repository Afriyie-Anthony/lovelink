import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Ionicons name="person" size={64} color="#ef4444" />
      <Text className="text-2xl font-bold text-gray-800 mt-4">Profile</Text>
      <Text className="text-gray-600 mt-2">Your profile settings will appear here</Text>
    </View>
  );
}
