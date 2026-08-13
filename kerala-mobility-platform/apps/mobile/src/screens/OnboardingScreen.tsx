import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle, Defs, Mask, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    key: '1',
    title: 'Easy Access to Every Trip',
    bg: '#E3F5EC',
    // Phone with checklist + side badges
    Illustration: () => (
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* Background Badge */}
        <Circle cx="100" cy="100" r="90" fill="#C8E8D5" />
        <Circle cx="100" cy="100" r="70" fill="#AEE0C2" opacity="0.4" />
        
        {/* Center Phone */}
        <Rect x="70" y="40" width="60" height="120" rx="8" fill="#FFFFFF" stroke="#1B4332" strokeWidth="4" />
        {/* Phone screen content (Checklist) */}
        <Rect x="80" y="55" width="40" height="8" rx="2" fill="#E5E7EB" />
        <Rect x="80" y="75" width="25" height="4" rx="2" fill="#9CA3AF" />
        <Rect x="80" y="85" width="35" height="4" rx="2" fill="#D1D5DB" />
        <Rect x="80" y="100" width="30" height="4" rx="2" fill="#9CA3AF" />
        <Rect x="80" y="110" width="20" height="4" rx="2" fill="#D1D5DB" />
        
        {/* Checkmarks */}
        <Circle cx="115" cy="79" r="4" fill="#0B6E4F" />
        <Circle cx="115" cy="104" r="4" fill="#0B6E4F" />
        
        {/* Floating Badges */}
        {/* Left Bus Badge */}
        <Circle cx="45" cy="90" r="22" fill="#0B6E4F" />
        <Path d="M35 90 L55 90 M35 85 L55 85 M40 95 L50 95" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="42" cy="100" r="3" fill="#FFFFFF" />
        <Circle cx="48" cy="100" r="3" fill="#FFFFFF" />
        
        {/* Right Shield Badge */}
        <Circle cx="155" cy="115" r="22" fill="#0B6E4F" />
        <Path d="M155 105 L145 110 L145 120 C145 125 155 130 155 130 C155 130 165 125 165 120 L165 110 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
        <Path d="M150 118 L154 122 L160 114" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    key: '2',
    title: 'Secure, Verified Trip Records',
    bg: '#FBF1DD',
    // Folder + Stamp Document
    Illustration: () => (
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* Background Badge */}
        <Circle cx="100" cy="100" r="90" fill="#F1DFB7" />
        
        {/* Folder Back */}
        <Path d="M50 70 L90 70 L100 85 L160 85 L160 150 L50 150 Z" fill="#374151" />
        
        {/* White Document */}
        <Rect x="70" y="60" width="70" height="90" rx="2" fill="#FFFFFF" transform="rotate(-5 105 105)" />
        <Rect x="85" y="75" width="40" height="4" rx="2" fill="#D1D5DB" transform="rotate(-5 105 105)" />
        <Rect x="85" y="85" width="30" height="4" rx="2" fill="#D1D5DB" transform="rotate(-5 105 105)" />
        <Rect x="85" y="95" width="35" height="4" rx="2" fill="#D1D5DB" transform="rotate(-5 105 105)" />
        
        {/* Verified Stamp */}
        <Circle cx="115" cy="125" r="14" fill="none" stroke="#0B6E4F" strokeWidth="2" transform="rotate(-5 105 105)" />
        <Path d="M108 125 L113 130 L122 118" fill="none" stroke="#0B6E4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-5 105 105)" />
        
        {/* Folder Front */}
        <Path d="M40 150 L60 95 L170 95 L150 150 Z" fill="#0B6E4F" />
      </Svg>
    ),
  },
  {
    key: '3',
    title: 'Track Fares & Discover Routes',
    bg: '#E4F1F6',
    // Phone + Magnifying Glass
    Illustration: () => (
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* Background Badge */}
        <Circle cx="100" cy="100" r="90" fill="#C3E0EC" />
        
        {/* Phone */}
        <Rect x="70" y="40" width="60" height="120" rx="8" fill="#FFFFFF" stroke="#1B4332" strokeWidth="4" />
        {/* Phone Content (Routes) */}
        <Rect x="85" y="60" width="30" height="4" rx="2" fill="#D1D5DB" />
        <Rect x="85" y="75" width="30" height="4" rx="2" fill="#D1D5DB" />
        <Rect x="85" y="90" width="30" height="4" rx="2" fill="#D1D5DB" />
        <Circle cx="78" cy="62" r="3" fill="#1B4332" />
        <Circle cx="78" cy="77" r="3" fill="#1B4332" />
        <Circle cx="78" cy="92" r="3" fill="#1B4332" />

        {/* Magnifying Glass */}
        <Circle cx="110" cy="100" r="22" fill="none" stroke="#0B6E4F" strokeWidth="6" />
        <Path d="M125 115 L150 140" fill="none" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
        <Circle cx="110" cy="100" r="14" fill="#E4F1F6" opacity="0.6" />
      </Svg>
    ),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setActiveIndex)(index);
    },
  });

  const handleNext = (index: number) => {
    if (index === ONBOARDING_DATA.length - 1) {
      (navigation as any).replace('Login');
    } else {
      scrollRef.current?.scrollTo({ x: (index + 1) * SCREEN_WIDTH, animated: true });
    }
  };

  const handleSkip = () => {
    (navigation as any).replace('Login');
  };

  const isLast = activeIndex === ONBOARDING_DATA.length - 1;

  return (
    <View className="flex-1 bg-white">
      {/* Background Color Transition Layer */}
      {ONBOARDING_DATA.map((item, index) => {
        const bgStyle = useAnimatedStyle(() => {
          const opacity = interpolate(
            scrollX.value,
            [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
            [0, 1, 0],
            Extrapolation.CLAMP
          );
          return { opacity, backgroundColor: item.bg };
        });

        return <Animated.View key={`bg-${item.key}`} style={[StyleSheet.absoluteFillObject, bgStyle]} />;
      })}

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {ONBOARDING_DATA.map((item, index) => {
          return (
            <View key={item.key} style={{ width: SCREEN_WIDTH }} className="items-center justify-start pt-24">
              {/* Illustration Badge */}
              <View className="w-64 h-64 justify-center items-center">
                <item.Illustration />
              </View>

              {/* Headline */}
              <Text className="font-inter-bold text-[19px] text-[#1F2937] text-center mt-12 px-8">
                {item.title}
              </Text>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Bottom Controls */}
      <View style={{ paddingBottom: Math.max(insets.bottom, 24) }} className="absolute bottom-0 w-full px-6 pt-4 bg-transparent">
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-8 gap-2.5">
          {ONBOARDING_DATA.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollX.value,
                [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                [0.4, 1, 0.4],
                Extrapolation.CLAMP
              );
              return { opacity };
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                style={[dotStyle, { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1F2937' }]}
              />
            );
          })}
        </View>

        {/* Dynamic CTA Button - Matched corner radius to reference */}
        <TouchableOpacity
          onPress={() => handleNext(activeIndex)}
          className="bg-[#0B6E4F] w-full h-12 rounded-xl items-center justify-center flex-row"
          activeOpacity={0.8}
        >
          <Text className="font-inter-bold text-base text-white">
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Skip Link - Matched reference style */}
        <View className="items-center mt-4">
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} className="py-2 px-6">
            <Text className="font-inter-bold text-[15px] text-[#1F2937]">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
