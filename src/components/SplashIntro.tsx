import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// ─── Named Tunable Constants & Spacing ─────────────────────────────────────────
export const SPLASH_CONFIG = {
  APP_NAME: 'Exploro',
  TAGLINE_LINE_1: 'Travel with',
  TAGLINE_PREFIX: 'SuperP', // chars before morphed 'o'
  TAGLINE_SUFFIX: 'wers',   // chars after morphed 'o'
  
  // Colors
  BACKGROUND_COLOR: '#FFFFFF',
  TEXT_COLOR: '#0F1B2D',       // Deep Navy
  ACCENT_COLOR: '#0E8F5C',     // Brand Green
  CURSOR_BLOCK_COLOR: 'rgba(14, 143, 92, 0.25)',

  // Sizing
  APP_NAME_SIZE: 26,
  APP_NAME_LINE_HEIGHT: 30,
  TAGLINE_SIZE: 52,
  TAGLINE_LINE_HEIGHT: 58,
  ICON_SIZE: 44,

  // Tight Spacing Constants
  SPACING: {
    iconToName: 14,
    nameToUnderline: 8,
    underlineToTagline: 28,
    line1ToLine2: 4,
  },

  // Timings (in ms)
  LOGO_ENTER_DURATION: 300,
  CURSOR_APPEAR_DELAY: 300,
  LINE1_START_DELAY: 500,
  LINE1_CHAR_INTERVAL: 45,
  LINE2_START_DELAY: 1050,
  LINE2_CHAR_INTERVAL: 42,
  MORPH_START_DELAY: 1800,
  EXIT_DELAY: 2800,            // 2800ms: Everything fades out together as one unit
  EXIT_DURATION: 300,          // 300ms fade duration
};

export interface SplashIntroProps {
  onFinish?: () => void;
  loop?: boolean;
}

