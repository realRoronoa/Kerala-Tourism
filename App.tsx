import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OnboardingPurposeScreen from './src/screens/OnboardingPurposeScreen';
import OnboardingInterestsScreen from './src/screens/OnboardingInterestsScreen';
import OnboardingCompanionsScreen from './src/screens/OnboardingCompanionsScreen';
import MainTabs from './src/screens/MainTabs';
import TravelDiscoveryScreen from './src/screens/TravelDiscoveryScreen';
import PrivacyCenterScreen from './src/screens/PrivacyCenterScreen';

// ─── Forced light theme — prevents React Navigation from picking up device dark mode
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    notification: '#0B6E4F',
  },
};

// ─── Root stack param list ────────────────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OnboardingPurpose: undefined;
  OnboardingInterests: { purpose: string };
  OnboardingCompanions: { purpose: string; interests: string[] };
  MainTabs: undefined;
  // Stack screens reachable from within tabs:
  TravelDiscovery: undefined;
  PrivacyCenter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Root — ONE NavigationContainer, ONE Stack.Navigator ─────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Force dark icons/text on status bar — never flips to light in dark mode */}
      <StatusBar style="dark" />
      <NavigationContainer theme={LightTheme}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth flow */}
          <Stack.Screen name="Splash"    component={SplashScreen}  />
          <Stack.Screen name="Login"     component={LoginScreen}   />
          <Stack.Screen name="Register"  component={RegisterScreen}/>

          {/* 3-Step Onboarding Question Flow */}
          <Stack.Screen
            name="OnboardingPurpose"
            component={OnboardingPurposeScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OnboardingInterests"
            component={OnboardingInterestsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OnboardingCompanions"
            component={OnboardingCompanionsScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Main app — tab navigator nested here */}
          <Stack.Screen name="MainTabs"  component={MainTabs}      />

          {/* Stack screens accessible from within tabs */}
          <Stack.Screen name="TravelDiscovery" component={TravelDiscoveryScreen} />
          <Stack.Screen name="PrivacyCenter"   component={PrivacyCenterScreen}   />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
