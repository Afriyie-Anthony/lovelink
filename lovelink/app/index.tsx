import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const heartAnim1 = useRef(new Animated.Value(0)).current;
  const heartAnim2 = useRef(new Animated.Value(0)).current;
  const starAnim1 = useRef(new Animated.Value(0)).current;
  const starAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(200, [
      Animated.timing(heartAnim1, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(starAnim1, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(heartAnim2, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(starAnim2, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/get-started');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Animated.View style={{ position: 'absolute', top: height * 0.2, left: width * 0.1, opacity: heartAnim1, transform: [{ scale: heartAnim1 }] }}>
        <Ionicons name="heart" size={40} color="rgba(236, 72, 153, 0.3)" />
      </Animated.View>

      <Animated.View style={{ position: 'absolute', top: height * 0.15, right: width * 0.15, opacity: starAnim1, transform: [{ scale: starAnim1 }] }}>
        <Ionicons name="star" size={35} color="rgba(168, 85, 247, 0.3)" />
      </Animated.View>

      <Animated.View style={{ position: 'absolute', bottom: height * 0.25, left: width * 0.15, opacity: heartAnim2, transform: [{ scale: heartAnim2 }] }}>
        <Ionicons name="heart" size={30} color="rgba(236, 72, 153, 0.3)" />
      </Animated.View>

      <Animated.View style={{ position: 'absolute', bottom: height * 0.3, right: width * 0.1, opacity: starAnim2, transform: [{ scale: starAnim2 }] }}>
        <Ionicons name="star" size={45} color="rgba(188, 119, 253, 0.3)" />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }} className="items-center">
        <View className="w-36 h-36 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full items-center justify-center mb-6 shadow-lg">
          <Image source={require('../assets/images/logo.png')} className="w-36 h-36 rounded-full" />
        </View>

        <Text className="text-4xl font-bold text-gray-800 mb-2">LoveLink</Text>
        
        <Text className="text-lg text-gray-600 text-center px-8">Connect hearts, find love</Text>
      </Animated.View>
    </View>
  );
}
