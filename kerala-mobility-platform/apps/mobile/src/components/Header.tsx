import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  onMenuPress?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function Header({
  onMenuPress,
  showSearch = true,
  searchPlaceholder = 'Search trips, routes, or services',
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleNotification = () => {
    alert(`Notifications: You have no new notifications at this time.`);
  };

  const handleLanguage = () => {
    alert(`Language: Language selection is coming soon.`);
  };

  return (
    <View className="bg-kerala-green" style={{ paddingTop: insets.top }}>
      {/* Top row */}
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Wordmark */}
        <Text className="font-inter-bold text-lg text-white tracking-wide">
          Kerala Mobility
        </Text>

        {/* Right icons */}
        <View className="flex-row items-center gap-3">
          {/* Notification bell */}
          <TouchableOpacity
            onPress={handleNotification}
            className="w-9 h-9 rounded-full bg-kerala-gold items-center justify-center"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Language toggle */}
          <TouchableOpacity
            onPress={handleLanguage}
            className="w-9 h-9 rounded-full bg-kerala-green items-center justify-center border-2 border-white/50"
            accessibilityLabel="Language toggle"
          >
            <Text className="font-inter-bold text-[11px] text-white">EN</Text>
          </TouchableOpacity>

          {/* Profile / Hamburger */}
          <TouchableOpacity
            onPress={onMenuPress || (() => alert(`Profile: Opening profile settings...`))}
            className="w-9 h-9 rounded-full bg-kerala-green items-center justify-center border-2 border-white/50"
            accessibilityLabel="Open menu"
          >
            <Feather name="user" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View className="px-4 pb-3">
          <View className="flex-row items-center bg-white rounded-card px-3 py-2.5">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder={searchPlaceholder}
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 font-inter text-sm text-gray-800 outline-none"
              style={{ padding: 0, outlineStyle: 'none' } as any}
            />
            <Feather name="mic" size={18} color="#6B7280" />
          </View>
        </View>
      )}
    </View>
  );
}
