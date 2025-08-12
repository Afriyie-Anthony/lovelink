

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions, PanResponder } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import FilterModal from '../../components/FilterModal';

const { width } = Dimensions.get('window');

export default function Discover() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const panX = useRef(new Animated.Value(0)).current;

  // Default discover filters
  const discoverFilters = {
    lat: 40.7128,
    lng: -74.0060,
    maxDistanceKm: 50,
    minAge: 25,
    maxAge: 35,
    profession: 'Engineer',
    limit: 20,
    page: 1,
  };

  // Fetch profiles from backend API using axios
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const params = new URLSearchParams(discoverFilters as any).toString();
        const response = await axios.get(`https://lovelink-cjgx.onrender.com/api/discover?${params}`);
        const data = response.data;
        setProfiles((data.profiles || data) as any[]);
        setCurrentProfileIndex(0);
      } catch (err) {
        setProfiles([]);
      }
    };
    fetchProfiles();
  }, []);

  const currentProfile = profiles[currentProfileIndex] || {};

  const handleNext = useCallback(() => {
    setSwipeDirection('right');
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: width,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setSwipeDirection(null);
      slideAnim.setValue(width);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [slideAnim, fadeAnim, scaleAnim, profiles.length]);

  const handlePrevious = useCallback(() => {
    setSwipeDirection('left');
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -width,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentProfileIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
      setSwipeDirection(null);
      slideAnim.setValue(-width);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [slideAnim, fadeAnim, scaleAnim, profiles.length]);

  const panResponder = useMemo(() => 
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        panX.setOffset((panX as any)._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        panX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        panX.flattenOffset();
        if (Math.abs(gestureState.dx) > 50) {
          if (gestureState.dx > 0) {
            handleNext();
          } else {
            handlePrevious();
          }
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }), [handleNext, handlePrevious, panX]);

  useEffect(() => {
    panX.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentProfileIndex, slideAnim, fadeAnim, scaleAnim, panX]);

  const handleLike = () => handleNext();
  const handleDislike = () => handlePrevious();
  const handleSuperLike = () => {
    if (currentProfile && currentProfile.name) {
      console.log('Super like:', currentProfile.name);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#ef4444" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-800">Discover</Text>
          <Text className="text-sm text-gray-500">Chicago, IL</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center"
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {/* Profile Card */}
      <View className="flex-1 px-4 pt-2">
        <Animated.View 
          className="flex-1 relative"
          style={{
            transform: [
              { translateX: Animated.add(slideAnim, panX) },
              { scale: scaleAnim }
            ],
            opacity: fadeAnim
          }}
          {...panResponder.panHandlers}
        >
          <View 
            className={`flex-1 bg-white rounded-3xl overflow-hidden shadow-2xl ${
              swipeDirection === 'left' ? 'transform rotate-12 translate-x-20' :
              swipeDirection === 'right' ? 'transform -rotate-12 -translate-x-20' : ''
            }`}
          >
            {/* Full Screen Profile Image */}
            <View className="flex-1 relative">
              <Image 
                source={currentProfile.image} 
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Distance Tag */}
              <View className="absolute top-6 left-6 bg-black/70 rounded-full px-3 py-2 flex-row items-center">
                <Ionicons name="location" size={14} color="white" />
                <Text className="text-white text-sm font-medium ml-1">{currentProfile.distance}</Text>
              </View>
              {/* Photo Indicator Dots */}
              <View className="absolute top-6 right-6">
                <View className="space-y-2">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <View
                      key={dot}
                      className={`w-2 h-2 rounded-full ${
                        dot === 1 ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </View>
              </View>
              {/* Profile Info Overlay - Bottom */}
              <View className="absolute bottom-0 left-0 right-0">
                <View className="rounded-t-2xl overflow-hidden">
                  <View 
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                  />
                  <View 
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: 'rgba(167, 167, 167, 0.3)' }}
                  />
                  <View 
                    className="absolute inset-0 rounded-2xl"
                    style={{ borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.43)' }}
                  />
                  <View 
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <View 
                    className="px-6 py-5 relative"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                  >
                    <Text 
                      className="text-white text-2xl font-bold mb-1"
                      style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                      }}
                    >
                      {currentProfile.name}, {currentProfile.age}
                    </Text>
                    <Text 
                      className="text-white/95 text-base"
                      style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      {currentProfile.profession}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Swipe Action Overlay */}
              {swipeDirection && (
                <View className="absolute inset-0 items-center justify-center bg-black/20">
                  <Animated.View 
                    className={`w-24 h-24 rounded-full items-center justify-center ${
                      swipeDirection === 'right' ? 'bg-red-500' : 
                      swipeDirection === 'left' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}
                    style={{ transform: [{ scale: fadeAnim }] }}
                  >
                    <Ionicons 
                      name={
                        swipeDirection === 'right' ? 'heart' : 
                        swipeDirection === 'left' ? 'close' : 'help'
                      } 
                      size={44} 
                      color="white" 
                    />
                  </Animated.View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
        {/* Action Buttons */}
        <View className="flex-row justify-center items-center py-8 px-4">
          <View className="flex-row items-center gap-12">
            <TouchableOpacity
              onPress={handleDislike}
              className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
              style={{ elevation: 4 }}
            >
              <Ionicons name="close" size={28} color="#f97316" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLike}
              className="w-18 h-18 bg-white rounded-full items-center justify-center shadow-xl border border-gray-200"
              style={{ elevation: 6, width: 72, height: 72 }}
            >
              <Ionicons name="heart" size={32} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSuperLike}
              className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
              style={{ elevation: 4 }}
            >
              <Ionicons name="star" size={28} color="#a855f7" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => {
          setShowFilters(false);
        }}
      />
    </View>
  );
}