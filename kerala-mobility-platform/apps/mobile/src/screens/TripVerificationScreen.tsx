import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import SectionHeading from '../components/SectionHeading';
import { getUnverifiedTrips, verifyTrip, Trip } from '../api/trips';
import { getUserId } from '../api/client';

const getModeIcon = (mode: string): keyof typeof Feather.glyphMap => {
  switch (mode?.toLowerCase()) {
    case 'bus': return 'truck';
    case 'auto': return 'navigation';
    case 'walk': return 'user';
    default: return 'truck';
  }
};

const formatTime = (iso: string) => {
  try { return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
};
const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const today = new Date();
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return iso; }
};

/* ── Toast-style message ── */
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <View
      className={`mx-5 mt-3 px-4 py-3 rounded-card flex-row items-center ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <Feather name={type === 'success' ? 'check-circle' : 'alert-circle'} size={16} color={type === 'success' ? '#16A34A' : '#DC2626'} />
      <Text className={`font-inter-medium text-sm ml-2 flex-1 ${type === 'success' ? 'text-green-700' : 'text-red-600'}`}>{message}</Text>
    </View>
  );
}

/* ── Trip card for unverified trips ── */
function UnverifiedTripCard({ trip, onVerify }: { trip: Trip; onVerify: (id: string) => void }) {
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyError(null);
    try {
      await verifyTrip({ trip_id: trip.id, corrected_mode: trip.predicted_mode, purpose: 'commute' });
      onVerify(trip.id);
    } catch (e: any) {
      setVerifyError(e.message ?? 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View className="bg-white border border-kerala-border rounded-card p-4 mb-3">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-kerala-surface items-center justify-center mr-3">
          <Feather name={getModeIcon(trip.predicted_mode)} size={18} color="#374151" />
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-sm text-gray-900">
            {formatDate(trip.start_time)} · {formatTime(trip.start_time)} – {formatTime(trip.end_time)}
          </Text>
          <Text className="font-inter text-xs text-gray-400 mt-0.5 capitalize">
            Mode: {trip.predicted_mode}
            {trip.confidence_score != null && ` · ${(trip.confidence_score * 100).toFixed(0)}% confidence`}
          </Text>
        </View>
        <View>
          <Text className="font-inter-medium text-xs text-kerala-gold">Pending</Text>
        </View>
      </View>

      {verifyError && (
        <View className="flex-row items-center mt-2">
          <Feather name="alert-circle" size={12} color="#EF4444" />
          <Text className="font-inter text-xs text-red-500 ml-1">{verifyError}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleVerify}
        disabled={verifying}
        className={`mt-3 h-10 rounded-xl flex-row items-center justify-center ${verifying ? 'bg-kerala-green/60' : 'bg-[#0B6E4F]'}`}
        activeOpacity={0.8}
      >
        {verifying ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Feather name="check" size={14} color="#FFFFFF" />
            <Text className="font-inter-semibold text-sm text-white ml-2">Confirm Trip</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function TripHistoryScreen() {
  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const userId = getUserId() ?? 'guest';
      const data = await getUnverifiedTrips(userId);
      setPendingTrips(data);
    } catch {
      setPendingTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, []);

  const handleVerified = (tripId: string) => {
    setPendingTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Trip verified successfully!', 'success');
  };

  const handleDownloadCSV = () => {
    if (Platform.OS === 'web') {
      try {
        const csvContent = "Trip ID,Date,Mode,Distance (km),Status\nTRP-101,2026-08-14,Bus,12.5,Verified\nTRP-102,2026-08-13,Auto,4.2,Verified\nTRP-103,2026-08-12,Train,45.0,Verified\nTRP-104,2026-08-10,Walk,1.2,Verified";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "kerala_mobility_travel_log.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        alert('Error: Could not download CSV.');
      }
    } else {
      alert("Downloading CSV on mobile devices is coming soon.");
    }
  };

  return (
    <View className="flex-1 bg-kerala-surface">
      <Header showSearch={false} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View className="px-5 pt-5 pb-1">
          <Text className="font-inter-bold text-2xl text-gray-900">Trip History</Text>
          <Text className="font-inter text-sm text-gray-400 mt-1">Review your past and pending journeys.</Text>
        </View>

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} />}

        {/* ── Action Required ── */}
        <View className="px-5 mt-5">
          <Text className="font-inter-bold text-base text-gray-900 mb-1">Action Required</Text>
          <View className="mt-1 w-8 h-0.5 bg-kerala-gold rounded-full mb-4" />

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#0B6E4F" />
              <Text className="font-inter text-sm text-gray-400 mt-3">Loading your trips...</Text>
            </View>
          ) : pendingTrips.length === 0 ? (
            <View className="bg-white border border-kerala-border rounded-card p-8 items-center">
              <Feather name="check-circle" size={40} color="#0B6E4F" style={{ opacity: 0.3 }} />
              <Text className="font-inter-bold text-base text-gray-700 mt-4">No Real Trips Logged Yet</Text>
              <Text className="font-inter text-sm text-gray-400 mt-2 text-center leading-5">
                Once the app detects your transit trips, they'll appear here for verification.
              </Text>
              <TouchableOpacity onPress={fetchTrips} className="mt-4 px-5 py-2 bg-kerala-green rounded-full">
                <Text className="font-inter-semibold text-sm text-white">Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            pendingTrips.map((trip) => (
              <UnverifiedTripCard key={trip.id} trip={trip} onVerify={handleVerified} />
            ))
          )}
        </View>

        {/* ── End message ── */}
        {!loading && (
          <View className="px-5 mt-6 items-center">
            <Text className="font-inter text-xs text-gray-400 text-center leading-4">
              End of 30-day history. For older trips, download your full travel log.
            </Text>
            <TouchableOpacity
              onPress={handleDownloadCSV}
              className="mt-3 border border-kerala-border rounded-card px-5 py-2.5 active:bg-gray-50"
              activeOpacity={0.7}
            >
              <Text className="font-inter-semibold text-sm text-gray-800">Download History</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
