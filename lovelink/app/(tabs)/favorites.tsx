import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Favorites() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Ionicons name="star" size={64} color="#ef4444" />
      <Text className="text-2xl font-bold text-gray-800 mt-4">Favorites</Text>
      <Text className="text-gray-600 mt-2">Your favorite profiles will appear here</Text>
    </View>
  );
}
