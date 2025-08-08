import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Matches() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Ionicons name="heart" size={64} color="#ef4444" />
      <Text className="text-2xl font-bold text-gray-800 mt-4">Matches</Text>
      <Text className="text-gray-600 mt-2">Your matches will appear here</Text>
    </View>
  );
}
