import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface FormInputProps {
  label: string;
  error?: string | null;
  isValid?: boolean;
  showCountryCode?: boolean;
  [key: string]: any;
}

export default function FormInput({
  label,
  error,
  isValid,
  showCountryCode,
  style,
  onFocus,
  onBlur,
  ...rest
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const hasError = !!error;

  const customTextInputStyle = { outlineStyle: 'none', padding: 0 } as any;

  return (
    <View className="mb-6">
      <Text className="font-inter-semibold text-[14px] text-gray-700 mb-2 ml-1">
        {label}
      </Text>
      
      <View className="flex-row items-center gap-2.5">
        {showCountryCode && (
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center bg-gray-100 rounded-2xl px-3.5 h-[58px] border border-transparent"
          >
            <Text className="text-xl mr-1.5">🇮🇳</Text>
            <Text className="font-inter-bold text-base text-black mr-1">+91</Text>
            <Feather name="chevron-down" size={14} color="#555555" />
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.inputContainer,
            { flex: 1 },
            { 
              borderColor: hasError ? '#EF4444' : isFocused ? '#0B6E4F' : '#D1D5DB',
              borderWidth: isFocused || hasError ? 2 : 1.5,
              // subtle green glow on focus
              shadowColor: isFocused && !hasError ? '#0B6E4F' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isFocused && !hasError ? 0.2 : 0,
              shadowRadius: 4,
              elevation: isFocused && !hasError ? 2 : 0,
            }
          ]}
        >
          <TextInput
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#9CA3AF"
            style={[styles.textInput, customTextInputStyle]}
            {...rest}
          />
          {isValid && !hasError && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.checkIconWrapper}>
              <Feather name="check-circle" size={22} color="#0B6E4F" />
            </Animated.View>
          )}
        </View>
      </View>

      {/* Inline Error Notice */}
      {hasError && (
        <View className="flex-row items-center mt-1.5 px-1">
          <Feather name="alert-circle" size={14} color="#EF4444" />
          <Text className="font-inter-medium text-xs text-red-500 ml-1.5 flex-1">{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    height: 58,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  checkIconWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
