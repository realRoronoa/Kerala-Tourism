import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  onPress,
  loading = false,
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-card py-3.5 px-6 items-center justify-center ${
        isPrimary
          ? 'bg-kerala-green'
          : 'bg-white border border-kerala-border'
      } ${disabled ? 'opacity-50' : ''}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#1B4332'} size="small" />
      ) : (
        <Text
          className={`font-inter-semibold text-sm tracking-wide ${
            isPrimary ? 'text-white' : 'text-kerala-green'
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
