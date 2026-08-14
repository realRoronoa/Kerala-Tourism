import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';

/* ── Data for transparency columns ── */
const WE_COLLECT = [
  { icon: 'search' as const, text: 'Anonymized route searches' },
  { icon: 'map-pin' as const, text: 'General device location (when enabled)' },
  { icon: 'bar-chart-2' as const, text: 'Basic usage metrics for app stability' },
];

const NATPAC_RECEIVES = [
  { icon: 'layers' as const, text: 'Aggregated boarding/alighting data' },
  { icon: 'shield-off' as const, text: 'No personal identification (PII)' },
  { icon: 'x-circle' as const, text: 'No exact start/end addresses' },
];

const ACCOUNT_ACTIONS = [
  { icon: 'pause-circle' as const, label: 'Pause Tracking', color: '#374151', hasArrow: true },
  { icon: 'trash-2' as const, label: 'Delete Trip History', color: '#8B4513', hasArrow: false },
  { icon: 'alert-triangle' as const, label: 'Delete Account', color: '#8B4513', hasArrow: false },
  { icon: 'settings' as const, label: 'Manage Permissions (OS Settings)', color: '#374151', hasArrow: true },
  { icon: 'file-text' as const, label: 'View Privacy Policy', color: '#374151', hasArrow: true },
];

