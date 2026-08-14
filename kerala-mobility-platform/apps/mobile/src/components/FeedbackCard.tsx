import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FeedbackCardProps {
  iconName: keyof typeof Feather.glyphMap;
  message: string;
  subMessage?: string;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

export default function FeedbackCard({
  iconName,
  message,
  subMessage,
  primaryAction,
  secondaryAction,
}: FeedbackCardProps) {
  return (
    <View className="bg-white border border-kerala-border rounded-card p-6 items-center w-full">
      <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mb-4 border border-gray-100">
        <Feather name={iconName} size={24} color="#9CA3AF" />
      </View>
      
      <Text className="font-inter-bold text-base text-gray-900 text-center">
        {message}
      </Text>
      
      {subMessage && (
        <Text className="font-inter text-sm text-gray-500 text-center mt-2 leading-5 px-4">
          {subMessage}
        </Text>
      )}

      {primaryAction && (
        <TouchableOpacity
          onPress={primaryAction.onPress}
          className="mt-6 w-full bg-[#0B6E4F] rounded-full py-3.5 items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="font-inter-bold text-[15px] text-white">
            {primaryAction.label}
          </Text>
        </TouchableOpacity>
      )}

      {secondaryAction && (
        <TouchableOpacity
          onPress={secondaryAction.onPress}
          className={`w-full bg-white border border-gray-200 rounded-full py-3.5 items-center justify-center ${primaryAction ? 'mt-3' : 'mt-6'}`}
          activeOpacity={0.7}
        >
          <Text className="font-inter-semibold text-[15px] text-gray-800">
            {secondaryAction.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
