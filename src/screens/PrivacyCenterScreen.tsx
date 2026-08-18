import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

// ─── Transparency card ────────────────────────────────────────────────────────
function TransparencyCard({
  icon,
  title,
  bullets,
}: {
  icon: string;
  title: string;
  bullets: string[];
}) {
  return (
    <View style={styles.transCard}>
      <View style={styles.transHeaderRow}>
        <Text style={styles.transIcon}>{icon}</Text>
        <Text style={styles.transTitle}>{title}</Text>
      </View>
      {bullets.map((b, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PrivacyCenterScreen({ navigation }: { navigation: any }) {
  const [locationTracking, setLocationTracking] = useState(true);
  const [tripHistory, setTripHistory] = useState(true);
  const [backgroundTracking, setBackgroundTracking] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Center</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Privacy & Data Protection</Text>
        <Text style={styles.subtitle}>
          Control how Exploro handles your transit sensor logs and what is shared with NATPAC.
        </Text>

        {/* ─── App Permissions ────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>App Permissions</Text>
        <View style={styles.card}>
          <ToggleRow
            label="Location Tracking"
            description="Used to detect your current transit route and nearby stops."
            value={locationTracking}
            onValueChange={(v) => {
              setLocationTracking(v);
              Alert.alert('Permission Updated', `Location Tracking is now ${v ? 'Enabled' : 'Disabled'}.`);
            }}
          />
          <View style={styles.separator} />
          <ToggleRow
            label="Trip History"
            description="Stores completed journeys on-device for your travel summary."
            value={tripHistory}
            onValueChange={(v) => {
              setTripHistory(v);
              Alert.alert('Permission Updated', `Trip History is now ${v ? 'Enabled' : 'Disabled'}.`);
            }}
          />
          <View style={styles.separator} />
          <ToggleRow
            label="Background Tracking"
            description="Allows trip detection even when the app is minimized."
            value={backgroundTracking}
            onValueChange={(v) => {
              setBackgroundTracking(v);
              Alert.alert('Permission Updated', `Background Tracking is now ${v ? 'Enabled' : 'Disabled'}.`);
            }}
          />
        </View>

        {/* ─── Data Transparency ──────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Data Transparency</Text>

        <TransparencyCard
          icon="📍"
          title="What we collect on-device"
          bullets={[
            'GPS coordinates during active trips',
            'Trip start / end timestamps',
            'Transport mode (bus, metro, ferry)',
            'Device model and OS version',
          ]}
        />

        <TransparencyCard
          icon="🏛️"
          title="What NATPAC receives"
          bullets={[
            'Anonymised aggregate trip counts',
            'Route demand statistics (no personal data)',
            'Service usage patterns by region',
            'No name, mobile number or email is ever shared',
          ]}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your data is processed under the Kerala Digital Governance Policy.
            For queries, contact{' '}
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Privacy Officer Contact', 'Official Email: privacy@exploro.kerala.gov.in\nPhone: 0471 254 3210')}
          >
            <Text style={styles.footerLink}>privacy@exploro.kerala.gov.in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 },

  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 24 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 10 },

  // Toggles card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleText: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  separator: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Transparency cards
  transCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  transHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  transIcon: { fontSize: 20, marginRight: 10 },
  transTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  bulletRow: { flexDirection: 'row', marginBottom: 5 },
  bullet: { fontSize: 14, color: Colors.primary, marginRight: 8, fontWeight: '700', lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 13, color: Colors.textMuted, lineHeight: 20 },

  // Footer
  footer: { marginTop: 12, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 12, color: Colors.textLight, lineHeight: 18, textAlign: 'center' },
  footerLink: { color: Colors.primary, fontWeight: '700', fontSize: 13, marginTop: 4 },
});
