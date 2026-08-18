import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SectionHeading from '../components/SectionHeading';
import PillButton from '../components/PillButton';
import PrimaryButton from '../components/PrimaryButton';
import { OnboardingStorage } from '../services/onboardingStorage';

const COMPANIONS = [
  { id: 'Alone',   label: 'Alone',   icon: 'person-outline' as const },
  { id: 'Family',  label: 'Family',  icon: 'people-outline' as const },
  { id: 'Friends', label: 'Friends', icon: 'heart-outline'  as const },
  { id: 'Group',   label: 'Group',   icon: 'bus-outline'    as const },
];

export default function OnboardingCompanionsScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const savedAnswers = OnboardingStorage.getAnswers();
  const {
    purpose = savedAnswers.purpose || 'Vacation / Tourism',
    interests = savedAnswers.interests || ['Nature', 'Culture'],
  } = route.params || {};

  const [selectedCompanion, setSelectedCompanion] = useState<string>(
    savedAnswers.companions || ''
  );

  async function handleGetStarted() {
    const finalAnswers = {
      purpose,
      interests,
      companions: selectedCompanion || 'Family',
    };

    // Save to storage
    await OnboardingStorage.saveAnswers(finalAnswers);

    // Transition into main tab navigator
    navigation.replace('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ─── Top Progress Indicator with Back Button ──────────────────────── */}
      <View style={styles.progressContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#0F1B2D" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Heading ──────────────────────────────────────────────────────── */}
        <SectionHeading
          title="Who are you usually travelling with?"
          subtext="We'll tailor recommendations accordingly"
        />

        {/* ─── Single-select Pill Grid ──────────────────────────────────────── */}
        <View style={styles.pillGrid}>
          {COMPANIONS.map((c) => (
            <PillButton
              key={c.id}
              label={c.label}
              icon={c.icon}
              selected={selectedCompanion === c.id}
              onPress={() => setSelectedCompanion(c.id)}
              style={styles.gridPill}
            />
          ))}
        </View>
      </ScrollView>

      {/* ─── Bottom Actions ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          title="Get Started"
          onPress={handleGetStarted}
          disabled={!selectedCompanion}
          style={styles.continueBtn}
        />
        <TouchableOpacity
          onPress={handleGetStarted}
          style={styles.skipBtn}
          hitSlop={8}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E8F5C',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0E8F5C',
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  pillGrid: {
    gap: 12,
  },
  gridPill: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  continueBtn: {
    width: '100%',
    marginBottom: 12,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
