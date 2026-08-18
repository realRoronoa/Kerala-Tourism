import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeading from '../components/SectionHeading';
import PillButton from '../components/PillButton';
import PrimaryButton from '../components/PrimaryButton';
import { OnboardingStorage } from '../services/onboardingStorage';

const PURPOSES = [
  'Vacation / Tourism',
  'Work / Business',
  'Visiting Family & Friends',
  'Education',
  'Living Here',
  'Other',
];

export default function OnboardingPurposeScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const savedPurpose = OnboardingStorage.getAnswers().purpose;
  const [selectedPurpose, setSelectedPurpose] = useState<string>(savedPurpose || '');

  function handleContinue() {
    navigation.navigate('OnboardingInterests', {
      purpose: selectedPurpose || 'Vacation / Tourism',
    });
  }

  function handleSkip() {
    navigation.navigate('OnboardingInterests', {
      purpose: selectedPurpose || 'Vacation / Tourism',
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ─── Top Progress Indicator ───────────────────────────────────────── */}
      <View style={styles.progressContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '33.3%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Heading ──────────────────────────────────────────────────────── */}
        <SectionHeading
          title="Why are you visiting Kerala?"
          subtext="This helps us personalize your experience"
        />

        {/* ─── Single-select Pill Grid ──────────────────────────────────────── */}
        <View style={styles.pillGrid}>
          {PURPOSES.map((p) => (
            <PillButton
              key={p}
              label={p}
              selected={selectedPurpose === p}
              onPress={() => setSelectedPurpose(p)}
              style={styles.gridPill}
            />
          ))}
        </View>
      </ScrollView>

      {/* ─── Bottom Actions ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedPurpose}
          style={styles.continueBtn}
        />
        <TouchableOpacity
          onPress={handleSkip}
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
