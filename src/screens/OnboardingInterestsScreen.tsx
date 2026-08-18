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

const INTERESTS = [
  'Nature',
  'Beaches',
  'Mountains',
  'Wildlife',
  'Food',
  'Culture',
  'Adventure',
  'Peaceful Places',
];

export default function OnboardingInterestsScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const savedAnswers = OnboardingStorage.getAnswers();
  const { purpose = savedAnswers.purpose || 'Vacation / Tourism' } = route.params || {};
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    savedAnswers.interests && savedAnswers.interests.length > 0
      ? savedAnswers.interests
      : []
  );

  function toggleInterest(item: string) {
    setSelectedInterests((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  }

  function handleContinue() {
    navigation.navigate('OnboardingCompanions', {
      purpose,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Nature', 'Culture'],
    });
  }

  function handleSkip() {
    navigation.navigate('OnboardingCompanions', {
      purpose,
      interests: selectedInterests.length > 0 ? selectedInterests : ['Nature', 'Culture'],
    });
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
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '66.6%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Heading ──────────────────────────────────────────────────────── */}
        <SectionHeading
          title="What do you love about Kerala?"
          subtext="Pick as many as you like"
        />

        {/* ─── 2-Column Multi-select Pill Grid ──────────────────────────────── */}
        <View style={styles.pillGrid}>
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item);
            return (
              <PillButton
                key={item}
                label={item}
                selected={isSelected}
                onPress={() => toggleInterest(item)}
                style={styles.gridPill}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* ─── Bottom Actions ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={selectedInterests.length === 0}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridPill: {
    width: '48%',
    paddingHorizontal: 16,
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
