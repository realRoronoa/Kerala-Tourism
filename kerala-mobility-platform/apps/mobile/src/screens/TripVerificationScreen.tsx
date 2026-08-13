import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';

/* ── Demo data ── */
interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  timeRange: string;
  distance: string;
  status: 'pending' | 'verified';
  mode: 'bus' | 'auto' | 'walk';
}

const ACTION_REQUIRED: Trip[] = [
  {
    id: '1',
    origin: 'Trivandrum Central',
    destination: 'Technopark',
    date: 'Today',
    timeRange: '08:30 - 09:15',
    distance: '8.5 km',
    status: 'pending',
    mode: 'bus',
  },
];

const PAST_TRIPS: Trip[] = [
  {
    id: '2',
    origin: 'Kochi',
    destination: 'Alappuzha',
    date: 'Yesterday',
    timeRange: '10:00 - 11:30',
    distance: '53 km',
    status: 'verified',
    mode: 'bus',
  },
  {
    id: '3',
    origin: 'Vaikom',
    destination: 'Ernakulam',
    date: '11 Nov',
    timeRange: '16:15 - 17:45',
    distance: '34 km',
    status: 'verified',
    mode: 'auto',
  },
  {
    id: '4',
    origin: 'Kakkanad',
    destination: 'MG Road',
    date: '10 Nov',
    timeRange: '09:00 - 09:45',
    distance: '12 km',
    status: 'verified',
    mode: 'bus',
  },
];

const getModeIcon = (mode: string): keyof typeof Feather.glyphMap => {
  switch (mode) {
    case 'bus': return 'truck';
    case 'auto': return 'navigation';
    case 'walk': return 'user';
    default: return 'truck';
  }
};

export default function TripHistoryScreen() {
  return (
    <View className="flex-1 bg-kerala-surface">
      <Header showSearch={false} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <View className="px-5 pt-5 pb-1">
          <Text className="font-inter-bold text-2xl text-gray-900">Trip History</Text>
          <Text className="font-inter text-sm text-gray-400 mt-1">
            Review your past and pending journeys.
          </Text>
        </View>

        {/* ── Action Required ── */}
        <View className="px-5 mt-5">
          <Text className="font-inter-bold text-base text-gray-900 mb-1">Action Required</Text>
          <View className="mt-1 w-8 h-0.5 bg-kerala-gold rounded-full mb-4" />

          {ACTION_REQUIRED.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => alert(`Verify Trip: Opening camera to scan ticket QR code...`)}
              className="flex-row items-center bg-white border border-kerala-border rounded-card p-4"
            >
              {/* Icon */}
              <View className="w-10 h-10 rounded-full bg-kerala-surface items-center justify-center mr-3">
                <Feather name="clock" size={18} color="#6B7280" />
              </View>

              {/* Details */}
              <View className="flex-1">
                <Text className="font-inter-semibold text-sm text-gray-900">
                  {trip.origin} → {trip.destination}
                </Text>
                <Text className="font-inter text-xs text-gray-400 mt-1">
                  {trip.date}, {trip.timeRange}   {trip.distance}
                </Text>
              </View>

              {/* Status */}
              <View className="ml-2">
                <Text className="font-inter-medium text-xs text-kerala-gold">
                  Pending Verification
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Past Verified Trips ── */}
        <View className="px-5 mt-7">
          <Text className="font-inter-bold text-base text-gray-900 mb-1">Past Verified Trips</Text>
          <View className="mt-1 w-8 h-0.5 bg-kerala-gold rounded-full mb-4" />

          <View className="bg-white border border-kerala-border rounded-card overflow-hidden">
            {PAST_TRIPS.map((trip, idx) => (
              <TouchableOpacity
                key={trip.id}
                onPress={() => alert(`Trip Details: Verified trip to ${trip.destination}.`)}
                className={`flex-row items-center p-4 ${
                  idx < PAST_TRIPS.length - 1 ? 'border-b border-kerala-border' : ''
                }`}
              >
                {/* Mode icon */}
                <View className="w-10 h-10 rounded-full bg-kerala-surface items-center justify-center mr-3">
                  <Feather name={getModeIcon(trip.mode)} size={18} color="#374151" />
                </View>

                {/* Details */}
                <View className="flex-1">
                  <Text className="font-inter-semibold text-sm text-gray-900">
                    {trip.origin} → {trip.destination}
                  </Text>
                  <Text className="font-inter text-xs text-gray-400 mt-1">
                    {trip.date}, {trip.timeRange}   {trip.distance}
                  </Text>
                </View>

                {/* Verified badge */}
                <View className="flex-row items-center ml-2">
                  <Feather name="check-circle" size={12} color="#1B4332" />
                  <Text className="font-inter-medium text-xs text-kerala-green ml-1">
                    Verified
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── End of history message ── */}
        <View className="px-5 mt-6 items-center">
          <Text className="font-inter text-xs text-gray-400 text-center leading-4">
            End of 30-day history. For older trips, download your full travel log.
          </Text>
          <TouchableOpacity onPress={() => alert(`Download History: Preparing your travel log CSV...`)} className="mt-3 border border-kerala-border rounded-card px-5 py-2.5">
            <Text className="font-inter-semibold text-sm text-gray-800">Download History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
