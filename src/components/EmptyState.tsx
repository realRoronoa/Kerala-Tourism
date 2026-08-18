import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import PrimaryButton from './PrimaryButton';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  title,
  message,
  buttonLabel,
  onButtonPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonLabel && onButtonPress && (
        <PrimaryButton
          title={buttonLabel}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { fontSize: 36, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6, textAlign: 'center' },
  message: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },
  button: { marginTop: 16, paddingHorizontal: 24 },
});
