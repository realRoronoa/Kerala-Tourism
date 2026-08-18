import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface PillButtonProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function PillButton({
  label,
  selected = false,
  onPress,
  icon,
  style,
  textStyle,
  disabled = false,
}: PillButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pill,
        selected ? styles.pillSelected : styles.pillDefault,
        pressed && !disabled && styles.pillPressed,
        disabled && styles.pillDisabled,
        style,
      ]}
      hitSlop={6}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? Colors.white : Colors.textMuted}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelDefault,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 46,
  },
  pillDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  pillSelected: {
    backgroundColor: '#0E8F5C',
    borderColor: '#0E8F5C',
  },
  pillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  pillDisabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelDefault: {
    color: '#0F1B2D',
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
