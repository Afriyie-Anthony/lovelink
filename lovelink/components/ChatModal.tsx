import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  contact: {
    name: string;
    image: any;
    isOnline: boolean;
  };
}

export default function ChatModal({ visible, onClose, contact }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi Jake, how are you? I saw on the app that we've crossed paths several times this week 😊",
      time: '2:55 PM',
      isUser: false,
      isRead: true,
    },
    {
      id: 2,
      text: "Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕",
      time: '3:02 PM',
      isUser: true,
      isRead: true,
    },
    {
      id: 3,
      text: "Sure, let's do it! 😊",
      time: '3:10 PM',
      isUser: false,
      isRead: true,
    },
    {
      id: 4,
      text: "Great I will write later the exact time and place. See you soon!",
      time: '3:12 PM',
      isUser: true,
      isRead: true,
    },
  ]);

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

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
        isRead: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
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
            height: height * 0.85,
          }}
          {...panResponder.panHandlers}
        >
          <View className="items-center pt-4 pb-2">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image source={contact.image} className="w-full h-full" resizeMode="cover" />
              </View>
              <View>
                <Text className="font-semibold text-gray-800">{contact.name}</Text>
                <Text className="text-sm text-red-500">Online</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            {messages.map((msg) => (
              <View
                key={msg.id}
                className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}
              >
                <View
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.isUser
                      ? 'bg-white border border-gray-200'
                      : 'bg-pink-100'
                  }`}
                >
                  <Text className="text-gray-800">{msg.text}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
                  {msg.isUser && (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={msg.isRead ? '#ef4444' : '#9ca3af'}
                    />
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="flex-row items-center px-6 py-4 border-t border-gray-100">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
              placeholder="Your message"
              placeholderTextColor="#6b7280"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-2">
              <Ionicons name="time" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 bg-red-500 rounded-full items-center justify-center"
              onPress={sendMessage}
            >
              <Ionicons name="mic" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
