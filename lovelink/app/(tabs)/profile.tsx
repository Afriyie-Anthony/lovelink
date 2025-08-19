import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useUserStorage } from '@/store/hooks/useAuthStore';
import { router } from 'expo-router';
import { getUser } from '@/api/auth';
import { ProfileData } from '@/store/types/Auth';



// Mock user data


export default function Profile() {
  const token = useAuthStore.getState().token
  
  useEffect(() => {
   
    const fetchUserProfile = async () => {
      try {
        const userId = useAuthStore.getState().user?.id
        console.log("Log User id", userId)
        const data = await getUser(userId || "id")
        // console.log(data)
        //  useUserStorage.getState().setUser(data.user)

      } catch (error) {
        console.error(error)
        Alert.alert("Error , Failed to retriever user data")
      }
    }
    fetchUserProfile()
  }, [token])
  //  hit api to get user data
const user = useUserStorage.getState().user 
console.log("user",user)

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    profileVisibility: true,
    autoMatch: false,
  });

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would open here');
  };

  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Photo picker would open here');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen would open here');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help center would open here');
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout', style: 'destructive', onPress: () => {
            console.log('Logout')

            router.replace('/(auth)/login')
          }
        },
      ]
    );
  };

  console.log("profile data:", useUserStorage.getState().user)
  const handleCompleteProfile = () => {

    router.push('/profile-details')
  }

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3 px-4">{title}</Text>
      {children}
    </View>
  );
  const userProfile = {
    name: user?.fullName || 'Jake Anderson',
    age: user?.age || 25,
    location: user?.locate || 'Chicago, IL',
    bio: user?.bio||'Adventure seeker and coffee enthusiast. Looking for someone to share life\'s beautiful moments with. ☕️✨',
    photos: [
      { uri: user?.profilePicture },
      // require('../../assets/images/girl2.png'),
      // require('../../assets/images/girl3.png'),
      // require('../../assets/images/image1.png'),
    ],
    interests:user?.interests || ['Travel', 'Photography', 'Coffee', 'Hiking', 'Music', 'Cooking'],
    profession: user?.profession || 'Software Engineer',
    education: user?.education || 'University of Illinois',
    height: user?.height || '6\'0"',
    zodiac: 'Libra',
    lookingFor: 'Long-term relationship',
    distance: '25 miles',
  };
  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
    showSwitch = false,
    onPress
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: () => void;
    showSwitch?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100"
      onPress={onPress}
      disabled={showSwitch}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
          <Ionicons name={icon as any} size={20} color="#ef4444" />
        </View>
        <View className="flex-1">
          <Text className="font-medium text-gray-800">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#e5e7eb', true: '#ef4444' }}
          thumbColor={value ? '#ffffff' : '#ffffff'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Ionicons name="create" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Photos */}
        <ProfileSection title="Photos">
          <View className="px-4">
            <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <Image
                source={userProfile.photos[selectedPhotoIndex]}
                className="w-full h-80"
                resizeMode="cover"
              />

              {/* Photo indicators */}
              <View className="absolute bottom-4 left-0 right-0">
                <View className="flex-row justify-center space-x-2">
                  {userProfile.photos.map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === selectedPhotoIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                    />
                  ))}
                </View>
              </View>

              {/* Photo navigation */}
              <View className="absolute inset-0 flex-row justify-between items-center px-4">
                <TouchableOpacity
                  onPress={() => setSelectedPhotoIndex(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                >
                  <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedPhotoIndex(prev => Math.min(userProfile.photos.length - 1, prev + 1))}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                >
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Photo grid */}
            <View className="flex-row mt-3 space-x-2">
              {userProfile.photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPhotoIndex(index)}
                  className={`flex-1 h-16 rounded-lg overflow-hidden border-2 ${index === selectedPhotoIndex ? 'border-red-500' : 'border-gray-200'
                    }`}
                >
                  <Image source={photo} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleAddPhoto}
                className="flex-1 h-16 rounded-lg border-2 border-dashed border-gray-300 items-center justify-center"
              >
                <Ionicons name="add" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </ProfileSection>

        {/* Basic Info */}
        <ProfileSection title="Basic Information">
          <View className="bg-white rounded-2xl mx-4 shadow-sm">
            <View className="px-4 py-4 border-b border-gray-100">
              <Text className="text-2xl font-bold text-gray-800">{userProfile.name}, {userProfile.age}</Text>
              <Text className="text-gray-500 mt-1">{userProfile.profession}</Text>
            </View>

            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="text-gray-800">{userProfile.bio}</Text>
            </View>

            <View className="px-4 py-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Location</Text>
                <Text className="text-gray-800">{userProfile.location}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Education</Text>
                <Text className="text-gray-800">{userProfile.education}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600">Height</Text>
                <Text className="text-gray-800">{userProfile.height}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Zodiac</Text>
                <Text className="text-gray-800">{userProfile.zodiac}</Text>
              </View>
            </View>
          </View>
        </ProfileSection>

        {/* Interests */}
        <ProfileSection title="Interests">
          <View className="px-4">
            <View className="flex-row flex-wrap">
              {userProfile.interests.map((interest, index) => (
                <View key={index} className="bg-red-100 rounded-full px-4 py-2 mr-2 mb-2">
                  <Text className="text-red-600 font-medium">{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection title="Preferences">
          <View className="bg-white rounded-2xl mx-4 shadow-sm">
            <View className="px-4 py-3 border-b border-gray-100">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Looking for</Text>
                <Text className="text-gray-800">{userProfile.lookingFor}</Text>
              </View>
            </View>
            <View className="px-4 py-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Distance</Text>
                <Text className="text-gray-800">{userProfile.distance}</Text>
              </View>
            </View>
          </View>
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Settings">
          <View className="bg-white rounded-2xl mx-4 shadow-sm">
            <SettingItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Get notified about new matches and messages"
              value={settings.notifications}
              onToggle={() => handleSettingToggle('notifications')}
              showSwitch={true}
            />
            <SettingItem
              icon="location"
              title="Location Sharing"
              subtitle="Share your location for better matches"
              value={settings.locationSharing}
              onToggle={() => handleSettingToggle('locationSharing')}
              showSwitch={true}
            />
            <SettingItem
              icon="eye"
              title="Profile Visibility"
              subtitle="Make your profile visible to others"
              value={settings.profileVisibility}
              onToggle={() => handleSettingToggle('profileVisibility')}
              showSwitch={true}
            />
            <SettingItem
              icon="flash"
              title="Auto Match"
              subtitle="Automatically like profiles you might be interested in"
              value={settings.autoMatch}
              onToggle={() => handleSettingToggle('autoMatch')}
              showSwitch={true}
            />
          </View>
        </ProfileSection>

        {/* Account */}
        <ProfileSection title="Account">
          <View className="bg-white rounded-2xl mx-4 shadow-sm">
            <SettingItem
              icon="settings"
              title="Settings"
              subtitle="Manage your account settings"
              onPress={handleSettings}
            />
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={handleHelp}
            />
            <SettingItem
              icon="person"
              title="Complete Profile"
              subtitle="Complete your profile"
              onPress={handleCompleteProfile}
            />
            <SettingItem
              icon="log-out"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
            />
          </View>
        </ProfileSection>

        {/* App Info */}
        <View className="px-4 py-6">
          <Text className="text-center text-gray-400 text-sm">LoveLink v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}