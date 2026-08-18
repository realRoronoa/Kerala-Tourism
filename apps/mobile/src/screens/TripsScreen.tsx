import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import EmptyState from '../components/EmptyState';

export default function TripsScreen({ navigation }: { navigation: any }) {
  function handleRefresh() {
    // TODO: trigger refresh logic
  }

  function handleDownload() {
    // TODO: trigger download
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
          <Text style={styles.title}>Trip History</Text>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Text style={styles.downloadIcon}>⬇</Text>
            <Text style={styles.downloadLabel}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Action Required ────────────────────────────── */}
        <View style={styles.actionSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionBadge}>!</Text>
            <Text style={styles.sectionTitle}>Action Required</Text>
          </View>

          <EmptyState
            icon="🔄"
            title="No trip data synced yet"
            message="Your transit history will appear here once your journeys are verified. Tap Refresh to check for updates."
            buttonLabel="Refresh"
            onButtonPress={handleRefresh}
          />
        </View>

        {/* ─── Recent Trips section (empty state) ─────────── */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <EmptyState
            icon="🗺️"
            title="No trips recorded"
            message="Your completed and verified trips will be listed here."
          />
        </View>

        {/* ─── Download History button ─────────────────────── */}
        <TouchableOpacity style={styles.downloadSecondary} onPress={handleDownload}>
          <Text style={styles.downloadSecondaryIcon}>📄</Text>
          <Text style={styles.downloadSecondaryLabel}>Download Full History</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  downloadIcon: { fontSize: 14, marginRight: 6 },
  downloadLabel: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },

  actionSection: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    color: Colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 20,
    marginRight: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },

  recentSection: { marginBottom: 24 },

  downloadSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  downloadSecondaryIcon: { fontSize: 16 },
  downloadSecondaryLabel: { fontSize: 15, fontWeight: '600', color: Colors.textMuted },

  bottomPad: { height: 24 },
});
