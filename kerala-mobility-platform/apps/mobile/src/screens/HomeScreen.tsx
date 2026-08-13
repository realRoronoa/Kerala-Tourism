import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import ConfidenceBadge from '../components/ConfidenceBadge';

/* ── Quick Action items ── */
const QUICK_ACTIONS = [
  { icon: 'clock' as const, label: 'History', bg: '#1B4332' },
  { icon: 'bar-chart-2' as const, label: 'Insights', bg: '#1B4332' },
  { icon: 'credit-card' as const, label: 'Fares', bg: '#C89B3C' },
  { icon: 'alert-triangle' as const, label: 'Report', bg: '#8B4513' },
  { icon: 'shield' as const, label: 'Privacy', bg: '#6B7280' },
];

/* ── Detected Activity data ── */
const DETECTED_ACTIVITY = [
  {
    id: '1',
    origin: 'Trivandrum Central',
    destination: 'Technopark',
    timeRange: '08:30 - 09:15',
    distance: '8.5 km',
    mode: 'bus' as const,
    confidence: 'high' as const,
  },
  {
    id: '2',
    origin: 'Technopark Gate',
    destination: 'TCS Peepal Park',
    timeRange: '09:15 - 09:25',
    distance: '0.8 km',
    mode: 'walk' as const,
    confidence: 'medium' as const,
  },
  {
    id: '3',
    origin: 'TCS Peepal Park',
    destination: 'Kazhakootam',
    timeRange: '18:00 - 18:20',
    distance: '3.2 km',
    mode: 'bus' as const,
    confidence: 'high' as const,
  },
];

const getModeIcon = (mode: 'bus' | 'walk') => {
  return mode === 'bus' ? 'truck' : 'user';
};

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Pill Tabs ── */}
        <View className="flex-row px-5 pt-4 gap-3">
          <View className="flex-row items-center bg-white border border-kerala-border rounded-full px-4 py-2">
            <View className="w-2 h-2 rounded-full bg-kerala-green mr-2" />
            <Text className="font-inter-medium text-sm text-gray-800">Home</Text>
          </View>
          <TouchableOpacity onPress={() => alert(`Work Address: Set your work address for faster trip logging.`)} className="flex-row items-center bg-white border border-kerala-border rounded-full px-4 py-2">
            <Text className="font-inter text-sm text-gray-500">+ Set Work</Text>
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View className="px-5 pt-4">
          <Text className="font-inter text-sm text-gray-500">Good morning, Citizen</Text>
          <Text className="font-inter-bold text-2xl text-gray-900 mt-0.5">Today</Text>
          <Text className="font-inter text-xs text-gray-400 mt-0.5">Thursday, 13 Nov</Text>
        </View>

        {/* ── Advisory Banner ── */}
        <View className="mx-5 mt-4">
          <View className="flex-row items-center bg-kerala-gold/15 rounded-card px-3 py-2.5">
            <Feather name="wifi" size={14} color="#C89B3C" />
            <Text className="font-inter-medium text-xs text-gray-800 flex-1 ml-2">
              Heavy rain advisory: Expect bus delays on NH-66.
            </Text>
            <TouchableOpacity onPress={() => alert(`Advisory Dismissed: You have dismissed this alert.`)}>
              <Feather name="x" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stat Blocks ── */}
        <View className="flex-row px-5 mt-4 gap-2">
          {[
            { icon: 'truck' as const, value: '3', label: 'Trips' },
            { icon: 'navigation' as const, value: '12 km', label: 'Distance' },
            { icon: 'clock' as const, value: '45 min', label: 'Duration' },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-white border border-kerala-border rounded-card py-3 items-center"
            >
              <View className="flex-row items-center mb-1">
                <Feather name={stat.icon} size={13} color="#6B7280" />
                <Text className="font-inter-bold text-base text-gray-900 ml-1.5">
                  {stat.value}
                </Text>
              </View>
              <Text className="font-inter text-[11px] text-gray-400">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Quick Actions ── */}
        <View className="flex-row px-5 mt-5 justify-between">
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} onPress={() => Alert.alert(action.label, `The ${action.label} feature is coming soon.`)} className="items-center" activeOpacity={0.7}>
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: action.bg }}
              >
                <Feather name={action.icon} size={18} color="#FFFFFF" />
              </View>
              <Text className="font-inter-medium text-[11px] text-gray-600">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Pending Verification Banner ── */}
        <TouchableOpacity
          className="mx-5 mt-5"
          onPress={() => (navigation as any).navigate('Trips')}
        >
          <View className="flex-row items-center bg-kerala-gold/10 border border-kerala-gold/30 rounded-card px-4 py-3">
            <Feather name="alert-triangle" size={18} color="#C89B3C" />
            <Text className="font-inter-semibold text-sm text-gray-800 flex-1 ml-3">
              1 Trip Pending Verification
            </Text>
            <Feather name="arrow-right" size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>

        {/* ── Live Trip Card ── */}
        <View className="mx-5 mt-4">
          <View className="bg-white border border-kerala-border rounded-card p-4">
            {/* Header row */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-kerala-green mr-2" />
                <Text className="font-inter-semibold text-sm text-gray-900">Live Trip</Text>
              </View>
              <TouchableOpacity onPress={() => alert(`Live Map: Opening live vehicle tracking map...`)}>
                <Text className="font-inter-medium text-sm text-kerala-green">View Map</Text>
              </TouchableOpacity>
            </View>

            {/* Route info */}
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-card bg-kerala-surface items-center justify-center mr-3">
                <Feather name="truck" size={16} color="#1B4332" />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-sm text-gray-900">
                  Route 21 • East Fort to Kovalam
                </Text>
                <Text className="font-inter text-xs text-gray-400 mt-0.5">
                  14.2 km so far   32 min elapsed
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="mt-3 h-1.5 bg-kerala-surface rounded-full overflow-hidden">
              <View className="h-full w-3/5 bg-kerala-green rounded-full" />
            </View>
          </View>
        </View>

        {/* ── Detected Activity ── */}
        <View className="px-5 mt-6">
          <Text className="font-inter-bold text-lg text-gray-900 mb-4">Detected Activity</Text>

          <View className="gap-0">
            {DETECTED_ACTIVITY.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => alert(`Trip Details: Viewing details for trip to ${trip.destination}`)}
                  className="flex-row border-b border-kerala-border py-3.5"
                >
                {/* Left green bar */}
                <View className="w-1 rounded-full bg-kerala-green mr-3 self-stretch" />

                {/* Mode icon */}
                <View className="w-9 h-9 rounded-card bg-kerala-surface items-center justify-center mr-3 mt-0.5">
                  <Feather name={getModeIcon(trip.mode)} size={15} color="#374151" />
                </View>

                {/* Route details */}
                <View className="flex-1">
                  <Text className="font-inter-semibold text-sm text-gray-900">
                    {trip.origin} → {trip.destination}
                  </Text>
                  <Text className="font-inter text-xs text-gray-400 mt-1">
                    {trip.timeRange}   {trip.distance}
                  </Text>
                </View>

                {/* Confidence badge */}
                <View className="justify-center ml-2">
                  <ConfidenceBadge level={trip.confidence} />
                </View>
                </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Weekly Summary ── */}
        <View className="mx-5 mt-5 flex-row items-center justify-between">
          <Text className="font-inter text-xs text-gray-500">
            This Week: 18 Trips | 94 km | 3h 40m
          </Text>
          <TouchableOpacity onPress={() => alert(`Weekly Summary: Opening detailed weekly trip summary.`)}>
            <Text className="font-inter-semibold text-xs text-kerala-green">View Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
