import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import ConfidenceBadge from '../components/ConfidenceBadge';
import { getWeather, WeatherData } from '../api/weather';
import { getUnverifiedTrips, Trip } from '../api/trips';
import { getUserId } from '../api/client';

/* ── Quick Actions ── */
const QUICK_ACTIONS = [
  { icon: 'clock' as const, label: 'History', bg: '#1B4332', route: 'Trips' },
  { icon: 'bar-chart-2' as const, label: 'Insights', bg: '#1B4332', route: 'Explore' },
  { icon: 'credit-card' as const, label: 'Fares', bg: '#C89B3C', route: 'Explore' },
  { icon: 'alert-triangle' as const, label: 'Report', bg: '#8B4513', route: 'Trips' },
  { icon: 'shield' as const, label: 'Privacy', bg: '#6B7280', route: 'Privacy' },
];

/* ── Weather helpers ── */
const weatherIconMap: Record<string, keyof typeof Feather.glyphMap> = {
  Rain: 'cloud-rain',
  Clouds: 'cloud',
  Clear: 'sun',
  Snow: 'cloud-snow',
  Thunderstorm: 'zap',
  Drizzle: 'cloud-drizzle',
};
const getWeatherIcon = (status: string): keyof typeof Feather.glyphMap =>
  weatherIconMap[status] ?? 'cloud';

const getModeIcon = (mode: string): keyof typeof Feather.glyphMap => {
  switch (mode) {
    case 'bus': case 'Bus': return 'truck';
    case 'walk': case 'Walk': return 'user';
    case 'auto': return 'navigation';
    default: return 'truck';
  }
};

/* ── Skeleton block ── */
function Skeleton({ className }: { className?: string }) {
  return <View className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />;
}

