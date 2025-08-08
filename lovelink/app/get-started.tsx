import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Animated, Image } from 'react-native';
import { router } from 'expo-router';
//import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const getStartedData = [
  {
    id: 1,
    title: 'Algorithm',
    description: 'Users going through a vetting process to ensure you never match with bots.',
    image: require('../assets/images/girl1.png'),
  },
  {
    id: 2,
    title: 'Matches',
    description: 'We match you with people that have a large array of similar interests.',
    image: require('../assets/images/girl2.png'),
  },
  {
    id: 3,
    title: 'Premium',
    description: 'Sign up today and enjoy the first month of premium benefits on us.',
    image: require('../assets/images/girl3.png'),
  },
];

export default function GetStarted() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentIndex < getStartedData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      router.replace('/(auth)/signup-options');
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: 'white' }}>
      {/* Header with skip button */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4">
        <View />
        <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
          <Text className="text-gray-600 font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {getStartedData.map((item, index) => (
          <View key={item.id} style={{ width }} className="flex-1 px-6">
            <View className="flex-1 justify-center">
              {/* Portrait Image */}
              <View className="items-center mb-8">
                <Image 
                  source={item.image} 
                  className="w-80 h-96 rounded-2xl"
                  resizeMode="cover"
                />
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-red-500 text-center mb-4">
                {item.title}
              </Text>

              {/* Description */}
              <Text className="text-lg text-gray-600 text-center leading-7 px-4 mb-8">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View className="px-6 pb-8">
        {/* Pagination dots */}
        <View className="flex-row justify-center mb-6">
          {getStartedData.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-red-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Create Account button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-red-500 py-4 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create an account
          </Text>
        </TouchableOpacity>

        {/* Sign In link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-red-500 font-medium">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
