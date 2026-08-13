import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Rect, Defs, Pattern } from 'react-native-svg';
import { registerUser } from '../api/auth';
import { storeToken } from '../api/client';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isButtonActive = mobile.length === 0 || mobile.length === 10;

  const handleLogin = async () => {
    setError(null);
    if (mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser({
        email: `${mobile}@keralamobility.in`,
        password: `km_${mobile}`,
        full_name: 'Kerala Traveler',
      });
      storeToken('session_token', String(user.id));
      (navigation as any).replace('MainTabs');
    } catch (e: any) {
      if (e.message?.toLowerCase().includes('already exists')) {
        storeToken('session_token', `user_${mobile}`);
        (navigation as any).replace('MainTabs');
      } else {
        setError(e.message ?? 'Could not connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute w-full h-full" style={{ opacity: 0.04 }} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="loginGeoPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <Path d="M0 60 L60 0 H30 L0 30 Z M60 60 L0 0 V30 L30 60 Z" fill="#0B6E4F" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#loginGeoPattern)" />
        </Svg>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 24) }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View className="px-6 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center -ml-2 rounded-full bg-gray-50 border border-gray-100"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="font-inter-semibold text-sm text-gray-400">Step 2 of 2</Text>
          </View>

          <View className="px-6 mt-12">
            {/* Brand Emblem */}
            <View className="items-center mb-6">
              <View className="w-16 h-20 border-2 border-kerala-green rounded-2xl items-center justify-center bg-white mb-3">
                <Feather name="map-pin" size={32} color="#D9A441" />
              </View>
              <Text className="font-inter-bold text-3xl text-kerala-green tracking-tight text-center">Kerala Mobility</Text>
              <Text className="font-inter-semibold text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1 text-center">The Lifeline of Transit</Text>
            </View>

            {/* Headline */}
            <View className="mb-6">
              <Text className="font-inter-bold text-2xl text-gray-900 mb-2 text-center">Enter Mobile Number</Text>
              <Text className="font-inter text-sm text-gray-500 leading-5 text-center px-4">
                We will send you a 6-digit One Time Password (OTP) to verify your account.
              </Text>
            </View>

            {/* Input */}
            <View className="mb-2">
              <Text className="font-inter-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Mobile Number</Text>
              <View className={`flex-row items-center bg-white border rounded-2xl px-4 h-16 ${error ? 'border-red-400' : 'border-gray-200'}`}>
                <View className="flex-row items-center pr-3 border-r border-gray-200">
                  <Text className="font-inter-medium text-base text-gray-500 mr-1.5">🇮🇳</Text>
                  <Text className="font-inter-semibold text-base text-gray-800">+91</Text>
                </View>
                <TextInput
                  value={mobile}
                  onChangeText={(text) => { setError(null); setMobile(text.replace(/[^0-9]/g, '').slice(0, 10)); }}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  editable={!loading}
                  className="flex-1 ml-4 font-inter-semibold text-base text-gray-800 h-full"
                  style={{ outlineStyle: 'none', padding: 0 } as any}
                />
                {mobile.length === 10 && !error && (
                  <View className="w-6 h-6 rounded-full bg-kerala-green/10 items-center justify-center">
                    <Feather name="check" size={14} color="#0B6E4F" />
                  </View>
                )}
              </View>
              {error && (
                <View className="flex-row items-center mt-2">
                  <Feather name="alert-circle" size={13} color="#EF4444" />
                  <Text className="font-inter text-xs text-red-500 ml-1.5 flex-1">{error}</Text>
                </View>
              )}
            </View>

            {/* CTA */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`w-full h-14 rounded-2xl flex-row justify-center items-center mb-4 mt-6 ${
                isButtonActive && !loading ? 'bg-[#0B6E4F]' : loading ? 'bg-[#0B6E4F]/70' : 'bg-gray-200'
              }`}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className={`font-inter-bold text-base ${isButtonActive ? 'text-white' : 'text-gray-400'}`}>Get OTP</Text>
                  <Feather name="arrow-right" size={18} color={isButtonActive ? '#FFFFFF' : '#9CA3AF'} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            {/* Register link */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="font-inter text-sm text-gray-500">New to Kerala Mobility? </Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Register')}>
                <Text className="font-inter-semibold text-sm text-[#0B6E4F]">Register</Text>
              </TouchableOpacity>
            </View>

            {/* Legal */}
            <View className="px-4">
              <Text className="font-inter text-[11px] text-gray-400 text-center leading-4">
                By proceeding, you consent to receive transactional SMS updates and agree to our{' '}
                <Text className="underline font-inter-medium">Terms of Service</Text> and{' '}
                <Text className="underline font-inter-medium">Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
