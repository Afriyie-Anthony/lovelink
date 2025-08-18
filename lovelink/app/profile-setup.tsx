import React, { use, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useUserStorage } from '@/store/hooks/useAuthStore';
import { completeProfile, manualSignUp } from '@/api/auth';
import { ActivityIndicator } from 'react-native';
export default function ProfileSetup() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { profile, clearProfileData } = useAuthStore()
  const token = useAuthStore.getState().token
  const user = useUserStorage.getState().user
  const [loading, setLoading] = useState(false);

  console.log(user)
  const interests = [
    { id: 'PHOTOGRAPHY', name: 'Photography', icon: 'camera-outline' },
    { id: 'SHOPPING', name: 'Shopping', icon: 'bag-handle-outline' },
    { id: 'KARAOKE', name: 'Karaoke', icon: 'mic-outline' },
    { id: 'YOGA', name: 'Yoga', icon: 'body-outline' },
    { id: 'COOKING', name: 'Cooking', icon: 'restaurant-outline' },
    { id: 'TENNIS', name: 'Tennis', icon: 'tennisball-outline' },
    { id: 'RUNNING', name: 'Run', icon: 'walk-outline' },
    { id: 'SWIMMING', name: 'Swimming', icon: 'water-outline' },
    { id: 'ART', name: 'Art', icon: 'color-palette-outline' },
    { id: 'TRAVELING', name: 'Traveling', icon: 'airplane-outline' },
    { id: 'EXTREME_SPORTS', name: 'Extreme', icon: 'skull-outline' },
    { id: 'MUSIC', name: 'Music', icon: 'musical-notes-outline' },
    { id: 'DRINKS', name: 'Drink', icon: 'wine-outline' },
    { id: 'VIDEO_GAMES', name: 'Video games', icon: 'game-controller-outline' },
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    if (!selectedGender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }
    setLoading(true)

    try {
      console.log("this is the finaldata:", profile)

      const finalData = {
        ...profile,
        gender: selectedGender,
        interests: selectedInterests,
        profileComplete: true
      };

      if (token) {
        if (!user?.id) {
          throw new Error("User not found");
        }
        // Complete profile flow
        console.log("finalData", finalData)
        await completeProfile(user.id, finalData);
      } else {
        // Manual sign-up flow
        await manualSignUp(finalData);
      }


      router.replace('/(tabs)/discover');

    } catch (error: any) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', error.response.data.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/discover');
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="flex-row justify-between items-center pt-12 pb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-red-500 font-medium">Skip</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">I am a</Text>

          <View className="flex-col gap-5">
            <TouchableOpacity
              onPress={() => setSelectedGender('woman')}
              className={`p-4 rounded-xl flex-row justify-between items-center ${selectedGender === 'woman' ? 'bg-red-500' : 'bg-white border border-gray-300'
                }`}
            >
              <Text className={`text-lg ${selectedGender === 'woman' ? 'text-white' : 'text-gray-700'}`}>
                Woman
              </Text>
              <Ionicons
                name={selectedGender === 'woman' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={selectedGender === 'woman' ? 'white' : '#d1d5db'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedGender('man')}
              className={`p-4 rounded-xl flex-row justify-between items-center ${selectedGender === 'man' ? 'bg-red-500' : 'bg-white border border-gray-300'
                }`}
            >
              <Text className={`text-lg ${selectedGender === 'man' ? 'text-white' : 'text-gray-700'}`}>
                Man
              </Text>
              <Ionicons
                name={selectedGender === 'man' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={selectedGender === 'man' ? 'white' : '#d1d5db'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Your interests</Text>
          <Text className="text-base text-gray-500 mb-6">
            Select a few of your interests and let everyone know what you're passionate about.
          </Text>

          <View className="flex-row flex-wrap">
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                onPress={() => toggleInterest(interest.id)}
                className={`rounded-full px-4 py-2 mb-3 mr-3 flex-row items-center ${selectedInterests.includes(interest.id)
                  ? 'bg-red-500'
                  : 'bg-white border border-gray-300'
                  }`}
              >
                <Ionicons
                  name={interest.icon as any}
                  size={18}
                  color={selectedInterests.includes(interest.id) ? 'white' : '#ef4444'}
                  style={{ marginRight: 8 }}
                />
                <Text className={`text-base ${selectedInterests.includes(interest.id) ? 'text-white' : 'text-red-500'
                  }`}>
                  {interest.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading}
          className={`py-4 rounded-lg mb-8 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
