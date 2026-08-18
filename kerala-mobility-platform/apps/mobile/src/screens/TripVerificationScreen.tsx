import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import ConfidenceBadge from '../components/ConfidenceBadge';
import PrimaryButton from '../components/PrimaryButton';
import PillButton from '../components/PillButton';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import FloatingTabBar, { TabName } from '../components/FloatingTabBar';
import { OnboardingStorage } from '../services/onboardingStorage';

// ─── Correction options ────────────────────────────────────────────────────────
const MODE_OPTIONS = [
  'Car / Taxi',
  'KSRTC Bus',
  'Kochi Metro',
  'Water Metro',
  'EV Auto',
  'Walk & Transit (Multimodal)',
];
const PURPOSE_OPTIONS = ['Tourism', 'Work', 'Education', 'Shopping', 'Other'];
const COMPANION_OPTIONS = ['Alone', 'Family', 'Friends', 'Group'];

interface TransitLeg {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

interface DetectedTrip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  mode: string;
  timeRange: string;
  duration: string;
  distance: string;
  confidence: number;
  status: 'pending' | 'confirmed' | 'fixed';
  purpose: string;
  companion: string;
  chain: TransitLeg[];
}

// ─── Initial Detected Trips with Multimodal Chain for All ──────────────────────
const INITIAL_TRIPS: DetectedTrip[] = [
  {
    id: 't1',
    title: 'Kochi → Munnar',
    origin: 'Kochi',
    destination: 'Munnar',
    mode: 'Car / Taxi',
    timeRange: '8:10 AM – 11:42 AM',
    duration: '3h 32m',
    distance: '128 km',
    confidence: 96,
    status: 'pending',
    purpose: 'Tourism',
    companion: 'Family',
    chain: [
      { label: 'Walk (4m)', icon: 'walk-outline' },
      { label: 'Cab (20m)', icon: 'car-outline' },
      { label: 'KSRTC AC (2h 45m)', icon: 'bus-outline' },
      { label: 'Auto (12m)', icon: 'car-sport-outline' },
    ],
  },
  {
    id: 't2',
    title: 'Home → Kakkanad Infopark',
    origin: 'Home',
    destination: 'Kakkanad Infopark',
    mode: 'Walk → Bus → Metro',
    timeRange: '8:30 AM – 9:15 AM',
    duration: '45m',
    distance: '14.2 km',
    confidence: 98,
    status: 'pending',
    purpose: 'Work',
    companion: 'Alone',
    chain: [
      { label: 'Walk (8m)', icon: 'walk-outline' },
      { label: 'City Bus (15m)', icon: 'bus-outline' },
      { label: 'Kochi Metro (18m)', icon: 'train-outline' },
      { label: 'Walk (4m)', icon: 'walk-outline' },
    ],
  },
  {
    id: 't3',
    title: 'Vyttila Hub → Fort Kochi',
    origin: 'Vyttila Mobility Hub',
    destination: 'Fort Kochi Jetty',
    mode: 'Water Metro Ferry',
    timeRange: '10:15 AM – 10:45 AM',
    duration: '30m',
    distance: '8.6 km',
    confidence: 94,
    status: 'pending',
    purpose: 'Tourism',
    companion: 'Friends',
    chain: [
      { label: 'Walk (5m)', icon: 'walk-outline' },
      { label: 'Water Metro (20m)', icon: 'boat-outline' },
      { label: 'EV Auto (5m)', icon: 'flash-outline' },
    ],
  },
  {
    id: 't4',
    title: 'Kozhikode → Wayanad',
    origin: 'Kozhikode Town',
    destination: 'Wayanad Sanctuary',
    mode: 'KSRTC Express',
    timeRange: '1:30 PM – 4:10 PM',
    duration: '2h 40m',
    distance: '86 km',
    confidence: 95,
    status: 'pending',
    purpose: 'Tourism',
    companion: 'Family',
    chain: [
      { label: 'Walk (6m)', icon: 'walk-outline' },
      { label: 'KSRTC Bus (2h 10m)', icon: 'bus-outline' },
      { label: 'Safari Cab (24m)', icon: 'car-outline' },
    ],
  },
];

