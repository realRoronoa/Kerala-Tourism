import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';

/* ── Tab options ── */
type TabOption = 'Discovery' | 'Your Impact';

/* ── Recommended items ── */
const RECOMMENDED = [
  {
    id: '1',
    icon: 'anchor' as const,
    title: 'Vembanad Backwaters',
    description: "Quiet canals, matching your 'Eco Tourism' interest.",
  },
  {
    id: '2',
    icon: 'map' as const,
    title: 'Munnar Tea Trails',
    description: 'High altitude routes for nature lovers.',
  },
];

/* ── All Services grid ── */
const SERVICES = [
  { icon: 'truck' as const, label: 'Public Transport' },
  { icon: 'anchor' as const, label: 'Waterways' },
  { icon: 'zap' as const, label: 'EV Stations' },
  { icon: 'sun' as const, label: 'Eco Tourism' },
  { icon: 'map' as const, label: 'City Maps' },
  { icon: 'calendar' as const, label: 'Events' },
  { icon: 'bell' as const, label: 'Alerts' },
  { icon: 'file-text' as const, label: 'Policy' },
];

/* ── Impact stats ── */
const IMPACT_STATS = [
  { label: 'Total Trips', value: '142' },
  { label: 'Total Distance', value: '850 km' },
  { label: 'Travel Time', value: '48 hrs' },
];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<TabOption>('Discovery');

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header showSearch={false} />

      {/* ── Tab switcher ── */}
      <View className="flex-row bg-white border-b border-kerala-border">
        {(['Discovery', 'Your Impact'] as TabOption[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center py-3 ${
              activeTab === tab ? 'border-b-2 border-kerala-green' : ''
            }`}
          >
            <Text
              className={`font-inter-semibold text-sm ${
                activeTab === tab ? 'text-kerala-green' : 'text-gray-400'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Discovery' ? (
          <>
            {/* Search bar */}
            <View className="px-5 pt-4">
              <View className="flex-row items-center bg-white border border-kerala-border rounded-card px-3 py-2.5">
                <Feather name="search" size={16} color="#9CA3AF" />
                <TextInput
                  placeholder="Search destinations, routes, or activities"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 font-inter text-sm text-gray-800"
                  style={{ padding: 0 }}
                />
              </View>
            </View>

            {/* ── Recommended for You ── */}
            <View className="px-5 mt-5">
              <SectionHeading title="Recommended for You" />

              <View className="gap-3">
                {RECOMMENDED.map((item) => (
                  <View
                    key={item.id}
                    className="bg-white border border-kerala-border rounded-card p-4"
                  >
                    <View className="flex-row items-start">
                      <View className="w-9 h-9 rounded-card bg-kerala-surface items-center justify-center mr-3 mt-0.5">
                        <Feather name={item.icon} size={16} color="#374151" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-inter-semibold text-sm text-gray-900">
                          {item.title}
                        </Text>
                        <Text className="font-inter text-xs text-gray-400 mt-1 leading-4">
                          {item.description}
                        </Text>
                        <TouchableOpacity onPress={() => alert(`Recommendation: Loading details for ${item.title}...`)} className="flex-row items-center mt-2">
                          <Text className="font-inter-semibold text-xs text-kerala-green">
                            View Details
                          </Text>
                          <Feather name="arrow-right" size={12} color="#1B4332" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ── All Services Grid ── */}
            <View className="px-5 mt-6">
              <SectionHeading title="All Services" />

              <View className="flex-row flex-wrap gap-3">
                {SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service.label}
                    onPress={() => alert(`Service: Opening ${service.label} services...`)}
                    className="bg-white border border-kerala-border rounded-card py-5 items-center justify-center"
                    style={{ width: '47%' }}
                    activeOpacity={0.7}
                  >
                    <Feather name={service.icon} size={24} color="#374151" />
                    <Text className="font-inter-medium text-xs text-gray-600 mt-2.5">
                      {service.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* ── Your Impact Tab ── */
          <>
            <View className="px-5 pt-5">
              <Text className="font-inter-bold text-2xl text-gray-900">Your Impact</Text>
              <Text className="font-inter text-xs text-gray-500 mt-1 leading-5">
                A summary of your mobility patterns and their contribution.
              </Text>
            </View>

            {/* Stat blocks stacked vertically */}
            <View className="px-5 mt-5 gap-3">
              <View className="bg-white border border-kerala-border rounded-card p-4">
                <Text className="font-inter text-xs text-gray-400">Total Trips</Text>
                <Text className="font-inter-bold text-3xl text-gray-900 mt-1">142</Text>
              </View>

              <View className="bg-white border border-kerala-border rounded-card p-4">
                <Text className="font-inter text-xs text-gray-400">Total Distance</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="font-inter-bold text-3xl text-gray-900">850</Text>
                  <Text className="font-inter text-sm text-gray-500 ml-1.5">km</Text>
                </View>
              </View>

              <View className="bg-white border border-kerala-border rounded-card p-4">
                <Text className="font-inter text-xs text-gray-400">Travel Time</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="font-inter-bold text-3xl text-gray-900">48</Text>
                  <Text className="font-inter text-sm text-gray-500 ml-1.5">hrs</Text>
                </View>
              </View>
            </View>

            {/* Mobility Trends */}
            <View className="px-5 mt-7">
              <SectionHeading title="Mobility Trends" />

              <View className="bg-white border border-kerala-border rounded-card p-4">
                {/* Segmented bar */}
                <View className="flex-row h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <View className="bg-black w-[45%]" />
                  <View className="bg-gray-600 w-[30%]" />
                  <View className="bg-gray-400 w-[15%]" />
                  <View className="bg-gray-300 w-[10%]" />
                </View>

                {/* Legend */}
                <View className="flex-row flex-wrap justify-between gap-y-2.5">
                  <View className="flex-row items-center w-[48%]">
                    <View className="w-2 h-2 rounded-full bg-black mr-2" />
                    <View>
                      <Text className="font-inter-medium text-xs text-gray-700">Bus</Text>
                      <Text className="font-inter text-[10px] text-gray-400">(45%)</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center w-[48%]">
                    <View className="w-2 h-2 rounded-full bg-gray-600 mr-2" />
                    <View>
                      <Text className="font-inter-medium text-xs text-gray-700">Walk</Text>
                      <Text className="font-inter text-[10px] text-gray-400">(30%)</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center w-[48%]">
                    <View className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                    <View>
                      <Text className="font-inter-medium text-xs text-gray-700">Bike</Text>
                      <Text className="font-inter text-[10px] text-gray-400">(15%)</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center w-[48%]">
                    <View className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                    <View>
                      <Text className="font-inter-medium text-xs text-gray-700">Other</Text>
                      <Text className="font-inter text-[10px] text-gray-400">(10%)</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Weekly Trend */}
            <View className="px-5 mt-7">
              <SectionHeading title="Weekly Trend" />

              <View className="bg-white border border-kerala-border rounded-card p-4">
                {/* Bar chart container */}
                <View className="flex-row justify-between items-end h-40 px-2 pb-2">
                  {[
                    { day: 'Mon', h: 'h-16' },
                    { day: 'Tue', h: 'h-24' },
                    { day: 'Wed', h: 'h-28' },
                    { day: 'Thu', h: 'h-36' },
                    { day: 'Fri', h: 'h-20' },
                    { day: 'Sat', h: 'h-8' },
                    { day: 'Sun', h: 'h-4' },
                  ].map((bar, idx) => (
                    <View key={idx} className="items-center w-8">
                      {/* Vertical black rounded bar */}
                      <View className={`${bar.h} w-2 bg-black rounded-full mb-2`} />
                      <Text className="font-inter text-[10px] text-gray-400">{bar.day}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Direct Impact Card */}
            <View className="px-5 mt-6">
              <View className="bg-white border border-kerala-border rounded-card p-4 flex-row items-start">
                {/* Custom Sparkle/Star Icon */}
                <View className="w-8 h-8 rounded-full bg-kerala-surface items-center justify-center mr-3">
                  <Feather name="star" size={16} color="#1B4332" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter-semibold text-sm text-gray-900">Direct Impact</Text>
                  <Text className="font-inter text-xs text-gray-500 mt-1 leading-4">
                    Your data helped NATPAC identify a need for increased bus frequency on the
                    Kochi-Kakkanad route.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
