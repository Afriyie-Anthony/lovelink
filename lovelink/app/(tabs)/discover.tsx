import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions, PanResponder } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FilterModal from '../../components/FilterModal';


import { useDiscoverStore } from '@/store/hooks/useDiscoveryStore';
import { fetchProfiles } from '@/api/auth';

const { width } = Dimensions.get('window');

export default function Discover() {
  const store = useDiscoverStore();

  // If store isn't ready yet, render nothing or a loader
  if (!store) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </View>
    );
  }
  // or <Loading /> if you have a loading component

  const {
    profiles,
    currentProfileIndex,
    swipeDirection,
    setProfiles,
    setCurrentProfileIndex,
    setSwipeDirection,
    filters,
  } = store;


  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const panX = useRef(new Animated.Value(0)).current;

  const [showFilters, setShowFilters] = React.useState(false);

  // Fetch profiles once on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfiles(filters);

        if (!data || !Array.isArray(data.profiles)) {
          console.warn("⚠️ fetchProfiles returned invalid data:", data);
          return; // don't overwrite with []
        }

        setProfiles(data.profiles);
        setCurrentProfileIndex(0);
      } catch (err) {
        console.error("❌ Failed to fetch profiles:", err);
        // don't nuke profiles here either
      }
    })();
  }, [filters, setProfiles, setCurrentProfileIndex]);

  const currentProfile = profiles[currentProfileIndex] || null;
  console.log("CurrentProfiles", currentProfile)
  console.log("Profiles length:", profiles.length, "Index:", currentProfileIndex);

  const handleNext = useCallback(() => {
    if (profiles.length === 0) return; // ⬅ guard

    setSwipeDirection('right');
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: width, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 0.8, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length); // next
      // previous



      setSwipeDirection(null);
      slideAnim.setValue(width);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    });
  }, [profiles.length, setCurrentProfileIndex, setSwipeDirection, slideAnim, fadeAnim, scaleAnim]);

  const handlePrevious = useCallback(() => {
    if (profiles.length === 0) return; // ⬅ guard

    setSwipeDirection('left');
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: -width, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 0.8, tension: 40, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      setCurrentProfileIndex((prev) => (prev - 1 + profiles.length) % profiles.length);

      setSwipeDirection(null);
      slideAnim.setValue(-width);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    });
  }, [profiles.length, setCurrentProfileIndex, setSwipeDirection, slideAnim, fadeAnim, scaleAnim]);


  const panResponder = useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10,
      onPanResponderGrant: () => {
        panX.setOffset((panX as any)._value);
      },
      onPanResponderMove: (_, gestureState) => {
        panX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        panX.flattenOffset();
        if (Math.abs(gestureState.dx) > 120) {
          const direction = gestureState.dx > 0 ? 1 : -1;
          Animated.timing(panX, {
            toValue: direction * width, // fly out
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            // after it flies out, reset position & move to next profile
            panX.setValue(0);
            direction > 0 ? handleNext() : handlePrevious();
          });
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },

    }), [handleNext, handlePrevious, panX]);

  // Reset animation on profile change
  useEffect(() => {
    panX.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, [currentProfileIndex, slideAnim, fadeAnim, scaleAnim, panX]);

  const handleLike = () => handleNext();
  const handleDislike = () => handlePrevious();
  const handleSuperLike = () => {
    if (currentProfile && currentProfile.fullName) {
      console.log('Super like:', currentProfile.fullName);
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
        <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => setShowFilters(true)}>
          <Ionicons name="options" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View className="flex-1 px-4 pt-2">
        <Animated.View
          className="flex-1 relative"
          style={{
            transform: [
              { translateX: panX },
              { scale: scaleAnim }
            ],
            opacity: fadeAnim,
          }}
          {...panResponder.panHandlers}
        >
          {currentProfile?.profilePicture ? (
            <Image
              source={{ uri: currentProfile?.profilePicture }}
              style={{ width: '100%', height: '100%', backgroundColor: 'lightgray' }}
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-200">
              <Text className="text-gray-500">No profile picture</Text>
            </View>
          )}
        </Animated.View>

      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center items-center py-8 px-4">
        <View className="flex-row items-center gap-12">
          <TouchableOpacity onPress={handleDislike} className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200">
            <Ionicons name="close" size={28} color="#f97316" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} className="w-18 h-18 bg-white rounded-full items-center justify-center shadow-xl border border-gray-200" style={{ width: 72, height: 72 }}>
            <Ionicons name="heart" size={32} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSuperLike} className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200">
            <Ionicons name="star" size={28} color="#a855f7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => setShowFilters(false)}
      />
    </View>
  );
}
