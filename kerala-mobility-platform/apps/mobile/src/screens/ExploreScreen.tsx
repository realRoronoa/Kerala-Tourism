import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import { getSpots, KeralaSpot } from '../api/explore';
import { searchLocation, SearchLocationResult } from '../api/weather';

type TabOption = 'Discovery' | 'Your Impact';

const CATEGORIES = ['All', 'Nature', 'Beach', 'Mountains', 'Wildlife', 'Culture', 'Peaceful'];

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

function SpotSkeleton() {
  return (
    <View className="bg-white border border-kerala-border rounded-card p-4 mb-3">
      <View className="flex-row items-start">
        <View className="w-9 h-9 rounded-card bg-gray-100 mr-3" />
        <View className="flex-1">
          <View className="h-3 w-2/3 bg-gray-100 rounded mb-2" />
          <View className="h-2 w-full bg-gray-100 rounded mb-1" />
          <View className="h-2 w-1/2 bg-gray-100 rounded" />
        </View>
      </View>
    </View>
  );
}

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<TabOption>('Discovery');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Spots state
  const [spots, setSpots] = useState<KeralaSpot[]>([]);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [spotsError, setSpotsError] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchLocationResult['results']>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch spots on mount or when category changes
  const fetchSpots = useCallback(async (category: string) => {
    setSpotsLoading(true);
    setSpotsError(false);
    try {
      const pref = category === 'All' ? undefined : category.toLowerCase();
      const data = await getSpots(pref);
      setSpots(data);
    } catch {
      setSpotsError(true);
    } finally {
      setSpotsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpots(selectedCategory); }, [selectedCategory]);

  // Debounced search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchLocation(text);
        setSearchResults(res.results ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const categoryIcon: Record<string, keyof typeof Feather.glyphMap> = {
    beach: 'anchor', nature: 'sun', mountains: 'triangle', wildlife: 'feather',
    culture: 'book', peaceful: 'wind', default: 'map-pin',
  };
  const getSpotIcon = (spot: KeralaSpot): keyof typeof Feather.glyphMap => {
    const cat = (spot.category?.[0] ?? '').toLowerCase();
    return categoryIcon[cat] ?? categoryIcon.default;
  };

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header showSearch={false} />

      {/* Tab switcher */}
      <View className="flex-row bg-white border-b border-kerala-border">
        {(['Discovery', 'Your Impact'] as TabOption[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center py-3 ${activeTab === tab ? 'border-b-2 border-kerala-green' : ''}`}
          >
            <Text className={`font-inter-semibold text-sm ${activeTab === tab ? 'text-kerala-green' : 'text-gray-400'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'Discovery' ? (
          <>
            {/* Search bar */}
            <View className="px-5 pt-4">
              <View className="flex-row items-center bg-white border border-kerala-border rounded-card px-3 py-2.5">
                <Feather name="search" size={16} color="#9CA3AF" />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search destinations, routes, or activities"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 font-inter text-sm text-gray-800"
                  style={{ padding: 0, outlineStyle: 'none' } as any}
                />
                {searchLoading && <ActivityIndicator size="small" color="#9CA3AF" />}
              </View>

              {/* Search results dropdown */}
              {searchQuery.length > 0 && (
                <View className="bg-white border border-kerala-border rounded-card mt-1 overflow-hidden shadow-sm">
                  {searchResults.length === 0 && !searchLoading ? (
                    <View className="px-4 py-3">
                      <Text className="font-inter text-sm text-gray-400">No results found for "{searchQuery}"</Text>
                    </View>
                  ) : (
                    searchResults.slice(0, 5).map((r, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => { setSearchQuery(r.name); setSearchResults([]); }}
                        className={`px-4 py-3 flex-row items-center ${i < searchResults.length - 1 ? 'border-b border-kerala-border' : ''}`}
                      >
                        <Feather name="map-pin" size={14} color="#0B6E4F" />
                        <View className="ml-3">
                          <Text className="font-inter-semibold text-sm text-gray-800">{r.name}</Text>
                          {r.district && <Text className="font-inter text-xs text-gray-400">{r.district}</Text>}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Category Chips */}
            <View className="px-5 mt-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full border ${
                      selectedCategory === cat
                        ? 'bg-kerala-green border-kerala-green'
                        : 'bg-white border-kerala-border'
                    }`}
                  >
                    <Text className={`font-inter-medium text-xs ${selectedCategory === cat ? 'text-white' : 'text-gray-600'}`}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Spots list */}
            <View className="px-5 mt-5">
              <SectionHeading title={selectedCategory === 'All' ? 'Discover Kerala' : `${selectedCategory} Spots`} />

              {spotsLoading ? (
                <>{[1, 2, 3].map((i) => <SpotSkeleton key={i} />)}</>
              ) : spotsError ? (
                <View className="bg-white border border-kerala-border rounded-card p-6 items-center">
                  <Feather name="wifi-off" size={28} color="#D1D5DB" />
                  <Text className="font-inter text-sm text-gray-400 mt-2 text-center">Couldn't load destinations. Check your connection.</Text>
                  <TouchableOpacity onPress={() => fetchSpots(selectedCategory)} className="mt-3 px-4 py-2 bg-kerala-green rounded-full">
                    <Text className="font-inter-semibold text-xs text-white">Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : spots.length === 0 ? (
                <View className="bg-white border border-kerala-border rounded-card p-6 items-center">
                  <Feather name="map" size={28} color="#D1D5DB" />
                  <Text className="font-inter text-sm text-gray-400 mt-2">No spots found for "{selectedCategory}"</Text>
                </View>
              ) : (
                <View className="gap-3">
                  {spots.slice(0, 10).map((spot, idx) => (
                    <View key={idx} className="bg-white border border-kerala-border rounded-card p-4">
                      <View className="flex-row items-start">
                        <View className="w-9 h-9 rounded-card bg-kerala-surface items-center justify-center mr-3 mt-0.5">
                          <Feather name={getSpotIcon(spot)} size={16} color="#374151" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-inter-semibold text-sm text-gray-900">{spot.name}</Text>
                          <Text className="font-inter text-xs text-gray-400 mt-0.5">{spot.district}</Text>
                          {spot.description && (
                            <Text className="font-inter text-xs text-gray-400 mt-1 leading-4" numberOfLines={2}>{spot.description}</Text>
                          )}
                          <View className="flex-row items-center mt-2 gap-2">
                            {spot.category?.slice(0, 2).map((cat, ci) => (
                              <View key={ci} className="bg-kerala-green/10 px-2 py-0.5 rounded-full">
                                <Text className="font-inter text-[10px] text-kerala-green">{cat}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* All Services Grid */}
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
                    <Text className="font-inter-medium text-xs text-gray-600 mt-2.5">{service.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* ── Your Impact Tab (static, no real user analytics yet) ── */
          <>
            <View className="px-5 pt-5">
              <Text className="font-inter-bold text-2xl text-gray-900">Your Impact</Text>
              <Text className="font-inter text-xs text-gray-500 mt-1 leading-5">A summary of your mobility patterns and their contribution.</Text>
            </View>
            <View className="px-5 mt-5 gap-3">
              {[
                { label: 'Total Trips', value: '—', unit: '' },
                { label: 'Total Distance', value: '—', unit: 'km' },
                { label: 'Travel Time', value: '—', unit: 'hrs' },
              ].map((s) => (
                <View key={s.label} className="bg-white border border-kerala-border rounded-card p-4">
                  <Text className="font-inter text-xs text-gray-400">{s.label}</Text>
                  <View className="flex-row items-baseline mt-1">
                    <Text className="font-inter-bold text-3xl text-gray-900">{s.value}</Text>
                    {s.unit && <Text className="font-inter text-sm text-gray-500 ml-1.5">{s.unit}</Text>}
                  </View>
                </View>
              ))}
            </View>
            <View className="px-5 mt-6">
              <View className="bg-white border border-kerala-border rounded-card p-4 flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-kerala-surface items-center justify-center mr-3">
                  <Feather name="star" size={16} color="#1B4332" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter-semibold text-sm text-gray-900">Direct Impact</Text>
                  <Text className="font-inter text-xs text-gray-500 mt-1 leading-4">
                    Your data helped NATPAC identify a need for increased bus frequency on the Kochi-Kakkanad route.
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