export default function HomeScreen() {
  const navigation = useNavigation();

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  // Interactive UI state
  const [showWeather, setShowWeather] = useState(true);
  
  // Quick Access Chips State
  const [places, setPlaces] = useState([
    { id: 'home', name: 'Home', icon: 'home', traffic: 'green' },
    { id: 'work', name: 'Technopark', icon: 'briefcase', traffic: 'gold' },
  ]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null); // For action sheet
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');

  useEffect(() => {
    // Fetch weather (silent fail)
    getWeather()
      .then(setWeather)
      .catch(() => setWeatherError(true))
      .finally(() => setWeatherLoading(false));

    // Fetch unverified trips for this user
    const userId = getUserId() ?? 'guest';
    getUnverifiedTrips(userId)
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setTripsLoading(false));
  }, []);

  // Derive stats from real trips
  const totalTrips = trips.length;
  const totalKm = trips
    .reduce((sum, t) => {
      // Rough Haversine distance in km between origin and dest lat/lon
      const R = 6371;
      const dLat = ((t.dest_lat - t.origin_lat) * Math.PI) / 180;
      const dLon = ((t.dest_lon - t.origin_lon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((t.origin_lat * Math.PI) / 180) *
          Math.cos((t.dest_lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      return sum + R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }, 0)
    .toFixed(1);

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Pill Tabs ── */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4, gap: 8 }}
          >
            {places.map((place) => (
              <TouchableOpacity
                key={place.id}
                onPress={() => setSelectedPlace(place)}
                className="flex-row items-center bg-white border border-kerala-border rounded-full px-3 py-1.5"
                activeOpacity={0.7}
              >
                <Feather name={place.icon as any} size={12} color="#0B6E4F" style={{ marginRight: 6 }} />
                <Text className="font-inter-medium text-[13px] text-gray-800">{place.name}</Text>
                {place.traffic && (
                  <View 
                    className="w-2 h-2 rounded-full ml-1.5" 
                    style={{ 
                      backgroundColor: place.traffic === 'green' ? '#10B981' : place.traffic === 'gold' ? '#F59E0B' : '#EF4444' 
                    }} 
                  />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setIsAddPlaceOpen(true)}
              className="flex-row items-center bg-white border border-kerala-border rounded-full px-3 py-1.5"
              activeOpacity={0.7}
            >
              <Feather name="plus" size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text className="font-inter-medium text-[13px] text-gray-500">Add Place</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ── Greeting ── */}
        <View className="px-5 pt-4">
          <Text className="font-inter text-sm text-gray-500">Good morning, Citizen</Text>
          <Text className="font-inter-bold text-2xl text-gray-900 mt-0.5">Today</Text>
          <Text className="font-inter text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </Text>
        </View>

        {/* ── Weather Advisory Banner ── */}
        {showWeather && (
          <View className="mx-5 mt-4">
            {weatherLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : weatherError ? (
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-card px-3 py-2.5">
                <Feather name="wifi-off" size={14} color="#9CA3AF" />
                <Text className="font-inter text-xs text-gray-400 ml-2">Couldn't load weather data</Text>
              </View>
            ) : weather ? (
              <View className="flex-row items-center bg-kerala-gold/15 rounded-card px-3 py-2.5">
                <Feather name={getWeatherIcon(weather.weather_status)} size={14} color="#C89B3C" />
                <Text className="font-inter-medium text-xs text-gray-800 flex-1 ml-2">
                  {weather.weather_status} · {weather.temperature}°C · Wind {weather.wind_speed} km/h
                </Text>
                <TouchableOpacity onPress={() => setShowWeather(false)} className="px-2 py-1">
                  <Feather name="x" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* ── Stat Blocks ── */}
        <View className="flex-row px-5 mt-4 gap-2">
          {tripsLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="flex-1 h-16" />)
          ) : (
            [
              { icon: 'truck' as const, value: String(totalTrips), label: 'Trips' },
              { icon: 'navigation' as const, value: `${totalKm} km`, label: 'Distance' },
              { icon: 'clock' as const, value: `${(totalTrips * 15)} min`, label: 'Duration' },
            ].map((stat) => (
              <View key={stat.label} className="flex-1 bg-white border border-kerala-border rounded-card py-3 items-center">
                <View className="flex-row items-center mb-1">
                  <Feather name={stat.icon} size={13} color="#6B7280" />
                  <Text className="font-inter-bold text-base text-gray-900 ml-1.5">{stat.value}</Text>
                </View>
                <Text className="font-inter text-[11px] text-gray-400">{stat.label}</Text>
              </View>
            ))
          )}
        </View>

        {/* ── Quick Actions ── */}
        <View className="flex-row px-5 mt-5 justify-between">
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity 
              key={action.label} 
              onPress={() => (navigation as any).navigate(action.route)} 
              className="items-center" 
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-full items-center justify-center mb-1.5" style={{ backgroundColor: action.bg }}>
                <Feather name={action.icon} size={18} color="#FFFFFF" />
              </View>
              <Text className="font-inter-medium text-[11px] text-gray-600">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Pending Verification Banner ── */}
        {!tripsLoading && trips.length > 0 && (
          <TouchableOpacity className="mx-5 mt-5" onPress={() => (navigation as any).navigate('Trips')}>
            <View className="flex-row items-center bg-kerala-gold/10 border border-kerala-gold/30 rounded-card px-4 py-3">
              <Feather name="alert-triangle" size={18} color="#C89B3C" />
              <Text className="font-inter-semibold text-sm text-gray-800 flex-1 ml-3">
                {trips.length} Trip{trips.length > 1 ? 's' : ''} Pending Verification
              </Text>
              <Feather name="arrow-right" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        )}

        {/* ── Detected Activity (from real unverified trips) ── */}
        <View className="px-5 mt-6">
          <Text className="font-inter-bold text-lg text-gray-900 mb-4">Detected Activity</Text>

          {tripsLoading ? (
            <View className="gap-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </View>
          ) : trips.length === 0 ? (
            <View className="bg-white border border-kerala-border rounded-card p-6 items-center">
              <Feather name="map" size={32} color="#D1D5DB" />
              <Text className="font-inter-semibold text-sm text-gray-500 mt-3">No trips detected yet</Text>
              <Text className="font-inter text-xs text-gray-400 mt-1 text-center">Start your journey — we'll automatically detect your transit trips.</Text>
            </View>
          ) : (
            <View className="gap-0">
              {trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => (navigation as any).navigate('Trips')}
                  className="flex-row border-b border-kerala-border py-3.5"
                >
                  <View className="w-1 rounded-full bg-kerala-green mr-3 self-stretch" />
                  <View className="w-9 h-9 rounded-card bg-kerala-surface items-center justify-center mr-3 mt-0.5">
                    <Feather name={getModeIcon(trip.predicted_mode)} size={15} color="#374151" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-sm text-gray-900">
                      {trip.origin_lat.toFixed(3)}, {trip.origin_lon.toFixed(3)} → {trip.dest_lat.toFixed(3)}, {trip.dest_lon.toFixed(3)}
                    </Text>
                    <Text className="font-inter text-xs text-gray-400 mt-1">
                      {new Date(trip.start_time).toLocaleTimeString()} — {new Date(trip.end_time).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="justify-center ml-2">
                    <ConfidenceBadge level={trip.confidence_score && trip.confidence_score > 0.7 ? 'high' : trip.confidence_score && trip.confidence_score > 0.4 ? 'medium' : 'low'} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Weekly Summary ── */}
        <View className="mx-5 mt-5 flex-row items-center justify-between">
          <Text className="font-inter text-xs text-gray-500">
            {tripsLoading ? 'Loading...' : `This Session: ${totalTrips} Trips | ${totalKm} km`}
          </Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Trips')} activeOpacity={0.7}>
            <Text className="font-inter-semibold text-xs text-kerala-green">View Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Sheet Modal */}
      <Modal visible={!!selectedPlace} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity className="flex-1" onPress={() => setSelectedPlace(null)} activeOpacity={1} />
          <View className="bg-white rounded-t-3xl p-5 pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-kerala-green/10 items-center justify-center mr-3">
                  <Feather name={selectedPlace?.icon as any} size={18} color="#0B6E4F" />
                </View>
                <Text className="font-inter-bold text-xl text-gray-900">{selectedPlace?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPlace(null)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View className="gap-2">
              <TouchableOpacity 
                className="flex-row items-center p-4 bg-white rounded-xl border border-gray-200"
                activeOpacity={0.7}
                onPress={() => setSelectedPlace(null)}
              >
                <Feather name="navigation" size={18} color="#2563EB" />
                <Text className="font-inter-medium text-base text-gray-800 ml-3 flex-1">Get Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 bg-white rounded-xl border border-gray-200"
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedPlace(null);
                  (navigation as any).navigate('Trips');
                }}
              >
                <Feather name="play-circle" size={18} color="#0B6E4F" />
                <Text className="font-inter-medium text-base text-gray-800 ml-3 flex-1">Log a Trip Now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 bg-white rounded-xl border border-gray-200"
                activeOpacity={0.7}
                onPress={() => setSelectedPlace(null)}
              >
                <Feather name="edit-2" size={18} color="#6B7280" />
                <Text className="font-inter-medium text-base text-gray-800 ml-3 flex-1">Edit Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Place Modal */}
      <Modal visible={isAddPlaceOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity className="flex-1" onPress={() => setIsAddPlaceOpen(false)} activeOpacity={1} />
          <View className="bg-white rounded-t-3xl p-5 pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-inter-bold text-xl text-gray-900">Add New Place</Text>
              <TouchableOpacity onPress={() => setIsAddPlaceOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Text className="font-inter-medium text-sm text-gray-700 mb-2">Location Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
              <Feather name="map-pin" size={16} color="#9CA3AF" />
              <TextInput
                value={newPlaceName}
                onChangeText={setNewPlaceName}
                placeholder="e.g., Gym, School, Cafe"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-2 font-inter text-base text-gray-900 outline-none"
                style={{ padding: 0, outlineStyle: 'none' } as any}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              className="bg-kerala-green rounded-xl py-3.5 items-center justify-center opacity-90"
              activeOpacity={0.8}
              onPress={() => {
                if (newPlaceName.trim()) {
                  setPlaces([...places, { 
                    id: Date.now().toString(), 
                    name: newPlaceName.trim(), 
                    icon: 'map-pin', 
                    traffic: '' 
                  }]);
                  setNewPlaceName('');
                  setIsAddPlaceOpen(false);
                }
              }}
            >
              <Text className="font-inter-semibold text-base text-white">Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
