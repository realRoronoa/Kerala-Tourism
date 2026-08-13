import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Rect, Defs, Pattern } from 'react-native-svg';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const isFormValid = name.trim().length > 1 && mobile.length === 10 && email.includes('@');

  const handleRegister = () => {
    if (!name.trim()) { alert('Please enter your full name.'); return; }
    if (mobile.length !== 10) { alert('Please enter a valid 10-digit mobile number.'); return; }
    if (!email.includes('@')) { alert('Please enter a valid email address.'); return; }
    // On success, go to MainTabs directly
    (navigation as any).replace('MainTabs');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Subtle Geometric Background */}
      <View className="absolute w-full h-full" style={{ opacity: 0.04 }} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="regGeoPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <Path d="M0 60 L60 0 H30 L0 30 Z M60 60 L0 0 V30 L30 60 Z" fill="#0B6E4F" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#regGeoPattern)" />
        </Svg>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 24),
          }}
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
            <Text className="font-inter-semibold text-sm text-gray-400">Create Account</Text>
          </View>

          {/* Content */}
          <View className="px-6 mt-10">

            {/* Brand Emblem */}
            <View className="items-center mb-6">
              <View className="w-16 h-20 border-2 border-kerala-green rounded-2xl items-center justify-center bg-white mb-3">
                <Feather name="user-plus" size={28} color="#D9A441" />
              </View>
              <Text className="font-inter-bold text-3xl text-kerala-green tracking-tight text-center">
                Kerala Mobility
              </Text>
              <Text className="font-inter-semibold text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1 text-center">
                The Lifeline of Transit
              </Text>
            </View>

            {/* Headline */}
            <View className="mb-6">
              <Text className="font-inter-bold text-2xl text-gray-900 mb-2 text-center">
                Create Your Account
              </Text>
              <Text className="font-inter text-sm text-gray-500 leading-5 text-center px-4">
                Register with your mobile number to start tracking your transit trips.
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-4">
              <Text className="font-inter-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14">
                <Feather name="user" size={18} color="#9CA3AF" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  className="flex-1 ml-3 font-inter text-base text-gray-800 h-full"
                  style={{ outlineStyle: 'none', padding: 0 } as any}
                />
                {name.trim().length > 1 && (
                  <View className="w-6 h-6 rounded-full bg-green-50 items-center justify-center">
                    <Feather name="check" size={13} color="#0B6E4F" />
                  </View>
                )}
              </View>
            </View>

            {/* Mobile Number */}
            <View className="mb-4">
              <Text className="font-inter-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14">
                <View className="flex-row items-center pr-3 border-r border-gray-200">
                  <Text className="font-inter-medium text-base text-gray-500 mr-1.5">🇮🇳</Text>
                  <Text className="font-inter-semibold text-base text-gray-800">+91</Text>
                </View>
                <TextInput
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  className="flex-1 ml-4 font-inter text-base text-gray-800 h-full"
                  style={{ outlineStyle: 'none', padding: 0 } as any}
                />
                {mobile.length === 10 && (
                  <View className="w-6 h-6 rounded-full bg-green-50 items-center justify-center">
                    <Feather name="check" size={13} color="#0B6E4F" />
                  </View>
                )}
              </View>
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="font-inter-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14">
                <Feather name="mail" size={18} color="#9CA3AF" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 font-inter text-base text-gray-800 h-full"
                  style={{ outlineStyle: 'none', padding: 0 } as any}
                />
                {email.includes('@') && email.includes('.') && (
                  <View className="w-6 h-6 rounded-full bg-green-50 items-center justify-center">
                    <Feather name="check" size={13} color="#0B6E4F" />
                  </View>
                )}
              </View>
            </View>

            {/* Register CTA */}
            <TouchableOpacity
              onPress={handleRegister}
              className={`w-full h-14 rounded-2xl flex-row justify-center items-center mb-4 ${
                isFormValid ? 'bg-[#0B6E4F]' : 'bg-gray-200'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`font-inter-bold text-base ${isFormValid ? 'text-white' : 'text-gray-400'}`}>
                Create Account
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={isFormValid ? '#FFFFFF' : '#9CA3AF'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>

            {/* Already have account */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="font-inter text-sm text-gray-500">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="font-inter-semibold text-sm text-[#0B6E4F]">Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Legal */}
            <View className="px-4">
              <Text className="font-inter text-[11px] text-gray-400 text-center leading-4">
                By registering, you agree to our{' '}
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
