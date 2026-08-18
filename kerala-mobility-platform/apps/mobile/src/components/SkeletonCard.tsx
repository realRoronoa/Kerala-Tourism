import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonCardProps {
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  dark?: boolean;
  style?: ViewStyle;
}

export default function SkeletonCard({
  height = 80,
  width = '100%',
  borderRadius = 12,
  dark = false,
  style,
}: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: dark ? 0.7 : 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dark]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          height,
          borderRadius,
          backgroundColor: dark ? '#1E293B' : '#E2E8F0',
          opacity,
          width: width as any,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'stretch' },
});
