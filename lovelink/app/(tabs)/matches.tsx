import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock matches data
const todayMatches = [
  {
    id: 1,
    name: 'Leilani',
    age: 19,
    image: require('../../assets/images/girl1.png'),
    liked: false,
  },
  {
    id: 2,
    name: 'Annabelle',
    age: 20,
    image: require('../../assets/images/girl2.png'),
    liked: false,
  },
];

const yesterdayMatches = [
  {
    id: 3,
    name: 'Reagan',
    age: 24,
    image: require('../../assets/images/girl3.png'),
    liked: false,
  },
  {
    id: 4,
    name: 'Hadley',
    age: 25,
    image: require('../../assets/images/image1.png'),
    liked: false,
  },
  {
    id: 5,
    name: 'Emma',
    age: 22,
    image: require('../../assets/images/image2.png'),
    liked: true,
  },
  {
    id: 6,
    name: 'Sophia',
    age: 21,
    image: require('../../assets/images/image3.png'),
    liked: true,
  },
];

export default function Matches() {
  const [matches, setMatches] = useState({
    today: todayMatches,
    yesterday: yesterdayMatches,
  });

  const handleLike = (section: 'today' | 'yesterday', id: number) => {
    setMatches(prev => ({
      ...prev,
      [section]: prev[section].map(match =>
        match.id === id ? { ...match, liked: true } : match
      ),
    }));
  };

  const handleDislike = (section: 'today' | 'yesterday', id: number) => {
    setMatches(prev => ({
      ...prev,
      [section]: prev[section].filter(match => match.id !== id),
    }));
  };

  const MatchCard = ({ match, section }: { match: any; section: 'today' | 'yesterday' }) => (
    <View className="w-[48%] h-64 rounded-2xl overflow-hidden shadow-lg mb-4 mt-4">
      <View className="relative w-full h-full">
        <Image 
          source={match.image} 
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Like indicator for yesterday matches */}
        {section === 'yesterday' && match.liked && (
          <View className="absolute top-3 right-3">
            <View className="w-8 h-8 bg-red-500 rounded-full items-center justify-center">
              <Ionicons name="heart" size={16} color="white" />
            </View>
          </View>
        )}
        
        {/* Dark glass morphism overlay at bottom */}
        <View className="absolute bottom-0 left-0 right-0">
          {/* Multiple layered backgrounds for glassmorphism effect */}
          <View 
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          />
          <View 
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
          <View 
            className="absolute inset-0"
            style={{
              borderTopWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          
          {/* Content overlay */}
          <View className="relative px-4 py-2">
            {/* Profile info */}
            <Text className="text-white text-lg font-semibold mb-1">
              {match.name}, {match.age}
            </Text>
            
            {/* Action buttons */}
            <View className="flex-row justify-center items-center gap-5">
              <TouchableOpacity
                onPress={() => handleDislike(section, match.id)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center border border-white/30"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleLike(section, match.id)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center border border-white/30"
              >
                <Ionicons name="heart" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-800">Matches</Text>
          <Text className="text-sm text-gray-500 mt-1">
            This is a list of people who have liked you and your matches.
          </Text>
        </View>
        
        <TouchableOpacity className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm border border-gray-200">
          <Ionicons name="swap-vertical" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Today Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4 px-2">Today</Text>
          <View className="flex-row justify-between">
            {matches.today.map((match) => (
              <MatchCard key={match.id} match={match} section="today" />
            ))}
          </View>
        </View>

        {/* Yesterday Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4 px-2">Yesterday</Text>
          <View className="flex-row justify-between flex-wrap">
            {matches.yesterday.map((match) => (
              <MatchCard key={match.id} match={match} section="yesterday" />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
