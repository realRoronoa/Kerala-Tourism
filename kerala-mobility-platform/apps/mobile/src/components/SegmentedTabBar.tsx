import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

export type TabName = 'Discovery' | 'Trips' | 'Impact' | 'Profile';

interface SegmentedTabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: TabName;
  active: IoniconName;
  inactive: IoniconName;
}

const TABS: TabConfig[] = [
  { name: 'Discovery', active: 'compass',    inactive: 'compass-outline'   },
  { name: 'Trips',     active: 'map',        inactive: 'map-outline'       },
  { name: 'Impact',    active: 'leaf',       inactive: 'leaf-outline'      },
  { name: 'Profile',   active: 'person',     inactive: 'person-outline'    },
];

export default function SegmentedTabBar({
  activeTab,
  onTabPress,
}: SegmentedTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabWrap}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.75}
            >
              {isActive ? (
                /* ── Active: filled gold pill ──────────────── */
                <View style={styles.activePill}>
                  <Ionicons name={tab.active} size={16} color={Colors.white} />
                  <Text style={styles.activeLabel}>{tab.name}</Text>
                </View>
              ) : (
                /* ── Inactive: icon + label below ──────────── */
                <View style={styles.inactiveWrap}>
                  <Ionicons name={tab.inactive} size={20} color={Colors.textMuted} />
                  <Text style={styles.inactiveLabel}>{tab.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabWrap: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    gap: 5,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },
  inactiveWrap: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  inactiveLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
