import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

interface ConfidenceBadgeProps {
  value: number;   // 0-100
  label?: string;  // override the computed label
  animate?: boolean;
}

function palette(v: number) {
  if (v >= 90) return { bg: '#E8F5F0', text: Colors.primary, dot: Colors.primary };
  if (v >= 70) return { bg: '#FDF8EC', text: Colors.accent, dot: Colors.accent };
  return { bg: '#F3F4F6', text: Colors.textMuted, dot: Colors.textLight };
}

export default function ConfidenceBadge({
  value,
  label,
  animate = true,
}: ConfidenceBadgeProps) {
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const colors = palette(value);

  useEffect(() => {
    if (!animate) return;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [animate]);

  const displayText =
    label ?? (value >= 90 ? 'High Confidence' : value >= 70 ? 'Med Confidence' : 'Low Confidence');

  return (
    <Animated.View style={[styles.badge, { backgroundColor: colors.bg, opacity }]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[styles.label, { color: colors.text }]}>{displayText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginRight: 5 },
  label: { fontSize: 11, fontWeight: '700' },
});