export default function TripVerificationScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<DetectedTrip[]>(INITIAL_TRIPS);
  const [fixingTripId, setFixingTripId] = useState<string | null>(null);

  // In-app UI notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function showInAppToast(message: string) {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setToastMessage(null));
    }, 2400);
  }

  // Pre-select companion and purpose from onboarding answers
  const savedCompanion = OnboardingStorage.getAnswers().companions || 'Family';
  const savedPurpose = OnboardingStorage.getAnswers().purpose || 'Tourism';

  const [editMode, setEditMode] = useState('Car / Taxi');
  const [editPurpose, setEditPurpose] = useState(savedPurpose);
  const [editCompanion, setEditCompanion] = useState(savedCompanion);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  function handleTabPress(tab: TabName) {
    if (tab === 'Trips') return;
    if (tab === 'CenterAction') {
      navigation.navigate('Discovery');
      return;
    }
    navigation.navigate(tab);
  }

  function handleMarkCorrect(tripId: string) {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'confirmed' } : t))
    );
    showInAppToast('Trip verified & synced with NATPAC');
  }

  function handleStartFix(trip: DetectedTrip) {
    if (fixingTripId === trip.id) {
      setFixingTripId(null);
    } else {
      setFixingTripId(trip.id);
      setEditMode(trip.mode);
      setEditPurpose(trip.purpose || savedPurpose);
      setEditCompanion(trip.companion || savedCompanion);
    }
  }

  function handleSaveFix(tripId: string) {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;

        // Determine updated chain based on new mode
        let updatedChain = t.chain;
        if (editMode === 'Car / Taxi') {
          updatedChain = [
            { label: 'Walk (2m)', icon: 'walk-outline' },
            { label: 'Car / Taxi', icon: 'car-outline' },
          ];
        } else if (editMode === 'KSRTC Bus') {
          updatedChain = [
            { label: 'Walk (5m)', icon: 'walk-outline' },
            { label: 'KSRTC Bus', icon: 'bus-outline' },
            { label: 'Walk (3m)', icon: 'walk-outline' },
          ];
        } else if (editMode === 'Kochi Metro') {
          updatedChain = [
            { label: 'Walk (6m)', icon: 'walk-outline' },
            { label: 'Kochi Metro', icon: 'train-outline' },
            { label: 'Walk (4m)', icon: 'walk-outline' },
          ];
        } else if (editMode === 'Water Metro') {
          updatedChain = [
            { label: 'Walk (5m)', icon: 'walk-outline' },
            { label: 'Water Metro Ferry', icon: 'boat-outline' },
          ];
        } else if (editMode === 'EV Auto') {
          updatedChain = [
            { label: 'Walk (2m)', icon: 'walk-outline' },
            { label: 'EV Auto', icon: 'flash-outline' },
          ];
        }

        return {
          ...t,
          status: 'fixed',
          mode: editMode,
          purpose: editPurpose,
          companion: editCompanion,
          chain: updatedChain,
        };
      })
    );
    setFixingTripId(null);
    showInAppToast(`Saved: ${editMode} · ${editPurpose} (${editCompanion})`);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ─── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
        >
          <Avatar initials="AK" size={34} />
        </TouchableOpacity>
      </View>

      {/* ─── In-App Floating Toast Notification ─────────── */}
      {toastMessage && (
        <Animated.View
          style={[
            styles.inAppToast,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.inAppToastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Attention banner */}
        <View style={styles.banner}>
          <Ionicons name="sparkles-outline" size={15} color={Colors.primary} />
          <Text style={styles.bannerText}>
            {' '}
            Auto-detected multimodal transit chains & sensor telemetry
          </Text>
        </View>

        {loading ? (
          <View style={{ gap: 16 }}>
            <SkeletonCard height={180} borderRadius={16} />
            <SkeletonCard height={180} borderRadius={16} />
          </View>
        ) : trips.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No trips detected yet today"
            message="Your journeys will appear here automatically as you travel across Kerala."
          />
        ) : (
          trips.map((trip) => {
            const isFixing = fixingTripId === trip.id;
            const isConfirmed = trip.status === 'confirmed';
            const isFixed = trip.status === 'fixed';

            return (
              <View key={trip.id} style={styles.card}>
                {/* Route & Status Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.routeHeader}>
                    <Text style={styles.tripTitle}>{trip.title}</Text>
                    <Text style={styles.tripSubtitle}>
                      {trip.mode} · {trip.timeRange} ({trip.duration})
                    </Text>
                  </View>
                  <ConfidenceBadge value={trip.confidence} />
                </View>

                {/* ─── Multimodal transit chain sequence for EVERY trip ─── */}
                <View style={styles.multimodalRow}>
                  <Text style={styles.multimodalLabel}>DETECTED MULTIMODAL CHAIN</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.multimodalIconsChain}
                  >
                    {trip.chain.map((leg, idx) => (
                      <React.Fragment key={idx}>
                        <View style={styles.chainLegItem}>
                          <View style={styles.chainIconBadge}>
                            <Ionicons name={leg.icon} size={13} color={Colors.primary} />
                          </View>
                          <Text style={styles.chainLegText}>{leg.label}</Text>
                        </View>
                        {idx < trip.chain.length - 1 && (
                          <Ionicons
                            name="arrow-forward"
                            size={11}
                            color={Colors.textLight}
                            style={styles.chainArrow}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </ScrollView>
                </View>

                {/* Status indicator if answered / confirmed */}
                {(isConfirmed || isFixed) && (
                  <View style={styles.statusConfirmedBox}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                    <Text style={styles.statusConfirmedText}>
                      {isFixed
                        ? `Confirmed: ${trip.mode} · ${trip.purpose} (${trip.companion})`
                        : 'Verified as Correct'}
                    </Text>
                  </View>
                )}

                {/* Action Button Row */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[
                      styles.correctBtn,
                      isConfirmed && styles.correctBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => handleMarkCorrect(trip.id)}
                  >
                    <Text style={[styles.correctBtnText, isConfirmed && styles.correctBtnTextActive]}>
                      ✓ Correct
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.fixBtn,
                      isFixing && styles.fixBtnActive,
                    ]}
                    activeOpacity={0.75}
                    onPress={() => handleStartFix(trip)}
                  >
                    <Text style={[styles.fixBtnText, isFixing && styles.fixBtnTextActive]}>
                      ✏️ Fix
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ─── Expandable Inline Fix Selector (Confirm / Change) ─── */}
                {isFixing && (
                  <View style={styles.fixExpandContainer}>
                    <View style={styles.fixDivider} />

                    {/* Question 1: Mode of Transportation */}
                    <Text style={styles.fixSectionLabel}>Mode of Transportation?</Text>
                    <View style={styles.chipWrap}>
                      {MODE_OPTIONS.map((m) => (
                        <PillButton
                          key={m}
                          label={m}
                          selected={editMode === m}
                          onPress={() => setEditMode(m)}
                          style={styles.fixPill}
                        />
                      ))}
                    </View>

                    {/* Question 2: Purpose */}
                    <Text style={styles.fixSectionLabel}>Purpose?</Text>
                    <View style={styles.chipWrap}>
                      {PURPOSE_OPTIONS.map((p) => (
                        <PillButton
                          key={p}
                          label={p}
                          selected={editPurpose === p}
                          onPress={() => setEditPurpose(p)}
                          style={styles.fixPill}
                        />
                      ))}
                    </View>

                    {/* Question 3: Travelling with */}
                    <Text style={styles.fixSectionLabel}>Travelling with?</Text>
                    <View style={styles.chipWrap}>
                      {COMPANION_OPTIONS.map((c) => (
                        <PillButton
                          key={c}
                          label={c}
                          selected={editCompanion === c}
                          onPress={() => setEditCompanion(c)}
                          style={styles.fixPill}
                        />
                      ))}
                    </View>

                    {/* Save & Confirm Button */}
                    <PrimaryButton
                      title="Save & Confirm Correction"
                      onPress={() => handleSaveFix(trip.id)}
                      style={styles.saveFixBtn}
                    />
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ─── Floating Tab bar ────────────────────────────── */}
      <FloatingTabBar activeTab="Trips" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 100 },

  // Floating In-App UI Toast
  inAppToast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#0F1B2D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  inAppToastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerText: { fontSize: 12, color: Colors.primary, fontWeight: '600', flex: 1 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  routeHeader: { flex: 1, marginRight: 8 },
  tripTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 3 },
  tripSubtitle: { fontSize: 12, color: Colors.textMuted, lineHeight: 16 },

  // Multimodal chain container
  multimodalRow: {
    backgroundColor: Colors.iconBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  multimodalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  multimodalIconsChain: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  chainLegItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 5,
  },
  chainIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: Colors.tripTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainLegText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  chainArrow: {
    marginHorizontal: 5,
  },

  statusConfirmedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusConfirmedText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  correctBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.iconBg,
  },
  correctBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  correctBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  correctBtnTextActive: {
    color: '#FFFFFF',
  },

  fixBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.iconBg,
  },
  fixBtnActive: {
    backgroundColor: '#0F1B2D',
    borderColor: '#0F1B2D',
  },
  fixBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  fixBtnTextActive: {
    color: '#FFFFFF',
  },

  // Expandable fix section
  fixExpandContainer: {
    marginTop: 14,
  },
  fixDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  fixSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  fixPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  saveFixBtn: {
    marginTop: 8,
    paddingVertical: 14,
  },

  bottomPad: { height: 20 },
});
