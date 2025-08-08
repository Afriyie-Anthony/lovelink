import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState({
    interestedIn: 'girls',
    location: 'Chicago, USA',
    distance: 40,
    ageRange: [20, 28],
  });

  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 0 && gestureState.dy > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleClear = () => {
    setFilters({
      interestedIn: 'girls',
      location: 'Chicago, USA',
      distance: 40,
      ageRange: [20, 28],
    });
  };

  const handleContinue = () => {
    onApply(filters);
    onClose();
  };

  const handleDistanceChange = (event: any) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 48; // Account for padding
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newDistance = Math.round(percentage * 100);
    setFilters({ ...filters, distance: newDistance });
  };

  const handleAgeChange = (event: any, isMin: boolean) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 48;
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newAge = Math.round(18 + percentage * (65 - 18));
    
    if (isMin) {
      setFilters({
        ...filters,
        ageRange: [newAge, Math.max(newAge, filters.ageRange[1])],
      });
    } else {
      setFilters({
        ...filters,
        ageRange: [Math.min(filters.ageRange[0], newAge), newAge],
      });
    }
  };

  const handleDistanceSliderPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 48;
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newDistance = Math.round(percentage * 100);
    setFilters({ ...filters, distance: newDistance });
  };

  const handleAgeSliderPress = (event: any, isMin: boolean) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = width - 48;
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newAge = Math.round(18 + percentage * (65 - 18));
    
    if (isMin) {
      setFilters({
        ...filters,
        ageRange: [newAge, Math.max(newAge, filters.ageRange[1])],
      });
    } else {
      setFilters({
        ...filters,
        ageRange: [Math.min(filters.ageRange[0], newAge), newAge],
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Animated.View
          className="absolute inset-0 bg-black/50"
          style={{ opacity: backdropAnim }}
        >
          <TouchableOpacity
            className="flex-1"
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
          style={{
            transform: [{ translateY: slideAnim }],
            minHeight: height * 0.7,
          }}
          {...panResponder.panHandlers}
        >
          <View className="items-center pt-4 pb-8">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          <View className="flex-row justify-between items-center px-6 pb-8">
            <Text className="text-3xl font-bold text-gray-800">Filters</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text className="text-red-500 font-medium">Clear</Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-8 flex-col gap-10">
            <View>
              <Text className="text-gray-800 font-bold mb-3">Interested in</Text>
              <View className="flex-row bg-gray-100 rounded-lg">
                {(['girls', 'boys', 'both'] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`flex-1 py-5 px-4 rounded-r-md ${
                      filters.interestedIn === option ? 'bg-red-500' : 'bg-transparent'
                    }`}
                    onPress={() => setFilters({ ...filters, interestedIn: option })}
                  >
                    <Text
                      className={`text-center font-medium capitalize ${
                        filters.interestedIn === option ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm mb-2">Location</Text>
              <TouchableOpacity className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-row justify-between items-center">
                <Text className="text-gray-800 flex-1">{filters.location}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 font-medium">Distance</Text>
                <Text className="text-gray-800">{filters.distance}km</Text>
              </View>
              <TouchableOpacity
                className="h-2 bg-gray-200 rounded-full relative"
                onPress={handleDistanceSliderPress}
                activeOpacity={1}
              >
                <View 
                  className="h-full bg-red-500 rounded-full absolute"
                  style={{ width: `${filters.distance}%` }}
                />
                <View 
                  className="absolute w-5 h-5 bg-red-500 rounded-full -top-1.5"
                  style={{ left: `${filters.distance}%`, marginLeft: -12 }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 font-medium">Age</Text>
                <Text className="text-gray-800">
                  {filters.ageRange[0]}-{filters.ageRange[1]}
                </Text>
              </View>
              <TouchableOpacity
                className="h-2 bg-gray-200 rounded-full relative"
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const sliderWidth = width - 48;
                  const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
                  const newAge = Math.round(18 + percentage * (65 - 18));
                  
                  // Determine which thumb is closer and update accordingly
                  const minDistance = Math.abs(newAge - filters.ageRange[0]);
                  const maxDistance = Math.abs(newAge - filters.ageRange[1]);
                  
                  if (minDistance < maxDistance) {
                    setFilters({
                      ...filters,
                      ageRange: [newAge, Math.max(newAge, filters.ageRange[1])],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      ageRange: [Math.min(filters.ageRange[0], newAge), newAge],
                    });
                  }
                }}
                activeOpacity={1}
              >
                <View 
                  className="h-full bg-red-500 rounded-full absolute"
                  style={{ 
                    left: `${((filters.ageRange[0] - 18) / (65 - 18)) * 100}%`,
                    right: `${100 - ((filters.ageRange[1] - 18) / (65 - 18)) * 100}%`
                  }}
                />
                <TouchableOpacity
                  className="absolute w-5 h-5 bg-red-500 rounded-full -top-1.5"
                  style={{ 
                    left: `${((filters.ageRange[0] - 18) / (65 - 18)) * 100}%`,
                    marginLeft: -12
                  }}
                  onPress={(e) => handleAgeSliderPress(e, true)}
                />
                <TouchableOpacity
                  className="absolute w-5 h-5 bg-red-500 rounded-full -top-1.5"
                  style={{ 
                    left: `${((filters.ageRange[1] - 18) / (65 - 18)) * 100}%`,
                    marginLeft: -12
                  }}
                  onPress={(e) => handleAgeSliderPress(e, false)}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6 pb-8">
            <TouchableOpacity
              className="bg-red-500 rounded-lg py-4 items-center"
              onPress={handleContinue}
            >
              <Text className="text-white font-semibold text-lg">Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
