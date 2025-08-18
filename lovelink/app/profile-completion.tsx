import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/hooks/useAuthStore';

export default function ProfileCompletion() {
    const [age, setAge] = useState<number | undefined>(20);
    const [phoneNumber, setPhoneNumber] = useState('00000000');
    const [education, setEducation] = useState('AAMUTED');
    const [height, setHeight] = useState<string>('5.7');
    const [locate, setLocation] = useState('KUMASI');

    const validateForm = () => {
        if (!age || age < 10) {
            Alert.alert('Error', 'Please enter a valid age');
            return false;
        }
        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return false;
        }
        if (!education.trim()) {
            Alert.alert('Error', 'Please enter your education');
            return false;
        }
        if (!height ) {
            Alert.alert('Error', 'Please enter a valid height');
            return false;
        }
        if (!locate.trim()) {
            Alert.alert('Error', 'Please enter your location');
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        if (!validateForm()) return;

        useAuthStore.getState().setProfileData({
            age,
            phoneNumber,
            education,
            height: height ? parseFloat(height) : undefined,
            locate,
        });

        router.push('/profile-setup');
    };

    return (
        <View className="flex-1 bg-white mt-10">
            <ScrollView className="flex-1 px-6">
                
                <View className="flex-row justify-between items-center pt-12 pb-6">
                     <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#ef4444" />
                              </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-800">Complete Profile</Text>
                    
                    <TouchableOpacity onPress={() => router.push('/profile-setup')}>
                        <Text className="text-red-500 font-medium">Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Age */}
                <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Age</Text>
                    <TextInput
                        placeholder="e.g. 25"
                        keyboardType="numeric"
                        value={age?.toString() || ''}
                        onChangeText={(text) => {
                            const parsed = parseInt(text, 10);
                            setAge(isNaN(parsed) ? undefined : parsed);
                        }}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Phone Number</Text>
                    <TextInput
                        placeholder="e.g. +1 234 567 890"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    />
                </View>

                {/* Education */}
                <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Education</Text>
                    <TextInput
                        placeholder="Your education"
                        value={education}
                        onChangeText={setEducation}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    />
                </View>

                {/* Height */}
                <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Height (ft/in or cm)</Text>
                    <TextInput
                        placeholder="e.g. 6.7"
                        keyboardType="decimal-pad" // allows decimal input on mobile
                        value={height?.toString() || ''}
                        onChangeText={(text) => {
                            // Allow empty input or decimal numbers
                            if (text === '' || /^(\d+(\.\d*)?)?$/.test(text)) {
                                setHeight(text); // keep it as string
                            }
                        }}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    />
                </View>
                {/* Location */}
                <View className="mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Location</Text>
                    <TextInput
                        placeholder="Your location"
                        value={locate}
                        onChangeText={setLocation}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    />
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-red-500 py-4 rounded-lg mb-8"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Confirm
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
