import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileDetails() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1995);
  const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)
  const [selectedDay, setSelectedDay] = useState(11);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => setSelectedDay(day)}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isSelected ? 'bg-red-500' : ''
          }`}
        >
          <Text className={`text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleSaveDate = () => {
    const newBirthday = new Date(selectedYear, selectedMonth, selectedDay);
    setBirthday(newBirthday);
    setShowDatePicker(false);
  };

  const handleContinue = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return;
    }
    if (!birthday) {
      Alert.alert('Error', 'Please select your birthday');
      return;
    }

    // Navigate to the existing profile setup page
    router.push('/profile-setup');
  };

  const handleSkip = () => {
    router.push('/profile-setup');
  };

  const formatBirthday = (date: Date) => {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center pt-12 pb-6">
          <Text className="text-2xl font-bold text-gray-800">Profile details</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-red-500 font-medium">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-gray-200 rounded-2xl items-center justify-center mb-2">
              <Ionicons name="person" size={48} color="gray" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-red-500 rounded-full items-center justify-center">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-4 mb-8 flex-col gap-5">
          {/* First Name */}
          <View>
            <Text className="text-gray-600 text-sm mb-2">First name</Text>
            <TextInput
              placeholder="David"
              value={firstName}
              onChangeText={setFirstName}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
              autoCapitalize="words"
            />
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-gray-600 text-sm mb-2">Last name</Text>
            <TextInput
              placeholder="Peterson"
              value={lastName}
              onChangeText={setLastName}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
              autoCapitalize="words"
            />
          </View>

          {/* Birthday */}
          <View >
            <Text className="text-gray-600 text-sm mb-2">Birthday</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-pink-100 border border-pink-200 rounded-lg px-4 py-3 flex-row items-center"
            >
              <Ionicons name="calendar" size={20} color="#ef4444" className="mr-3" />
              <Text className="text-red-500 text-lg flex-1">
                {birthday ? formatBirthday(birthday) : 'Choose birthday date'}
              </Text>
            </TouchableOpacity>
          </View>
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

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            {/* Handle */}
            <View className="w-12 h-12 bg-gray-300 rounded-full self-center mb-4" />
            
            <Text className="text-gray-500 text-sm mb-4 text-center font-bold">Birthday</Text>

            {/* Year and Month Selection */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear - 1)}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={24} color="#ef4444" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-2xl font-bold text-red-500">{selectedYear}</Text>
                <Text className="text-lg text-red-500">{months[selectedMonth]}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedYear(selectedYear + 1)}
                className="p-2"
              >
                <Ionicons name="chevron-forward" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Month Navigation */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                onPress={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={20} color="#ef4444" />
              </TouchableOpacity>

              <Text className="text-lg text-gray-600">{months[selectedMonth]}</Text>

              <TouchableOpacity
                onPress={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
                className="p-2"
              >
                <Ionicons name="chevron-forward" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap justify-center mb-6">
              {renderCalendar()}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveDate}
              className="bg-red-500 py-4 rounded-lg"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