export default function SplashIntro({ onFinish, loop = false }: SplashIntroProps) {
  // ── Unified Container Exit Animation ─────────────────────────────────────────
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Squiggle underline reveal
  const squiggleAnim = useRef(new Animated.Value(0)).current;

  // Typewriter state
  const [line1Chars, setLine1Chars] = useState(0);
  const [line2Chars, setLine2Chars] = useState(0);

  // Cursor states
  const [cursorType, setCursorType] = useState<'none' | 'block' | 'thin'>('none');
  const [thinCursorVisible, setThinCursorVisible] = useState(false);

  // Morph states
  const [isMorphFilled, setIsMorphFilled] = useState(false);
  const checkmarkScale = useRef(new Animated.Value(0.6)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  function runSequence() {
    setLine1Chars(0);
    setLine2Chars(0);
    setCursorType('none');
    setThinCursorVisible(false);
    setIsMorphFilled(false);
    checkmarkScale.setValue(0.6);
    checkmarkOpacity.setValue(0);
    containerOpacity.setValue(1);

    // 0–300ms: Squiggle underline animates
    Animated.timing(squiggleAnim, {
      toValue: 1,
      duration: SPLASH_CONFIG.LOGO_ENTER_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 300–500ms: Highlight block cursor appears
    const cursorAppearTimer = setTimeout(() => {
      setCursorType('block');
    }, SPLASH_CONFIG.CURSOR_APPEAR_DELAY);

    // 500–1000ms: Line 1 "Travel with" character-by-character
    const line1Full = SPLASH_CONFIG.TAGLINE_LINE_1;
    let l1Idx = 0;
    const line1Timer = setTimeout(() => {
      const l1Interval = setInterval(() => {
        l1Idx += 1;
        setLine1Chars(l1Idx);
        if (l1Idx >= line1Full.length) {
          clearInterval(l1Interval);
        }
      }, SPLASH_CONFIG.LINE1_CHAR_INTERVAL);
    }, SPLASH_CONFIG.LINE1_START_DELAY);

    // 1050–1500ms: Line 2 "SuperPowers" character-by-character
    const totalLine2Length = SPLASH_CONFIG.TAGLINE_PREFIX.length + 1 + SPLASH_CONFIG.TAGLINE_SUFFIX.length;
    let l2Idx = 0;
    const line2Timer = setTimeout(() => {
      const l2Interval = setInterval(() => {
        l2Idx += 1;
        setLine2Chars(l2Idx);
        if (l2Idx >= totalLine2Length) {
          clearInterval(l2Interval);
          setCursorType('thin');
          setThinCursorVisible(true);
        }
      }, SPLASH_CONFIG.LINE2_CHAR_INTERVAL);
    }, SPLASH_CONFIG.LINE2_START_DELAY);

    // Thin cursor blink interval (530ms)
    const blinkInterval = setInterval(() => {
      setThinCursorVisible((prev) => !prev);
    }, 530);

    // 1800–2200ms: Hollow ring fills solid green & checkmark scales in
    const morphTimer = setTimeout(() => {
      setCursorType('none');
      setIsMorphFilled(true);

      Animated.parallel([
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, SPLASH_CONFIG.MORPH_START_DELAY);

    // 2800ms: Everything fades out together as one unified block
    const exitTimer = setTimeout(() => {
      clearInterval(blinkInterval);

      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: SPLASH_CONFIG.EXIT_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (loop) {
          runSequence();
        } else if (onFinish) {
          onFinish();
        }
      });
    }, SPLASH_CONFIG.EXIT_DELAY);

    return () => {
      clearTimeout(cursorAppearTimer);
      clearTimeout(line1Timer);
      clearTimeout(line2Timer);
      clearInterval(blinkInterval);
      clearTimeout(morphTimer);
      clearTimeout(exitTimer);
    };
  }

  useEffect(() => {
    const cleanup = runSequence();
    return cleanup;
  }, []);

  const squiggleWidth = squiggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 88],
  });

  const prefixFull = SPLASH_CONFIG.TAGLINE_PREFIX; // "SuperP"
  const prefixTyped = prefixFull.slice(0, Math.min(line2Chars, prefixFull.length));
  const isRingVisible = line2Chars >= 7;
  const suffixTypedCount = Math.max(0, line2Chars - 7);
  const suffixTyped = SPLASH_CONFIG.TAGLINE_SUFFIX.slice(0, suffixTypedCount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* ── Top Spacer (0.8 flex) anchors content at 35-40% from top ── */}
        <View style={styles.topSpacer} />

        {/* ── Unified Animated Content Block (All Fades Together) ───── */}
        <Animated.View
          style={[
            styles.contentBlock,
            { opacity: containerOpacity },
          ]}
        >
          {/* Logo Badge + "Exploro" + Squiggle */}
          <View style={styles.logoContainer}>
            {/* Logo Badge (~64px) */}
            <View style={styles.logoBadge}>
              <Svg width={64} height={64} viewBox="0 0 64 64">
                <Rect
                  x="2"
                  y="2"
                  width="60"
                  height="60"
                  rx="18"
                  fill="#E8F5F0"
                  stroke="#C6E7D9"
                  strokeWidth="1.5"
                />
                <Circle
                  cx="32"
                  cy="32"
                  r="17"
                  stroke={SPLASH_CONFIG.ACCENT_COLOR}
                  strokeWidth="2.5"
                  strokeDasharray="24 50"
                  fill="none"
                />
                <Path
                  d="M32 18 L39 39 L32 34 L25 39 Z"
                  fill={SPLASH_CONFIG.ACCENT_COLOR}
                />
              </Svg>
            </View>

            {/* App Name: "Exploro" (26px font, 30px lineHeight) */}
            <Text style={styles.appName}>{SPLASH_CONFIG.APP_NAME}</Text>

            {/* Hand-drawn SVG Squiggle Underline */}
            <Animated.View style={[styles.squiggleWrap, { width: squiggleWidth }]}>
              <Svg width={88} height={8} viewBox="0 0 88 8">
                <Path
                  d="M 2 4 Q 22 1 44 5 T 86 3"
                  stroke={SPLASH_CONFIG.ACCENT_COLOR}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            </Animated.View>
          </View>

          {/* ── Tagline Block ─────────────────────────────────────────────────── */}
          <View style={styles.taglineBlock}>
            {/* Line 1: "Travel with" (52px font, 58px lineHeight) */}
            <View style={styles.line1Row}>
              <Text style={styles.taglineLine1}>
                {SPLASH_CONFIG.TAGLINE_LINE_1.slice(0, line1Chars)}
              </Text>
              {/* Highlight Block Cursor on Line 1 */}
              {cursorType === 'block' && line2Chars === 0 && (
                <View style={styles.highlightBlockCursor} />
              )}
            </View>

            {/* Line 2: "SuperP[✓]wers" (52px font, 58px lineHeight) */}
            <View style={styles.taglineLine2Row}>
              {/* 1. "SuperP" */}
              <Text style={styles.taglineLine2Text}>{prefixTyped}</Text>

              {/* 2. Hollow Ring Outline or Filled Checkmark Icon (44x44) */}
              {isRingVisible && (
                <View style={styles.iconInline}>
                  <Svg width={SPLASH_CONFIG.ICON_SIZE} height={SPLASH_CONFIG.ICON_SIZE} viewBox="0 0 44 44">
                    <Circle
                      cx="22"
                      cy="22"
                      r="19"
                      fill={isMorphFilled ? SPLASH_CONFIG.ACCENT_COLOR : 'none'}
                      stroke={SPLASH_CONFIG.ACCENT_COLOR}
                      strokeWidth={3.8}
                    />
                  </Svg>
                  {/* White checkmark scales & pops in on morph */}
                  {isMorphFilled && (
                    <Animated.View
                      style={[
                        StyleSheet.absoluteFill,
                        styles.checkmarkCenter,
                        {
                          opacity: checkmarkOpacity,
                          transform: [{ scale: checkmarkScale }],
                        },
                      ]}
                    >
                      <Svg width={26} height={26} viewBox="0 0 26 26">
                        <Path
                          d="M6 13.5 L11 18.5 L20 8.5"
                          stroke="#FFFFFF"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </Svg>
                    </Animated.View>
                  )}
                </View>
              )}

              {/* 3. "wers" */}
              {suffixTyped.length > 0 && (
                <Text style={styles.taglineLine2Text}>{suffixTyped}</Text>
              )}

              {/* Highlight Block Cursor trailing Line 2 */}
              {cursorType === 'block' && line2Chars > 0 && (
                <View style={styles.highlightBlockCursor} />
              )}

              {/* Thin Blinking Cursor Bar after typing finishes */}
              {cursorType === 'thin' && thinCursorVisible && (
                <View style={styles.thinCursor} />
              )}
            </View>
          </View>
        </Animated.View>

        {/* ── Bottom Spacer (1.4 flex) absorbs remaining bottom space ── */}
        <View style={styles.bottomSpacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SPLASH_CONFIG.BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: SPLASH_CONFIG.BACKGROUND_COLOR,
    paddingHorizontal: 24,
  },

  // Spacers for vertical anchor (~35-40% from top)
  topSpacer: {
    flex: 0.8,
  },
  bottomSpacer: {
    flex: 1.4,
  },

  contentBlock: {
    alignItems: 'center',
    width: '100%',
  },

  // Logo Block
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    marginBottom: SPLASH_CONFIG.SPACING.iconToName, // 14px
    shadowColor: SPLASH_CONFIG.ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  appName: {
    fontSize: SPLASH_CONFIG.APP_NAME_SIZE, // 26px
    lineHeight: SPLASH_CONFIG.APP_NAME_LINE_HEIGHT, // 30px explicit
    fontWeight: '800',
    color: SPLASH_CONFIG.TEXT_COLOR,
    letterSpacing: -0.6,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
    marginBottom: SPLASH_CONFIG.SPACING.nameToUnderline, // 8px
  },
  squiggleWrap: {
    height: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  // Tagline Block
  taglineBlock: {
    marginTop: SPLASH_CONFIG.SPACING.underlineToTagline, // 28px
    alignItems: 'center',
    width: '100%',
  },

  // Line 1
  line1Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPLASH_CONFIG.SPACING.line1ToLine2, // 4px
  },
  taglineLine1: {
    fontSize: SPLASH_CONFIG.TAGLINE_SIZE, // 52px
    lineHeight: SPLASH_CONFIG.TAGLINE_LINE_HEIGHT, // 58px explicit
    fontWeight: '800',
    color: SPLASH_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    letterSpacing: -1.2,
  },

  // Line 2
  taglineLine2Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineLine2Text: {
    fontSize: SPLASH_CONFIG.TAGLINE_SIZE, // 52px
    lineHeight: SPLASH_CONFIG.TAGLINE_LINE_HEIGHT, // 58px explicit
    fontWeight: '800',
    color: SPLASH_CONFIG.ACCENT_COLOR,
    letterSpacing: -1.2,
  },

  // Morph Icon (44x44 for 52px text)
  iconInline: {
    width: SPLASH_CONFIG.ICON_SIZE, // 44px
    height: SPLASH_CONFIG.ICON_SIZE,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cursors
  highlightBlockCursor: {
    width: 26,
    height: 48,
    backgroundColor: SPLASH_CONFIG.CURSOR_BLOCK_COLOR,
    borderRadius: 6,
    marginLeft: 4,
    alignSelf: 'center',
  },
  thinCursor: {
    width: 4,
    height: 46,
    backgroundColor: SPLASH_CONFIG.ACCENT_COLOR,
    borderRadius: 2,
    marginLeft: 4,
    alignSelf: 'center',
  },
});
