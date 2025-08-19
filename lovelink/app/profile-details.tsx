import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useUserStorage } from '@/store/hooks/useAuthStore';
import * as ImagePicker from "expo-image-picker";
const parseDate = (date: any): Date | null => {
  if (!date) return null; // handles null, undefined, empty string
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed; // check if valid
};
export default function ProfileDetails() {
  const user = useUserStorage.getState().user;
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [birthDate, setBirthday] = useState<Date | null>(() => {
    const parsedDate = parseDate(user?.birthDate);
    return parsedDate || new Date();
  });
  console.log("data format", birthDate)
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [education, setEducation] = useState(user?.education || '');
  const [height, setHeight] = useState(user?.height);
  const [profilePicture, setProfilePicture] = useState<any>(
    user?.profilePicture ? { uri: user.profilePicture } : null
  );


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1995);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(11);
  const token = useAuthStore.getState().token
  const isSignUp = !token;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  useEffect(() => {
    if (birthDate) {
      setSelectedYear(birthDate.getFullYear());
      setSelectedMonth(birthDate.getMonth());
      setSelectedDay(birthDate.getDate());
    }
    // useAuthStore.getState().clearToken()
  }, [birthDate]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  // TODO: let ai reshape this to fit both complete profile and manual sign up 

  // by checking if the token is available

  // Updated validation
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
    if (!birthDate) {
      Alert.alert('Error', 'Please select your birthday');
      return false;
    }

    if (isSignUp) {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return false;
      }
      if (!email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email');
        return false;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }

    return true;
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
          className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-red-500' : ''
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

    useAuthStore.getState().setProfileData({
      fullName,
      birthDate,
      profilePicture,
      email,
      password,
      bio,
      profession,

    });

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    if (!birthDate) {
      Alert.alert('Error', 'Please select your birthday');
      return;
    }

    // Navigate to the existing profile setup page
    router.push('/profile-completion');
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
        <View className="items-center">
          <TouchableOpacity onPress={handleImagePick}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture.uri }}
                className="w-32 h-32 rounded-full border-2 border-gray-300"
              />
            ) : (
              <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center">
                <Ionicons name="camera" size={48} color="gray" />
              </View>
            )}
          </TouchableOpacity>

          <Text className="mt-2 text-gray-600 text-sm">Add Profile Picture</Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4 mb-8 flex-col gap-5">
          {/* First Name */}
          <View>
            <Text className="text-gray-600 text-sm mb-2">Full name</Text>
            <TextInput
              placeholder="David"
              value={fullName}
              onChangeText={setFullName}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
              autoCapitalize="words"
            />
          </View>
          {/* render if there's no token */}
          {
            !token && (
              <View>
                <Text className="text-gray-600 text-sm mb-2">Email</Text>
                <TextInput
                  placeholder="David"
                  value={email}
                  onChangeText={setEmail}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  autoCapitalize="words"
                />
                <Text className="text-gray-600 text-sm mb-2">Password</Text>
                <View className="flex-row items-center">
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>


                <Text className="text-gray-600 text-sm mb-2">Confirm Password</Text>
                <View className="flex-row items-center">
                  <TextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className=" flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
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

            )
          }
          <View>
            <Text className="text-gray-600 text-sm mb-2">Bio</Text>
            <TextInput
              placeholder="Tell us about yourself"
              value={bio}
              onChangeText={setBio}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
              multiline
            />
          </View>
          <View>
            <Text className="text-gray-600 text-sm mb-2">Profession</Text>
            <TextInput
              placeholder="Your profession"
              value={profession}
              onChangeText={setProfession}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg"
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
                {birthDate ? formatBirthday(birthDate) : 'Choose birthday date'}
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

            {/* Extra fields */}


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