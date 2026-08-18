import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import SkeletonCard from './SkeletonCard';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  unit?: string;
  loading?: boolean;
  dark?: boolean;
  highlight?: boolean;
  style?: ViewStyle;
}

export default function StatCard({
  icon,
  value,
  label,
  unit,
  loading = false,
  dark = false,
  highlight = false,
  style,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) return;
    setDisplayValue(0);
    animValue.setValue(0);

    const listenerId = animValue.addListener(({ value: v }) =>
      setDisplayValue(Math.round(v))
    );

    Animated.parallel([
      Animated.timing(animValue, {
        toValue: value,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      animValue.removeListener(listenerId);
    };
  }, [loading, value]);

  if (loading) {
    return <SkeletonCard height={96} borderRadius={14} dark={dark} />;
  }

  const cardBg = highlight
    ? '#E8F5F0'
    : dark
    ? Colors.darkCard
    : Colors.white;

  const textColor = highlight
    ? Colors.primary
    : dark
    ? Colors.darkText
    : Colors.text;

  const mutedColor = highlight
    ? '#065F46'
    : dark
    ? 'rgba(255,255,255,0.55)'
    : Colors.textMuted;

  const iconBgColor = highlight
    ? '#D1FAE5'
    : dark
    ? Colors.darkIconBg
    : Colors.iconBg;

  const borderColor = highlight
    ? '#A7F3D0'
    : dark
    ? Colors.darkCardBorder
    : Colors.border;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: textColor }]}>
          {displayValue.toLocaleString('en-IN')}
        </Text>
        {unit ? (
          <Text style={[styles.unit, { color: mutedColor }]}> {unit}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  value: { fontSize: 28, fontWeight: '800' },
  unit: { fontSize: 13, fontWeight: '600' },
});
