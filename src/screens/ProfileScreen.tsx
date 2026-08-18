import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import PrimaryButton from '../components/PrimaryButton';
import FloatingTabBar, { TabName } from '../components/FloatingTabBar';
import { OnboardingStorage } from '../services/onboardingStorage';

// ─── Settings list rows ───────────────────────────────────────────────────────
const SETTINGS_ROWS = [
  { id: 'edit_profile',  icon: 'person-outline' as const,        label: 'Edit Profile',   sub: 'Name, mobile & personal details' },
  { id: 'interests',     icon: 'heart-outline' as const,         label: 'Interests',      sub: 'Manage preferred Kerala experiences' },
  { id: 'notifications', icon: 'notifications-outline' as const, label: 'Notifications',  sub: 'Transit alerts & route schedules' },
  { id: 'help',          icon: 'help-circle-outline' as const,   label: 'Help & Support', sub: 'Transit helplines & FAQs' },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState('Arun Kumar');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [shareDataWithNatpac, setShareDataWithNatpac] = useState(false); // Default OFF

  function handleRowPress(id: string) {
    if (id === 'edit_profile') {
      setProfileModalVisible(true);
    } else if (id === 'interests') {
      navigation.navigate('OnboardingInterests', {
        purpose: OnboardingStorage.getAnswers().purpose,
      });
    } else if (id === 'notifications') {
      Alert.alert(
        'Transit Notifications',
        'Real-time departure alerts and route change notifications are enabled.',
        [{ text: 'OK' }]
      );
    } else if (id === 'help') {
      setHelpModalVisible(true);
    }
  }

  function handleLearnMorePrivacy() {
    Alert.alert(
      'Data Sharing with NATPAC',
      'Your travel telemetry is aggregated and strictly anonymized. NATPAC (National Transportation Planning and Research Centre) utilizes these counts solely for optimizing public transit routes, reducing congestion, and tourism corridor planning across Kerala. No personal identifiers (name, mobile, email) are ever attached or shared.',
      [{ text: 'Understood' }]
    );
  }

  function handleTabPress(tab: TabName) {
    if (tab === 'Profile') return;
    if (tab === 'CenterAction') {
      navigation.navigate('Home');
      return;
    }
    navigation.navigate(tab);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exploro</Text>
          <Avatar initials="AK" size={34} />
        </View>

        {/* Avatar block (Interactive Edit) */}
        <TouchableOpacity
          style={styles.avatarBlock}
          activeOpacity={0.8}
          onPress={() => setProfileModalVisible(true)}
        >
          <View style={styles.avatarWrap}>
            <Avatar initials="AK" size={72} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userMobile}>{mobile}</Text>
          <Text style={styles.tapToEdit}>Tap to edit profile</Text>
        </TouchableOpacity>

        {/* ─── Settings list card ─────────────────────────── */}
        <View style={styles.menuCard}>
          {SETTINGS_ROWS.map((item, idx) => (
            <React.Fragment key={item.id}>
              <Pressable
                style={styles.menuRow}
                onPress={() => handleRowPress(item.id)}
                android_ripple={{ color: Colors.iconBg }}
              >
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon} size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={16} color={Colors.textLight} />
              </Pressable>
              {idx < SETTINGS_ROWS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ─── Privacy & NATPAC Planning Card ─────────────── */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeaderRow}>
            <View style={styles.privacyIconWrap}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>
                Your trips help Kerala plan better transport
              </Text>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              Share anonymized travel data with NATPAC
            </Text>
            <Switch
              value={shareDataWithNatpac}
              onValueChange={(val) => {
                setShareDataWithNatpac(val);
                if (val) {
                  Alert.alert(
                    'Anonymized Sharing Enabled',
                    'Thank you for contributing to Kerala’s sustainable mobility planning!'
                  );
                }
              }}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={styles.learnMoreBtn}
            onPress={handleLearnMorePrivacy}
            hitSlop={6}
          >
            <Text style={styles.learnMoreText}>Learn more about data privacy →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Exploro v1.0.0 · Expo SDK 54</Text>
        <Text style={styles.trustLine}>Secured by Government of Kerala · NATPAC</Text>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ─── Edit Profile Modal ────────────────────────────── */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setProfileModalVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={Colors.primary} />
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <TextInput
                style={styles.inputField}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>

            <PrimaryButton
              title="Save Changes"
              onPress={() => {
                setProfileModalVisible(false);
                Alert.alert('Profile Updated', 'Your profile details have been saved successfully.');
              }}
              style={{ marginTop: 14 }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* ─── Help & Support Modal ─────────────────────────── */}
      <Modal
        visible={helpModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setHelpModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <TouchableOpacity
                onPress={() => setHelpModalVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.helpSub}>Kerala Transit Emergency Helplines</Text>

            <TouchableOpacity
              style={styles.helplineRow}
              onPress={() => Alert.alert('Calling KSRTC Control Room: 1800 599 4011')}
            >
              <Ionicons name="bus-outline" size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.helplineTitle}>KSRTC Control Room</Text>
                <Text style={styles.helplineNum}>1800 599 4011 (Toll-Free)</Text>
              </View>
              <Ionicons name="call" size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helplineRow}
              onPress={() => Alert.alert('Calling Kochi Metro Helpline: 1800 425 0345')}
            >
              <Ionicons name="train-outline" size={20} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.helplineTitle}>Kochi Metro Customer Care</Text>
                <Text style={styles.helplineNum}>1800 425 0345 (24x7)</Text>
              </View>
              <Ionicons name="call" size={18} color={Colors.primary} />
            </TouchableOpacity>

            <PrimaryButton
              title="Close"
              onPress={() => setHelpModalVisible(false)}
              secondary
              style={{ marginTop: 16 }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* ─── Floating Tab bar ────────────────────────────── */}
      <FloatingTabBar activeTab="Profile" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },

  avatarBlock: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: { position: 'relative' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 12 },
  userMobile: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  tapToEdit: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 4 },

  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  menuSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Privacy Card
  privacyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  privacyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  privacyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  toggleLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
    marginRight: 12,
    lineHeight: 16,
  },
  learnMoreBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },

  versionText: { textAlign: 'center', fontSize: 11, color: Colors.textLight, marginBottom: 4 },
  trustLine: { textAlign: 'center', fontSize: 11, color: Colors.textLight, fontWeight: '600' },
  bottomPad: { height: 16 },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 8,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  helpSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.iconBg,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  helplineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  helplineNum: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
});
