import './global.css';

import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/components/CustomSplashScreen';

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-kerala-surface items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
        <Text className="mt-3 text-gray-400 text-xs">Loading Kerala Mobility…</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
        
        {!splashFinished && (
          <CustomSplashScreen onFinish={() => setSplashFinished(true)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}
