
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const API_BASE_URL = 'https://lovelink-cjgx.onrender.com/api';

// Helper to get auth token (replace with your actual logic)
const getAuthToken = () => {
  // TODO: Replace with your actual auth token retrieval logic
  return 'your-jwt-token-here';
};


export default function Matches() {
  const [matches, setMatches] = useState<{ today: any[]; yesterday: any[] }>({ today: [], yesterday: [] });
  const [loading, setLoading] = useState(true);

  // Fetch matches from backend API
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assume response.data = { today: [...], yesterday: [...] }
        setMatches({
          today: response.data.today || [],
          yesterday: response.data.yesterday || [],
        });
      } catch (err) {
        setMatches({ today: [], yesterday: [] });
      }
      setLoading(false);
    };
    fetchMatches();
  }, []);

  // Like a user (API call)
  const handleLike = async (section: 'today' | 'yesterday', id: string) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_BASE_URL}/matches/like`,
        { targetId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(prev => ({
        ...prev,
        [section]: prev[section].map(match =>
          match.id === id ? { ...match, liked: true } : match
        ),
      }));
    } catch (err) {
      // Optionally show error
    }
  };

  // Unmatch/dislike (API call)
  const handleDislike = async (section: 'today' | 'yesterday', id: string) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${API_BASE_URL}/matches/unmatch`,
        { matchId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(prev => ({
        ...prev,
        [section]: prev[section].filter(match => match.id !== id),
      }));
    } catch (err) {
      // Optionally show error
    }
  };

  const MatchCard = ({ match, section }: { match: any; section: 'today' | 'yesterday' }) => (
    <View className="w-[48%] h-64 rounded-2xl overflow-hidden shadow-lg mb-4 mt-4">
      <View className="relative w-full h-full">
        <Image 
          source={{ uri: match.imageUrl || match.image }} 
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
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          />
          <View 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          />
          <View 
            className="absolute inset-0"
            style={{ borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : (
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
      )}
    </View>
  );
}
