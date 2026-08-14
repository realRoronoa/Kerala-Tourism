import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export default function CustomSplashScreen({ onFinish }: { onFinish: () => void }) {
  const insets = useSafeAreaInsets();

  // Animation Values
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.85);
  const nameOpacity = useSharedValue(0);
  const nameTranslateY = useSharedValue(8);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(8);
  
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    const easeOutCubic = Easing.out(Easing.cubic);
    
    // 0-400ms: Icon fades in + scales
    iconOpacity.value = withTiming(1, { duration: 400, easing: easeOutCubic });
    iconScale.value = withTiming(1, { duration: 400, easing: easeOutCubic });

    // 200-600ms: Name fades in + slides up
    nameOpacity.value = withDelay(200, withTiming(1, { duration: 400, easing: easeOutCubic }));
    nameTranslateY.value = withDelay(200, withTiming(0, { duration: 400, easing: easeOutCubic }));

    // 400-800ms: Tagline fades in + slides up
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 400, easing: easeOutCubic }));
    taglineTranslateY.value = withDelay(400, withTiming(0, { duration: 400, easing: easeOutCubic }));

    // 1600-2000ms: Cross-fade out the entire splash screen
    setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) });
      containerScale.value = withTiming(1.05, { duration: 400, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (finished && onFinish) {
          runOnJS(onFinish)();
        }
      });
    }, 1600);
  }, []);

  // Animated Styles
  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  // Colors based on requested design system
  const PRIMARY_GREEN = '#1B4332';
  const ACCENT_GOLD = '#C89B3C';
  const MUTED_GRAY = '#6B7280';

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Abstract Bottom Skyline Graphic (Kerala Motif) */}
      <View style={styles.skylineWrapper}>
        <Svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
          {/* Abstract Backwaters / Hills / Trees in low opacity primary green */}
          <Path
            d="M0,150 Q50,130 100,160 T200,140 T300,170 T400,130 L400,200 L0,200 Z"
            fill={PRIMARY_GREEN}
            opacity={0.08}
          />
          <Path
            d="M0,180 Q80,150 160,170 T320,160 T400,180 L400,200 L0,200 Z"
            fill={PRIMARY_GREEN}
            opacity={0.12}
          />
          {/* Coconut Palm abstract hints */}
          <Path
            d="M50,160 Q60,100 80,90 Q70,110 50,160 Z M55,160 Q40,110 20,105 Q40,120 55,160 Z"
            fill={PRIMARY_GREEN}
            opacity={0.1}
          />
          <Path
            d="M350,170 Q340,110 320,100 Q330,120 350,170 Z M345,170 Q360,120 380,115 Q360,130 345,170 Z"
            fill={PRIMARY_GREEN}
            opacity={0.1}
          />
          {/* Abstract Houseboat / Bus motif on the water line */}
          <Path
            d="M180,155 L240,155 L230,140 L190,140 Z M195,140 Q210,130 225,140 Z"
            fill={PRIMARY_GREEN}
            opacity={0.1}
          />
        </Svg>
      </View>

      {/* Main Content Group - Biased slightly above center */}
      <View style={styles.contentGroup}>
        
        {/* Animated Icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            {/* Rounded Square Base */}
            <Rect x={0} y={0} width={100} height={100} rx={16} fill={PRIMARY_GREEN} />
            {/* Map Pin / Location Graphic in Gold */}
            <Path
              d="M50 25 C38.954 25 30 33.954 30 45 C30 59 50 75 50 75 C50 75 70 59 70 45 C70 33.954 61.046 25 50 25 Z"
              fill="none"
              stroke={ACCENT_GOLD}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx={50} cy={45} r={6} fill={ACCENT_GOLD} />
            {/* Subtle Road/Route Line */}
            <Path
              d="M35 55 Q 50 65 65 55"
              fill="none"
              stroke={ACCENT_GOLD}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* Animated App Name */}
        <Animated.Text style={[styles.appName, { color: PRIMARY_GREEN }, nameStyle]}>
          Kerala Mobility
        </Animated.Text>

        {/* Animated Tagline */}
        <Animated.Text style={[styles.tagline, { color: MUTED_GRAY }, taglineStyle]}>
          Your Transit. Verified.
        </Animated.Text>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
  skylineWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '22%',
  },
  contentGroup: {
    flex: 1,
    alignItems: 'center',
    // Bias content above center (around 38-42% mark visually)
    paddingTop: '35%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    marginBottom: 16,
    // Explicitly NO drop shadow as per requirements
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});
