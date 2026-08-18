import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import SkeletonCard from '../components/SkeletonCard';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import FloatingTabBar, { TabName } from '../components/FloatingTabBar';
import { OnboardingStorage } from '../services/onboardingStorage';

// ─── Category filter chips (Interest Categories) ──────────────────────────────
const CATEGORIES = [
  'All',
  'Nature',
  'Beaches',
  'Mountains',
  'Wildlife',
  'Food',
  'Culture',
  'Adventure',
  'Peaceful Places',
];

// ─── Destination Place Cards ──────────────────────────────────────────────────
const PLACES = [
  {
    id: '1',
    category: 'Beaches',
    tag: 'Beach · Alappuzha',
    title: 'Marari Beach',
    subtitle: 'Quiet coastline with fishing hamlets',
    bestTime: 'Best: 4:00 PM–6:30 PM',
    stops: 'Kochi → Cherthala → Mararikulam',
    color1: '#0F4C81',
    color2: '#2563EB',
  },
  {
    id: '2',
    category: 'Mountains',
    tag: 'Mountains · Idukki',
    title: 'Munnar Tea Hills',
    subtitle: 'Misty tea plantations & rolling hills',
    bestTime: 'Best: 6:00 AM–10:00 AM',
    stops: 'Aluva → Kothamangalam → Munnar',
    color1: '#134E2F',
    color2: '#0E8F5C',
  },
  {
    id: '3',
    category: 'Wildlife',
    tag: 'Wildlife · Thekkady',
    title: 'Periyar National Park',
    subtitle: 'Elephant sanctuary & lake boat safari',
    bestTime: 'Best: 6:30 AM (Boat Safari)',
    stops: 'Kottayam → Kanjirappally → Kumily',
    color1: '#3D3B14',
    color2: '#0B6E4F',
  },
  {
    id: '4',
    category: 'Culture',
    tag: 'Culture · Ernakulam',
    title: 'Fort Kochi Heritage',
    subtitle: 'Colonial quarters & Chinese fishing nets',
    bestTime: 'Best: 3:30 PM–7:00 PM',
    stops: 'High Court Jetty → Vypeen → Fort Kochi',
    color1: '#4A1942',
    color2: '#7C3AED',
  },
  {
    id: '5',
    category: 'Nature',
    tag: 'Nature · Thrissur',
    title: 'Athirappilly Falls',
    subtitle: 'The Niagara of South India cascading into Chalakudy River',
    bestTime: 'Best: 9:00 AM–12:00 PM',
    stops: 'Chalakudy → Vettilappara → Athirappilly',
    color1: '#1E3A5F',
    color2: '#0284C7',
  },
  {
    id: '6',
    category: 'Beaches',
    tag: 'Beach · Thiruvananthapuram',
    title: 'Varkala Cliff',
    subtitle: 'Dramatic red laterite cliffs beside the Arabian Sea',
    bestTime: 'Best: Sunset (5:30 PM)',
    stops: 'Kollam → Paravur → Varkala',
    color1: '#7C2D12',
    color2: '#EA580C',
  },
  {
    id: '7',
    category: 'Peaceful Places',
    tag: 'Peaceful · Wayanad',
    title: 'Wayanad Bamboo Groves',
    subtitle: 'Tranquil canopy walks & organic spice valleys',
    bestTime: 'Best: Morning 8:00 AM',
    stops: 'Kozhikode → Thamarassery Churam → Wayanad',
    color1: '#064E3B',
    color2: '#059669',
  },
  {
    id: '8',
    category: 'Food',
    tag: 'Food · Kozhikode',
    title: 'Calicut Beach Food Promenade',
    subtitle: 'Authentic Malabar snacks, halwa & Kallummakkaya',
    bestTime: 'Best: Evening 6:00 PM–10:00 PM',
    stops: 'Calicut Railway Station → Beach Road',
    color1: '#831843',
    color2: '#BE185D',
  },
  {
    id: '9',
    category: 'Adventure',
    tag: 'Adventure · Idukki',
    title: 'Meesapulimala Peak Trek',
    subtitle: 'Second highest peak in Western Ghats',
    bestTime: 'Best: Sunrise 5:00 AM',
    stops: 'Munnar → Mattupetty → Silent Valley Base',
    color1: '#1E293B',
    color2: '#475569',
  },
];

