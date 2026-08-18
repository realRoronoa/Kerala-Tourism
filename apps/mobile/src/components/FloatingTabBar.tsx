import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

export type TabName = 'Home' | 'Trips' | 'CenterAction' | 'Discovery' | 'Profile';

interface FloatingTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

interface TabButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ icon, isActive, onPress }: TabButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      hitSlop={10}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? '#111827' : '#9CA3AF'}
        />
        {isActive && <View style={styles.activeDot} />}
      </Animated.View>
    </Pressable>
  );
}

function CenterElevatedButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  return (
    <View style={styles.centerSlot}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.centerPressable}
        hitSlop={8}
      >
        <Animated.View style={[styles.centerCircle, { transform: [{ scale }] }]}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function FloatingTabBar({ activeTab, onTabPress }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 12) + 6;

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <View style={styles.pillBar}>
        {/* 1. Home */}
        <TabButton
          icon={activeTab === 'Home' ? 'home' : 'home-outline'}
          isActive={activeTab === 'Home'}
          onPress={() => onTabPress('Home')}
        />

        {/* 2. Trips */}
        <TabButton
          icon={activeTab === 'Trips' ? 'navigate' : 'navigate-outline'}
          isActive={activeTab === 'Trips'}
          onPress={() => onTabPress('Trips')}
        />

        {/* 3. Center Elevated Action Button */}
        <CenterElevatedButton onPress={() => onTabPress('CenterAction')} />

        {/* 4. Search / Discovery */}
        <TabButton
          icon={activeTab === 'Discovery' ? 'search' : 'search-outline'}
          isActive={activeTab === 'Discovery'}
          onPress={() => onTabPress('Discovery')}
        />

        {/* 5. Profile */}
        <TabButton
          icon={activeTab === 'Profile' ? 'person' : 'person-outline'}
          isActive={activeTab === 'Profile'}
          onPress={() => onTabPress('Profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  pillBar: {
    width: '100%',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Floating shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111827',
    alignSelf: 'center',
    marginTop: 3,
  },
  centerSlot: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  centerPressable: {
    top: -14, // Elevated above the pill bar's top edge
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    // Raised shadow for the black circle FAB
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 12,
  },
});
