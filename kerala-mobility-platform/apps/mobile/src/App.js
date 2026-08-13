import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [trackingActive, setTrackingActive] = useState(true);
  const [pingCount, setPingCount] = useState(142);

  const toggleTracking = () => {
    setTrackingActive(!trackingActive);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kerala Travel Discovery</Text>
        <Text style={styles.subtitle}>NATPAC Passive Mobility Passive Collector</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Background Telemetry Status</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.statusBadge, { backgroundColor: trackingActive ? '#22c55e' : '#ef4444' }]}>
            {trackingActive ? 'ACTIVE (30s GPS Ping)' : 'PAUSED'}
          </Text>
          <Text style={styles.pingText}>{pingCount} Pings Sent</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={toggleTracking}>
          <Text style={styles.buttonText}>{trackingActive ? 'Pause Telemetry' : 'Resume Telemetry'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Verification (5 sec)</Text>
        <Text style={styles.infoText}>Trip detected today: 08:30 AM – 09:15 AM</Text>
        <Text style={styles.modeText}>Predicted Mode: Bus / KSRTC</Text>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.buttonText}>Confirm Trip & Claim Recommendations</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#38bdf8' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#1e293b', padding: 18, borderRadius: 12, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#f8fafc', marginBottom: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { color: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontWeight: 'bold', fontSize: 12 },
  pingText: { color: '#cbd5e1', fontSize: 14 },
  infoText: { color: '#cbd5e1', fontSize: 14, marginBottom: 4 },
  modeText: { color: '#4ade80', fontSize: 15, fontWeight: '600', marginBottom: 16 },
  button: { backgroundColor: '#475569', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});
