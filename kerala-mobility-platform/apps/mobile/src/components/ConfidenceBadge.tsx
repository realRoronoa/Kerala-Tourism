import React from 'react';
import { View, Text } from 'react-native';

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const isHigh = level === 'high';
  const isLow = level === 'low';

  const bgColor = isHigh ? 'bg-kerala-green/10' : isLow ? 'bg-gray-200' : 'bg-kerala-gold/15';
  const dotColor = isHigh ? 'bg-kerala-green' : isLow ? 'bg-gray-400' : 'bg-kerala-gold';
  const textColor = isHigh ? 'text-kerala-green' : isLow ? 'text-gray-500' : 'text-kerala-gold';
  const textLabel = isHigh ? 'High Confidence' : isLow ? 'Low Confidence' : 'Medium Confidence';

  return (
    <View
      className={`flex-row items-center rounded-full px-2.5 py-1 ${bgColor}`}
    >
      {/* Dot indicator */}
      <View
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}
      />
      <Text
        className={`font-inter-medium text-[10px] tracking-wider uppercase ${textColor}`}
      >
        {textLabel}
      </Text>
    </View>
  );
}
