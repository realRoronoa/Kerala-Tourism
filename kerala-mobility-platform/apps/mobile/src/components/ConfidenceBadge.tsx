import React from 'react';
import { View, Text } from 'react-native';

type ConfidenceLevel = 'high' | 'medium';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const isHigh = level === 'high';

  return (
    <View
      className={`flex-row items-center rounded-full px-2.5 py-1 ${
        isHigh ? 'bg-kerala-green/10' : 'bg-kerala-gold/15'
      }`}
    >
      {/* Dot indicator */}
      <View
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isHigh ? 'bg-kerala-green' : 'bg-kerala-gold'
        }`}
      />
      <Text
        className={`font-inter-medium text-[10px] tracking-wider uppercase ${
          isHigh ? 'text-kerala-green' : 'text-kerala-gold'
        }`}
      >
        {isHigh ? 'High Confidence' : 'Medium Confidence'}
      </Text>
    </View>
  );
}
