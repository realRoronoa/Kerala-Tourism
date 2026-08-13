import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Rect, Defs, Pattern } from 'react-native-svg';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [mobile, setMobile] = useState('');

  const handleLogin = () => {
    if (mobile.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    (navigation as any).replace('MainTabs');
  };

  // Keep button active (green) by default or when valid. Only disabled when partially typed.
  const isButtonActive = mobile.length === 0 || mobile.length === 10;

  return (
    <View className="flex-1 bg-white">
      {/* Premium Subtle Geometric Background Pattern */}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingTop: Math.max(insets.top, 16), 
            paddingBottom: Math.max(insets.bottom, 24) 
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Navigation Row */}
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

          {/* Core Content Area - Pulled up closer to header with mt-12, removed flex-1 justify-center to pack it tightly */}
          <View className="px-6 mt-12">
            
            {/* Centered Brand Emblem */}
            <View className="items-center mb-6">
              {/* Removed shadow-sm for a flatter, cleaner look */}
              <View className="w-16 h-20 border-2 border-kerala-green rounded-2xl items-center justify-center bg-white mb-3">
                <Feather name="map-pin" size={32} color="#D9A441" />
              </View>
              <Text className="font-inter-bold text-3xl text-kerala-green tracking-tight text-center">
                Kerala Mobility
              </Text>
              <Text className="font-inter-semibold text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1 text-center">
                The Lifeline of Transit
              </Text>
            </View>

            {/* Headline and Instructions */}
            <View className="mb-6">
              <Text className="font-inter-bold text-2xl text-gray-900 mb-2 text-center">
                Enter Mobile Number
              </Text>
              <Text className="font-inter text-sm text-gray-500 leading-5 text-center px-4">
                We will send you a 6-digit One Time Password (OTP) to verify your account.
              </Text>
            </View>

            {/* Input Group with Premium Phone Format (+91 preset) */}
            <View className="mb-6">
              <Text className="font-inter-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-16 shadow-sm shadow-gray-100">
                {/* Indian Dial Code Box */}
                <View className="flex-row items-center pr-3 border-r border-gray-200">
                  <Text className="font-inter-medium text-base text-gray-500 mr-1.5">🇮🇳</Text>
                  <Text className="font-inter-semibold text-base text-gray-800">+91</Text>
                </View>
                {/* Text input */}
                <TextInput
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  className="flex-1 ml-4 font-inter-semibold text-base text-gray-800 h-full"
                  style={{ outlineStyle: 'none', padding: 0 }}
                />
                {mobile.length === 10 && (
                  <View className="w-6 h-6 rounded-full bg-kerala-green/10 items-center justify-center">
                    <Feather name="check" size={14} color="#0B6E4F" />
                  </View>
                )}
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className={`w-full h-14 rounded-2xl flex-row justify-center items-center mb-4 ${
                isButtonActive ? 'bg-[#0B6E4F]' : 'bg-gray-200'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`font-inter-bold text-base ${isButtonActive ? 'text-white' : 'text-gray-400'}`}>
                Get OTP
              </Text>
              <Feather 
                name="arrow-right" 
                size={18} 
                color={isButtonActive ? '#FFFFFF' : '#9CA3AF'} 
                style={{ marginLeft: 8 }} 
              />
            </TouchableOpacity>

            {/* Footer registration link */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="font-inter text-sm text-gray-500">New to Kerala Mobility? </Text>
              <TouchableOpacity onPress={() => alert('Feature coming soon')}>
                <Text className="font-inter-semibold text-sm text-[#0B6E4F]">Register</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Policy Notice - Anchored tightly below the Register link */}
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
