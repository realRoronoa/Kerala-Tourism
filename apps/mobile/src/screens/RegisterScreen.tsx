import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Validation
  const isNameValid = fullName.trim().length >= 2;
  const rawDigits = mobile.replace(/\D/g, '').slice(0, 10);
  const isMobileValid = rawDigits.length === 10;
  const formattedMobile =
    rawDigits.length > 5
      ? `${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`
      : rawDigits;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isNameValid && isMobileValid && isEmailValid;

  function handleQuickFill() {
    setFullName('Arun Kumar');
    setMobile('9876543210');
    setEmail('arun.kumar@exploro.kerala.gov.in');
  }

  // Country prefix node for mobile field
  const CountryPrefix = (
    <View style={styles.countryPill}>
      <Text style={styles.countryCode}>🇮🇳 +91</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>  Back to Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Join Exploro today</Text>

        {/* ─── Form fields using reusable FormInput ─────────────────────── */}
        <FormInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Arun Kumar"
          autoCapitalize="words"
          isValid={isNameValid}
        />

        <FormInput
          label="Mobile Number"
          value={formattedMobile}
          onChangeText={(t) => setMobile(t)}
          keyboardType="phone-pad"
          placeholder="XXXXX XXXXX"
          maxLength={11}
          isValid={isMobileValid}
          prefix={CountryPrefix}
        />

        <FormInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          isValid={isEmailValid && email.length > 0}
        />

        <PrimaryButton
          title="Create Account"
          onPress={() => {
            if (canSubmit) navigation.replace('OnboardingPurpose');
          }}
          disabled={!canSubmit}
          style={styles.ctaBtn}
        />

        <PrimaryButton
          title="⚡ Quick Demo Fill"
          onPress={handleQuickFill}
          secondary
          style={{ marginBottom: 16 }}
        />

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

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
              By creating an account, you agree to our <Text style={{ color: Colors.primary, fontWeight: '700' }}>Terms of Service</Text> and <Text style={{ color: Colors.primary, fontWeight: '700' }}>Privacy Policy</Text>
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
  inner: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  backArrow: { fontSize: 20, color: Colors.primary },
  backLabel: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  heading: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  subheading: { fontSize: 14, color: Colors.textMuted, marginBottom: 28 },

  countryPill: {
    paddingRight: 12,
    paddingVertical: 2,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    marginRight: 12,
  },
  countryCode: { fontSize: 14, fontWeight: '600', color: Colors.text },

  ctaBtn: { marginTop: 8, marginBottom: 12 },

  linkRow: { alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 14, color: Colors.textMuted },
  linkBold: { fontWeight: '700', color: Colors.primary },

  footer: { marginTop: 24, alignItems: 'center' },
  legalText: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 8,
  },
  trustLine: { fontSize: 11, color: Colors.textLight, fontWeight: '600' },
});
