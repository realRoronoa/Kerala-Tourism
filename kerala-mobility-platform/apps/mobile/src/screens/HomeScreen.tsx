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
import { Colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import ConfidenceBadge from '../components/ConfidenceBadge';
import SkeletonCard from '../components/SkeletonCard';
import PrimaryButton from '../components/PrimaryButton';
import FloatingTabBar, { TabName } from '../components/FloatingTabBar';

// ─── Mock recent trips ────────────────────────────────────────────────────────
const RECENT_TRIPS = [
  {
    id: '1',
    route: 'Kochi to Munnar',
    detail: '4h 15m  ·  AC Semi-Sleeper',
    icon: 'bus-outline' as const,
    confidence: 98,
    iconColor: Colors.primary,
  },
  {
    id: '2',
    route: 'Vyttila to Kakkanad',
    detail: '25m  ·  Water Metro',
    icon: 'boat-outline' as const,
    confidence: 82,
    iconColor: '#3B82F6',
  },
];

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [plannerVisible, setPlannerVisible] = useState(false);
  const [origin, setOrigin] = useState('Vyttila Mobility Hub');
  const [destination, setDestination] = useState('Fort Kochi');
  const [selectedMode, setSelectedMode] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  function handleTabPress(tab: TabName) {
    if (tab === 'Home') return;
    if (tab === 'CenterAction') {
      setPlannerVisible(true);
      return;
    }
    navigation.navigate(tab);
  }

  function handleStatPress(statName: string, detail: string) {
    Alert.alert(statName, detail, [{ text: 'OK' }]);
  }

  function handleTripPlanSubmit() {
    setPlannerVisible(false);
    navigation.navigate('Discovery');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            hitSlop={8}
            onPress={() => setMenuModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exploro</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <Avatar initials="AK" size={36} />
          </TouchableOpacity>
        </View>

        {/* ─── Greeting ───────────────────────────────────── */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingSmall}>GOOD MORNING</Text>
          <Text style={styles.greetingLarge}>Hello, Arun!</Text>
        </View>

        {/* ─── Search bar ─────────────────────────────────── */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Discovery')}
        >
          <Ionicons name="search-outline" size={16} color={Colors.textLight} />
          <Text style={styles.searchPlaceholder}>Where to next in Kerala?</Text>
        </TouchableOpacity>

        {/* ─── Stat cards (interactive) ───────────────────── */}
        <View style={styles.statsStack}>
          {loading ? (
            <>
              <SkeletonCard height={96} borderRadius={14} style={styles.skeletonGap} />
              <SkeletonCard height={96} borderRadius={14} style={styles.skeletonGap} />
              <SkeletonCard height={96} borderRadius={14} />
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  handleStatPress(
                    'Total Trips: 124',
                    '84 KSRTC Bus journeys, 28 Kochi Metro trips, and 12 Water Metro ferries verified this month.'
                  )
                }
              >
                <StatCard
                  icon={<Ionicons name="navigate-outline" size={18} color={Colors.primary} />}
                  value={124}
                  label="Total Trips"
                  style={styles.statGap}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  handleStatPress(
                    'Distance Covered: 1,842 km',
                    'Across 6 districts in Kerala. Most frequent route: Ernakulam to Kakkanad.'
                  )
                }
              >
                <StatCard
                  icon={<Ionicons name="analytics-outline" size={18} color={Colors.primary} />}
                  value={1842}
                  unit="km"
                  label="Distance Covered"
                  style={styles.statGap}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  handleStatPress(
                    'Time Saved: 48 hrs',
                    'Calculated based on dedicated transit corridors and express bus routes compared to private traffic.'
                  )
                }
              >
                <StatCard
                  icon={<Ionicons name="time-outline" size={18} color={Colors.primary} />}
                  value={48}
                  unit="hrs"
                  label="Time Saved"
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ─── Recent Activity ────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity
            hitSlop={8}
            onPress={() => navigation.navigate('Trips')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {loading ? (
            <>
              <SkeletonCard height={64} borderRadius={10} style={styles.skeletonGap} />
              <SkeletonCard height={64} borderRadius={10} />
            </>
          ) : (
            RECENT_TRIPS.map((trip, idx) => (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Trips')}
              >
                {idx > 0 && <View style={styles.tripDivider} />}
                <View style={styles.tripRow}>
                  <View style={[styles.tripIconWrap, { backgroundColor: `${trip.iconColor}18` }]}>
                    <Ionicons name={trip.icon} size={18} color={trip.iconColor} />
                  </View>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripRoute}>{trip.route}</Text>
                    <Text style={styles.tripDetail}>{trip.detail}</Text>
                  </View>
                  <ConfidenceBadge value={trip.confidence} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ─── Quick Menu Modal ─────────────────────────────── */}
      <Modal
        visible={menuModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMenuModalVisible(false)}
        >
          <View style={styles.menuSheet}>
            <View style={styles.menuSheetHeader}>
              <Text style={styles.menuSheetTitle}>Quick Actions</Text>
              <TouchableOpacity
                onPress={() => setMenuModalVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuSheetItem}
              onPress={() => {
                setMenuModalVisible(false);
                setPlannerVisible(true);
              }}
            >
              <Ionicons name="map-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuSheetText}>Plan a New Journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSheetItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('Trips');
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuSheetText}>Verify Today's Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSheetItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('Discovery');
              }}
            >
              <Ionicons name="compass-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuSheetText}>Explore Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuSheetItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
              <Text style={styles.menuSheetText}>My Account & Settings</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ─── Quick Trip Planner Modal (Center + FAB Action) ─── */}
      <Modal
        visible={plannerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPlannerVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPlannerVisible(false)}
        >
          <View style={styles.plannerSheet}>
            <View style={styles.plannerHandle} />
            <View style={styles.menuSheetHeader}>
              <Text style={styles.menuSheetTitle}>Plan Your Trip</Text>
              <TouchableOpacity
                onPress={() => setPlannerVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>FROM</Text>
            <View style={styles.plannerInputWrap}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} />
              <TextInput
                style={styles.plannerInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Origin stop or station"
              />
            </View>

            <Text style={styles.inputLabel}>TO</Text>
            <View style={styles.plannerInputWrap}>
              <Ionicons name="flag-outline" size={18} color={Colors.accent} />
              <TextInput
                style={styles.plannerInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Destination"
              />
            </View>

            {/* Mode selection chips */}
            <Text style={styles.inputLabel}>PREFERRED MODE</Text>
            <View style={styles.modeRow}>
              {['All', 'Bus', 'Metro', 'Ferry'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.modeChip,
                    selectedMode === m && styles.modeChipActive,
                  ]}
                  onPress={() => setSelectedMode(m)}
                >
                  <Text
                    style={[
                      styles.modeChipText,
                      selectedMode === m && styles.modeChipTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton
              title="Find Best Route →"
              onPress={handleTripPlanSubmit}
              style={{ marginTop: 16 }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* ─── Floating Tab bar ────────────────────────────── */}
      <FloatingTabBar activeTab="Home" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  scroll:   { flex: 1, backgroundColor: Colors.white },
  content:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Greeting
  greetingBlock: { marginBottom: 20 },
  greetingSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingLarge: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 36,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchPlaceholder: { fontSize: 14, color: Colors.textLight },

  // Stats
  statsStack: { marginBottom: 28, gap: 10 },
  statGap:    { marginBottom: 0 },
  skeletonGap:{ marginBottom: 10 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  viewAll:      { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // Activity card
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tripDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  tripRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tripIconWrap:{
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripInfo:    { flex: 1 },
  tripRoute:   { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  tripDetail:  { fontSize: 12, color: Colors.textMuted },

  bottomPad:   { height: 20 },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  plannerSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  plannerHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  menuSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  menuSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuSheetText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
  },
  plannerInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    gap: 8,
  },
  plannerInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.iconBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modeChipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});
