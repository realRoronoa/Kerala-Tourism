import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import Chip from '../components/Chip';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Bus', 'Metro', 'Ferry', 'EV', 'Cycling'];

const SERVICES = [
  { id: 'ksrtc',   label: 'KSRTC',         icon: '🚌' },
  { id: 'metro',   label: 'Kochi Metro',    icon: '🚇' },
  { id: 'ferry',   label: 'Water Metro',    icon: '⛴️' },
  { id: 'inter',   label: 'Inter-City Bus', icon: '🚍' },
  { id: 'ev',      label: 'EV Taxis',       icon: '🚗' },
  { id: 'cycle',   label: 'Cycle Share',    icon: '🚲' },
];

export default function ExploreScreen({ navigation }: { navigation: any }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Explore</Text>

        {/* ─── Search bar ───────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search destinations, services…"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* ─── Category filter chips ──────────────────────────────────── */}
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

        {/* ─── Discover Kerala section ─────────────────────────────── */}
        <Text style={styles.sectionTitle}>Discover Kerala</Text>
        <EmptyState
          icon="🗺️"
          title="Destinations loading"
          message="Explore verified transit routes and cultural destinations across Kerala."
        />

        {/* ─── All Services grid ───────────────────────────────────── */}
        <Text style={styles.sectionTitle}>All Services</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.map((svc) => (
            <TouchableOpacity key={svc.id} style={styles.serviceCard} activeOpacity={0.7}>
              <View style={styles.serviceIconWrap}>
                <Text style={styles.serviceIcon}>{svc.icon}</Text>
              </View>
              <Text style={styles.serviceLabel}>{svc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extra bottom padding so FAB doesn't overlap last card */}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ─── FAB ────────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>🗺</Text>
        <Text style={styles.fabLabel}>Trip Planner</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 16 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: Colors.text },

  // Chips
  chipsScroll: { marginBottom: 20 },
  chipsContent: { paddingRight: 20 },

  // Section title
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },

  // Services grid (2-column)
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: Colors.iconBg,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceIcon: { fontSize: 20 },
  serviceLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },

  bottomPad: { height: 8 },

  // FAB — fixed position, outside ScrollView
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 13,
    zIndex: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { fontSize: 18, marginRight: 8 },
  fabLabel: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
