import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


type Activity = {
  id: number;
  name: string;
  image: any;
};

type MessageContact = {
  id: number;
  name: string;
  image: any;
  lastMessage: string;
  time: string;
  unread: number;
};

const activities: Activity[] = [
  { id: 1, name: 'You', image: require('../../assets/images/girl1.png') },
  { id: 2, name: 'Emma', image: require('../../assets/images/girl2.png') },
  { id: 3, name: 'Ava', image: require('../../assets/images/girl3.png') },
  { id: 4, name: 'Sophia', image: require('../../assets/images/girl1.png') },
];

const messages: MessageContact[] = [
  {
    id: 1,
    name: 'Emelie',
    image: require('../../assets/images/girl2.png'),
    lastMessage: 'Sticker 😊',
    time: '23 min ago',
    unread: 1,
  },
  {
    id: 2,
    name: 'Abigail',
    image: require('../../assets/images/girl3.png'),
    lastMessage: 'Typing..',
    time: '27 min ago',
    unread: 2,
  },
  {
    id: 3,
    name: 'Elizabeth',
    image: require('../../assets/images/girl1.png'),
    lastMessage: 'Ok, see you then.',
    time: '33 min ago',
    unread: 0,
  },
  {
    id: 4,
    name: 'Penelope',
    image: require('../../assets/images/girl2.png'),
    lastMessage: 'You: Hey! What\'s up, long time..',
    time: '50 min ago',
    unread: 0,
  },
  {
    id: 5,
    name: 'Chloe',
    image: require('../../assets/images/girl3.png'),
    lastMessage: 'You: Hello how are you?',
    time: '55 min ago',
    unread: 0,
  },
  {
    id: 6,
    name: 'Grace',
    image: require('../../assets/images/girl1.png'),
    lastMessage: 'You: Great I will write later',
    time: '1 hour ago',
    unread: 0,
  },
];

export default function Messages() {
  const [searchText, setSearchText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedContact, setSelectedContact] = useState<MessageContact | null>(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
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

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">Messages</Text>
        <TouchableOpacity className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm border border-gray-200">
          <Ionicons name="options" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search"
            placeholderTextColor="#6b7280"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Activities Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Activities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activities.map((activity) => (
              <View key={activity.id} className="items-center mr-4">
                <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500">
                  <Image source={activity.image} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="text-xs text-gray-600 mt-1">{activity.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Messages Section */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Messages</Text>
          {messages.map((message) => (
            <TouchableOpacity 
              key={message.id} 
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() => {
                setSelectedContact(message);
                setShowChat(true);
              }}
            >
              <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image source={message.image} className="w-full h-full" resizeMode="cover" />
              </View>
              
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-gray-800">{message.name}</Text>
                  <Text className="text-xs text-gray-500">{message.time}</Text>
                </View>
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                  {message.lastMessage}
                </Text>
              </View>
              
              {message.unread > 0 && (
                <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center ml-2">
                  <Text className="text-xs text-white font-semibold">{message.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Chat Modal */}
      {showChat && selectedContact && (
        <View className="absolute inset-0 bg-black/50">
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl" style={{ height: '85%' }}>
            {/* Handle */}
            <View className="items-center pt-4 pb-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Chat Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image source={selectedContact.image} className="w-full h-full" resizeMode="cover" />
                </View>
                <View>
                  <Text className="font-semibold text-gray-800">{selectedContact.name}</Text>
                  <Text className="text-sm text-red-500">Online</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView className="flex-1 px-6 py-4">
              {chatMessages.map((msg) => (
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

            {/* Message Input */}
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
              <TouchableOpacity className="w-10 h-10 bg-red-500 rounded-full items-center justify-center">
                <Ionicons name="mic" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
