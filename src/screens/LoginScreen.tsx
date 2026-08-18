import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

type Step = 'mobile' | 'otp';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState<Step>('mobile');
  const [rawDigits, setRawDigits] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidMobile = rawDigits.length === 10;
  const formattedMobile =
    rawDigits.length > 5
      ? `${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`
      : rawDigits;

  function handleMobileChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setRawDigits(digits);
  }

  function startTimer() {
    setTimer(30);
    setCanResend(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleGetOtp() {
    if (!isValidMobile) return;
    setOtp('123456'); // Pre-fill mock OTP for smooth testing
    setStep('otp');
    startTimer();
  }

  function handleQuickDemo() {
    setRawDigits('9876543210');
    setOtp('123456');
    setStep('otp');
    startTimer();
  }

  function handleResend() {
    if (!canResend) return;
    setOtp('123456');
    startTimer();
    Alert.alert('OTP Sent', 'A fresh OTP (123456) has been dispatched to your mobile number.');
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── OTP step ─────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back row */}
          <TouchableOpacity style={styles.backRow} onPress={() => setStep('mobile')}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>  +91 {formattedMobile || '98765 43210'}</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Enter OTP</Text>
          <Text style={styles.subheading}>
            6-digit code sent to +91 {formattedMobile || '98765 43210'}
          </Text>

          {/* OTP input */}
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="• • • • • •"
            placeholderTextColor={Colors.textLight}
            textAlign="center"
          />

          {/* Timer / Resend */}
          <View style={styles.timerRow}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendActive}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend in{' '}
                <Text style={styles.timerBold}>{timer}s</Text>
              </Text>
            )}
          </View>

          <PrimaryButton
            title="Verify & Continue"
            onPress={() => {
              if (otp.length === 6) {
                navigation.replace('OnboardingPurpose');
              }
            }}
            disabled={otp.length < 6}
          />

          <View style={styles.footer}>
            <Text style={styles.trustLine}>
              Secured by Government of Kerala · NATPAC
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ─── Mobile step ───────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to Exploro</Text>

        {/* Mobile input */}
        <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
        <View
          style={[
            styles.mobileRow,
            isValidMobile && styles.mobileRowValid,
          ]}
        >
          {/* Country pill */}
          <View style={styles.countryPill}>
            <Text style={styles.countryCode}>🇮🇳 +91</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Number input */}
          <TextInput
            style={styles.mobileInput}
            value={formattedMobile}
            onChangeText={handleMobileChange}
            keyboardType="phone-pad"
            placeholder="XXXXX XXXXX"
            placeholderTextColor={Colors.textLight}
            maxLength={11}
          />

          {/* Checkmark */}
          {isValidMobile && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <PrimaryButton
          title="Get OTP"
          onPress={handleGetOtp}
          disabled={!isValidMobile}
          style={styles.ctaBtn}
        />

        {/* Quick Demo Button */}
        <PrimaryButton
          title="⚡ Quick Demo Login (1-Tap)"
          onPress={handleQuickDemo}
          secondary
          style={{ marginBottom: 16 }}
        />

        {/* Register link */}
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>
            New to Exploro?{' '}
            <Text style={styles.linkBold}>Register</Text>
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Terms & Privacy',
                'Exploro is secured under the Kerala State Transport Department and NATPAC digital governance standards.'
              )
            }
          >
            <Text style={styles.legalText}>
              By continuing, you agree to our <Text style={{ color: Colors.primary, fontWeight: '700' }}>Terms of Service</Text> and <Text style={{ color: Colors.primary, fontWeight: '700' }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.trustLine}>
            Secured by Government of Kerala · NATPAC
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  inner: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 40 },

  heading: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subheading: { fontSize: 14, color: Colors.textMuted, marginBottom: 32 },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 20,
    overflow: 'hidden',
  },
  mobileRowValid: { borderColor: Colors.primary },

  countryPill: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.iconBg,
  },
  countryCode: { fontSize: 14, fontWeight: '600', color: Colors.text },

  divider: { width: 1, height: 24, backgroundColor: Colors.border },

  mobileInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    letterSpacing: 1.5,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
    marginRight: 14,
  },

  ctaBtn: { marginBottom: 12 },

  linkRow: { alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 14, color: Colors.textMuted },
  linkBold: { fontWeight: '700', color: Colors.primary },

  footer: { marginTop: 32, alignItems: 'center', paddingTop: 16 },
  legalText: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 8,
  },
  trustLine: { fontSize: 11, color: Colors.textLight, fontWeight: '600' },

  // OTP step
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backArrow: { fontSize: 20, color: Colors.primary },
  backLabel: { fontSize: 15, color: Colors.primary, fontWeight: '600' },

  otpInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 28,
    letterSpacing: 18,
    color: Colors.text,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },

  timerRow: { alignItems: 'center', marginBottom: 24 },
  timerText: { fontSize: 14, color: Colors.textMuted },
  timerBold: { fontWeight: '700', color: Colors.primary },
  resendActive: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
