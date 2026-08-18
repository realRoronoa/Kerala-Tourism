import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SectionHeadingProps {
  title: string;
  subtext?: string;
  step?: string;
  style?: ViewStyle;
}

export default function SectionHeading({
  title,
  subtext,
  step,
  style,
}: SectionHeadingProps) {
  return (
    <View style={[styles.container, style]}>
      {step ? <Text style={styles.stepText}>{step}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E8F5C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1B2D',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 6,
  },
});
