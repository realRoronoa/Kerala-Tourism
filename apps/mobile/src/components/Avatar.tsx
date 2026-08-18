import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

interface AvatarProps {
  initials?: string;
  size?: number;
  backgroundColor?: string;
}

export default function Avatar({
  initials = 'U',
  size = 36,
  backgroundColor = Colors.primary,
}: AvatarProps) {
  const fontSize = size * 0.38;
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  initials: {
    color: Colors.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