export default function ProfileScreen() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header showSearch={false} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <View className="px-5 pt-5 pb-1">
          <Text className="font-inter-bold text-[26px] text-gray-900">
            Privacy Center
          </Text>
          <Text className="font-inter text-[14px] text-gray-500 mt-2 leading-5">
            Control how we use your data to improve public transport services.
          </Text>
        </View>

        {/* ── App Permissions ── */}
        <View className="px-5 mt-6">
          <SectionHeading title="App Permissions" />

          {/* Permissions flat list (no card wrapper) */}
          <View className="gap-6 mt-2">
            {/* Location Tracking */}
            <View className="flex-row items-center justify-between">
              <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
                <Feather name="map-pin" size={16} color="#1F2937" />
              </View>
              <View className="flex-1 mr-4">
                <Text className="font-inter-semibold text-sm text-gray-900">
                  Location Tracking
                </Text>
                <Text className="font-inter text-xs text-gray-500 mt-1 leading-4">
                  Used for real-time bus tracking and route suggestions.
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#D9DADB', true: '#0B6E4F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Trip History */}
            <View className="flex-row items-center justify-between">
              <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
                <Feather name="clock" size={16} color="#1F2937" />
              </View>
              <View className="flex-1 mr-4">
                <Text className="font-inter-semibold text-sm text-gray-900">
                  Trip History
                </Text>
                <Text className="font-inter text-xs text-gray-500 mt-1 leading-4">
                  Store your past trips for easier future planning.
                </Text>
              </View>
              <Switch
                value={historyEnabled}
                onValueChange={setHistoryEnabled}
                trackColor={{ false: '#D9DADB', true: '#0B6E4F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Background Tracking */}
            <View className="flex-row items-center justify-between">
              <View className="w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
                <Feather name="activity" size={16} color="#1F2937" />
              </View>
              <View className="flex-1 mr-4">
                <Text className="font-inter-semibold text-sm text-gray-900">
                  Background Tracking
                </Text>
                <Text className="font-inter text-xs text-gray-500 mt-1 leading-4">
                  Allow app to update location while not in use for better accuracy.
                </Text>
              </View>
              <Switch
                value={backgroundEnabled}
                onValueChange={setBackgroundEnabled}
                trackColor={{ false: '#D9DADB', true: '#0B6E4F' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* ── Data Transparency ── */}
        <View className="px-5 mt-8">
          <SectionHeading title="Data Transparency" />

          <View className="gap-4">
            {/* What we collect Card */}
            <View className="bg-white border border-kerala-border rounded-card p-4">
              <Text className="font-inter-semibold text-sm text-gray-900 mb-3">
                What we collect
              </Text>
              
              <View className="gap-3">
                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-kerala-green items-center justify-center mr-3 mt-0.5">
                    <Feather name="check" size={11} color="#1B4332" />
                  </View>
                  <Text className="font-inter text-xs text-gray-600 flex-1 leading-4">
                    Anonymized route searches
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-kerala-green items-center justify-center mr-3 mt-0.5">
                    <Feather name="check" size={11} color="#1B4332" />
                  </View>
                  <Text className="font-inter text-xs text-gray-600 flex-1 leading-4">
                    General device location (when enabled)
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-kerala-green items-center justify-center mr-3 mt-0.5">
                    <Feather name="check" size={11} color="#1B4332" />
                  </View>
                  <Text className="font-inter text-xs text-gray-600 flex-1 leading-4">
                    Basic usage metrics for app stability
                  </Text>
                </View>
              </View>
            </View>

            {/* What NATPAC receives Card */}
            <View className="bg-white border border-kerala-border rounded-card p-4">
              <Text className="font-inter-semibold text-sm text-gray-900 mb-3">
                What NATPAC receives
              </Text>

              <View className="gap-3">
                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-kerala-green items-center justify-center mr-3 mt-0.5">
                    <Feather name="check" size={11} color="#1B4332" />
                  </View>
                  <Text className="font-inter text-xs text-gray-600 flex-1 leading-4">
                    Aggregated boarding/alighting data
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-gray-300 items-center justify-center mr-3 mt-0.5 bg-gray-50">
                    <Feather name="x" size={11} color="#9CA3AF" />
                  </View>
                  <Text className="font-inter text-xs text-gray-400 line-through flex-1 leading-4">
                    Personal identification (PII)
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full border border-gray-300 items-center justify-center mr-3 mt-0.5 bg-gray-50">
                    <Feather name="x" size={11} color="#9CA3AF" />
                  </View>
                  <Text className="font-inter text-xs text-gray-400 line-through flex-1 leading-4">
                    Exact start/end addresses
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Account Actions ── */}
        <View className="px-5 mt-8">
          <SectionHeading title="Account Actions" />

          <View className="border-t border-kerala-border mt-2">
            {/* Pause Tracking */}
            <TouchableOpacity
              onPress={() => alert(`Pause Tracking: Are you sure you want to pause location tracking? Your trips will not be recorded.`)}
              className="flex-row items-center justify-between py-4 border-b border-kerala-border"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Feather name="pause" size={16} color="#374151" />
                <Text className="font-inter-medium text-sm text-gray-900 ml-3">
                  Pause Tracking
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Delete Trip History */}
            <TouchableOpacity
              onPress={() => alert(`Delete Trip History: This will permanently delete your 30-day trip history. This action cannot be undone.`)}
              className="flex-row items-center justify-between py-4 border-b border-kerala-border"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Feather name="trash-2" size={16} color="#8B4513" />
                <Text className="font-inter-semibold text-sm text-kerala-laterite ml-3">
                  Delete Trip History
                </Text>
              </View>
              <Feather name="trash-2" size={16} color="#8B4513" />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
              onPress={() => alert(`Delete Account: Are you sure you want to permanently delete your account and all associated data?`)}
              className="flex-row items-center justify-between py-4 border-b border-kerala-border"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Feather name="alert-triangle" size={16} color="#8B4513" />
                <Text className="font-inter-semibold text-sm text-kerala-laterite ml-3">
                  Delete Account
                </Text>
              </View>
              <Feather name="alert-triangle" size={16} color="#8B4513" />
            </TouchableOpacity>

            {/* Manage Permissions */}
            <TouchableOpacity
              className="flex-row items-center justify-between py-4 border-b border-kerala-border"
              onPress={() => Linking.openSettings()}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Feather name="sliders" size={16} color="#374151" />
                <Text className="font-inter-medium text-sm text-gray-900 ml-3">
                  Manage Permissions (OS Settings)
                </Text>
              </View>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* View Privacy Policy */}
            <TouchableOpacity
              className="flex-row items-center justify-between py-4"
              onPress={() => Linking.openURL('https://keralamobility.in/privacy')}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Feather name="file-text" size={16} color="#374151" />
                <Text className="font-inter-medium text-sm text-gray-900 ml-3">
                  View Privacy Policy
                </Text>
              </View>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
