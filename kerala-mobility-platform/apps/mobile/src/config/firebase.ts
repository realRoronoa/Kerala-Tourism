import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

// ─── Firebase Web & Mobile SDK Configuration ──────────────────────────────
// Project: kerala-tourism-e36df
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyB0KYMvMIugDPoS-91KRaoiC3SVuxIucjI",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "kerala-tourism-e36df.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "kerala-tourism-e36df",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "kerala-tourism-e36df.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "364393472256",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:364393472256:web:98173baa17b2154c56d3e5",
  measurementId: "G-SH2N0H3VKX"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Global confirmation result reference for Phone Auth OTP
let _confirmationResult: ConfirmationResult | null = null;

/**
 * Setup Recaptcha Verifier for Web SMS Phone Auth
 */
export function setupRecaptcha(elementId: string): RecaptchaVerifier | null {
  try {
    if (typeof window !== 'undefined') {
      const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {},
      });
      return recaptchaVerifier;
    }
  } catch (err) {
    console.warn('[Firebase Recaptcha Warning]', err);
  }
  return null;
}

/**
 * Send real SMS OTP to phone number using Firebase Auth
 */
export async function sendRealFirebaseSmsOtp(
  phoneNumber: string,
  elementId: string = 'recaptcha-container'
): Promise<ConfirmationResult> {
  const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
  
  // Clear any existing window recaptcha verifier instance if any
  if (typeof window !== 'undefined') {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {}
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {},
    });
    (window as any).recaptchaVerifier = recaptchaVerifier;

    _confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    return _confirmationResult;
  }
  throw new Error('Browser window environment not available.');
}

/**
 * Verify real SMS OTP and return Firebase ID Token
 */
export async function verifyRealFirebaseOtp(otpCode: string): Promise<string> {
  if (!_confirmationResult) {
    throw new Error('No active OTP session found. Please request a new OTP.');
  }
  const userCredential = await _confirmationResult.confirm(otpCode);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
}