// ─── Gradient card component ─────────────────────────────────────────────────
function PlaceCard({
  color1,
  color2,
  tag,
  title,
  subtitle,
  bestTime,
  onViewDetails,
  onGetDirections,
}: typeof PLACES[0] & {
  onViewDetails: () => void;
  onGetDirections: () => void;
}) {
  return (
    <View style={card.container}>
      {/* Visual Header */}
      <View style={card.bannerWrap}>
        <Svg width="100%" height={120} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id={`g${title.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={color1} />
              <Stop offset="100%" stopColor={color2} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height={120} rx={14} fill={`url(#g${title.replace(/\s/g, '')})`} />
        </Svg>
        {/* Top Location Tag Badge */}
        <View style={card.topBadgeRow}>
          <View style={card.tag}>
            <Text style={card.tagText}>{tag}</Text>
          </View>
        </View>
        {/* Title & Timing inside banner */}
        <View style={card.bannerBottom}>
          <Text style={card.bannerTitle}>{title}</Text>
          <Text style={card.bannerSub}>{bestTime}</Text>
        </View>
      </View>

      {/* Info & Action Row */}
      <View style={card.body}>
        <Text style={card.description}>{subtitle}</Text>
        <View style={card.btnRow}>
          <TouchableOpacity
            style={card.secondaryBtn}
            activeOpacity={0.7}
            onPress={onViewDetails}
          >
            <Text style={card.secondaryBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={card.primaryBtn}
            activeOpacity={0.7}
            onPress={onGetDirections}
          >
            <Ionicons name="navigate-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={card.primaryBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerWrap: {
    height: 120,
    padding: 14,
    justifyContent: 'space-between',
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bannerBottom: {},
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 23,
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  body: {
    padding: 14,
  },
  description: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.iconBg,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  primaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function TravelDiscoveryScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pre-select category based on saved onboarding interests if available
  const savedInterests = OnboardingStorage.getAnswers().interests;
  const initialCategory =
    savedInterests && savedInterests.length > 0 && CATEGORIES.includes(savedInterests[0])
      ? savedInterests[0]
      : 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedPlace, setSelectedPlace] = useState<typeof PLACES[0] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  function handleTabPress(tab: TabName) {
    if (tab === 'Discovery') return;
    if (tab === 'CenterAction') {
      navigation.navigate('Home');
      return;
    }
    navigation.navigate(tab);
  }

  // Filter places based on active interest category & search query
  const filteredPlaces = PLACES.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exploro</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
        >
          <Avatar initials="AK" size={34} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Discover Kerala</Text>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search places, beaches, hills, or food"
            placeholderTextColor={Colors.textLight}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Interest category filter chips ───────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* ─── Destination Place Cards ──────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Popular Destinations' : `${activeCategory} Destinations`}
          </Text>
          {activeCategory !== 'All' && (
            <TouchableOpacity hitSlop={8} onPress={() => setActiveCategory('All')}>
              <Text style={styles.viewAll}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={{ gap: 14 }}>
            <SkeletonCard height={190} borderRadius={16} />
            <SkeletonCard height={190} borderRadius={16} />
          </View>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              {...place}
              onViewDetails={() => setSelectedPlace(place)}
              onGetDirections={() => {
                Alert.alert(
                  'Directions to ' + place.title,
                  `Transit Route: ${place.stops}\n${place.bestTime}`,
                  [
                    {
                      text: 'Start Navigation',
                      onPress: () => navigation.navigate('Trips'),
                    },
                    { text: 'Close', style: 'cancel' },
                  ]
                );
              }}
            />
          ))
        ) : (
          <Text style={styles.emptySearchText}>
            No places found for "{search || activeCategory}".
          </Text>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ─── Destination Details Modal ─────────────────────── */}
      <Modal
        visible={selectedPlace !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPlace(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedPlace(null)}
        >
          {selectedPlace && (
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>{selectedPlace.title}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedPlace(null)}
                  hitSlop={10}
                >
                  <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.routeTagPill}>
                <Text style={styles.routeTagText}>{selectedPlace.tag}</Text>
              </View>

              <Text style={styles.modalSectionLabel}>ABOUT THIS LOCATION</Text>
              <Text style={styles.placeDescModal}>{selectedPlace.subtitle}</Text>

              <Text style={styles.modalSectionLabel}>BEST TIME TO VISIT</Text>
              <View style={styles.stopsBox}>
                <Ionicons name="time-outline" size={18} color={Colors.primary} />
                <Text style={styles.stopsText}>{selectedPlace.bestTime}</Text>
              </View>

              <Text style={styles.modalSectionLabel}>TRANSIT STOPS & ROUTE</Text>
              <View style={styles.stopsBox}>
                <Ionicons name="git-commit-outline" size={18} color={Colors.primary} />
                <Text style={styles.stopsText}>{selectedPlace.stops}</Text>
              </View>

              <PrimaryButton
                title="Get Directions"
                onPress={() => {
                  setSelectedPlace(null);
                  navigation.navigate('Trips');
                }}
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </Pressable>
      </Modal>

      {/* ─── Floating Tab bar ────────────────────────────── */}
      <FloatingTabBar activeTab="Discovery" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 14 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.text },

  chipsScroll: { marginBottom: 16 },
  chipsContent: { paddingRight: 20 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  viewAll: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  emptySearchText: { fontSize: 13, color: Colors.textMuted, paddingVertical: 24, textAlign: 'center' },

  bottomPad: { height: 16 },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  routeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  routeTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.tripTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  placeDescModal: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 14,
  },
  stopsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.iconBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  stopsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '600',
  },
});
