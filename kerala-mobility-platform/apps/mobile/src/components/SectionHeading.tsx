import React from 'react';
import { View, Text } from 'react-native';

interface SectionHeadingProps {
  title: string;
}

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <View className="mb-4 flex-row items-center">
      {/* 4px brand-green left accent bar */}
      <View className="w-1 h-[22px] bg-[#0B6E4F] rounded-full mr-2.5" />
      <Text className="font-inter-bold text-lg text-gray-900">
        {title}
      </Text>
    </View>
  );
}
