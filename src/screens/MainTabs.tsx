import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import TripVerificationScreen from './TripVerificationScreen';
import TravelDiscoveryScreen from './TravelDiscoveryScreen';
import ProfileScreen from './ProfileScreen';

export type MainTabParamList = {
  Home: undefined;
  Trips: undefined;
  Discovery: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Custom FloatingTabBar used instead
      }}
    >
      <Tab.Screen name="Home"      component={HomeScreen}             />
      <Tab.Screen name="Trips"     component={TripVerificationScreen} />
      <Tab.Screen name="Discovery" component={TravelDiscoveryScreen}  />
      <Tab.Screen name="Profile"   component={ProfileScreen}          />
    </Tab.Navigator>
  );
}
