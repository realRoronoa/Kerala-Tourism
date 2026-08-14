import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MyProfileScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Top Green Banner */}
      <View className="bg-kerala-green pt-4 pb-16 px-4 rounded-b-[40px]">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="font-inter-bold text-xl text-white flex-1">Profile</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} style={{ marginTop: -50 }}>
        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 items-center shadow-sm mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 }}>
          <View className="w-24 h-24 rounded-full bg-kerala-green items-center justify-center mb-4 relative border-4 border-white shadow-sm">
            <Text className="font-inter-bold text-3xl text-white">A</Text>
            <View className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full items-center justify-center border-2 border-white">
              <Feather name="check" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text className="font-inter-bold text-2xl text-gray-900">Adarsh</Text>
          <Text className="font-inter-medium text-gray-500 mt-1 mb-3">+91 98765 43210</Text>
          <View className="bg-green-50 px-4 py-2 rounded-full flex-row items-center border border-green-100">
            <Feather name="shield" size={14} color="#0B6E4F" />
            <Text className="font-inter-semibold text-xs text-kerala-green ml-1.5">Verified Citizen</Text>
          </View>
        </View>

        <Text className="font-inter-semibold text-sm text-gray-500 mb-2 ml-2 uppercase tracking-wider">Personal Info</Text>
        
        {/* Info Group */}
        <View className="bg-white rounded-2xl mb-6 overflow-hidden shadow-sm border border-gray-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 }}>
          <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center bg-white">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
                <Feather name="mail" size={16} color="#4B5563" />
              </View>
              <View>
                <Text className="font-inter-medium text-xs text-gray-500 mb-0.5">Email Address</Text>
                <Text className="font-inter-semibold text-sm text-gray-900">adarsh@example.com</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-gray-50 px-3 py-1.5 rounded-full">
              <Text className="font-inter-semibold text-kerala-green text-xs">Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View className="px-5 py-4 flex-row justify-between items-center bg-white">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
                <Feather name="calendar" size={16} color="#4B5563" />
              </View>
              <View>
                <Text className="font-inter-medium text-xs text-gray-500 mb-0.5">Date of Birth</Text>
                <Text className="font-inter-semibold text-sm text-gray-900">15 Aug 1995</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-gray-50 px-3 py-1.5 rounded-full">
              <Text className="font-inter-semibold text-kerala-green text-xs">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="font-inter-semibold text-sm text-gray-500 mb-2 ml-2 uppercase tracking-wider">Settings</Text>

        {/* Action Group */}
        <View className="bg-white rounded-2xl mb-8 overflow-hidden shadow-sm border border-gray-100" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 }}>
          <TouchableOpacity className="flex-row items-center px-5 py-4 border-b border-gray-100 bg-white" activeOpacity={0.7}>
            <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Feather name="map-pin" size={16} color="#2563EB" />
            </View>
            <Text className="font-inter-semibold text-sm text-gray-800 flex-1">Saved Addresses</Text>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center px-5 py-4 bg-white"
            activeOpacity={0.7}
            onPress={() => (navigation as any).navigate('Profile')} // Navigates to Privacy Center
          >
            <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
              <Feather name="shield" size={16} color="#4B5563" />
            </View>
            <Text className="font-inter-semibold text-sm text-gray-800 flex-1">Privacy Center</Text>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
