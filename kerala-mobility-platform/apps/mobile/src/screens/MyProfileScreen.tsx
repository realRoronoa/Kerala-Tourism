import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { apiFetch } from '../api/client';

interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  mobile_number: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
}

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<UserProfile>('/api/v1/auth/me')
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?';

  const displayName = profile?.full_name || profile?.email || 'Traveler';
  const displayPhone = profile?.mobile_number || 'Not set';
  const displayEmail = profile?.email || '—';
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

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
        {loading ? (
          <View className="bg-white rounded-3xl p-10 items-center shadow-sm mb-6">
            <ActivityIndicator color="#0B6E4F" size="large" />
            <Text className="font-inter text-sm text-gray-400 mt-3">Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* Profile Card */}
            <View className="bg-white rounded-3xl p-6 items-center shadow-sm mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 }}>
              <View className="w-24 h-24 rounded-full bg-kerala-green items-center justify-center mb-4 relative border-4 border-white shadow-sm">
                <Text className="font-inter-bold text-3xl text-white">{initials}</Text>
                {profile?.is_active && (
                  <View className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full items-center justify-center border-2 border-white">
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text className="font-inter-bold text-2xl text-gray-900">{displayName}</Text>
              <Text className="font-inter-medium text-gray-500 mt-1 mb-3">{displayPhone}</Text>
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
                    <Text className="font-inter-semibold text-sm text-gray-900">{displayEmail}</Text>
                  </View>
                </View>
              </View>

              <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center bg-white">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
                    <Feather name="phone" size={16} color="#4B5563" />
                  </View>
                  <View>
                    <Text className="font-inter-medium text-xs text-gray-500 mb-0.5">Mobile Number</Text>
                    <Text className="font-inter-semibold text-sm text-gray-900">{displayPhone}</Text>
                  </View>
                </View>
              </View>

              <View className="px-5 py-4 flex-row justify-between items-center bg-white">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
                    <Feather name="calendar" size={16} color="#4B5563" />
                  </View>
                  <View>
                    <Text className="font-inter-medium text-xs text-gray-500 mb-0.5">Member Since</Text>
                    <Text className="font-inter-semibold text-sm text-gray-900">{joinedDate}</Text>
                  </View>
                </View>
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
                onPress={() => (navigation as any).navigate('Profile')}
              >
                <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
                  <Feather name="shield" size={16} color="#4B5563" />
                </View>
                <Text className="font-inter-semibold text-sm text-gray-800 flex-1">Privacy Center</Text>
                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
