import React from 'react';
import { View, Text } from 'react-native';

interface SectionHeadingProps {
  title: string;
}

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <View className="mb-4">
      <Text className="font-inter-semibold text-base text-gray-900">
        {title}
      </Text>
      {/* Gold signature rule — 2px underline */}
      <View className="mt-1.5 w-10 h-0.5 bg-kerala-gold rounded-full" />
    </View>
  );
}
