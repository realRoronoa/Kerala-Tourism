import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  onMenuPress?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function Header({
  onMenuPress,
  showSearch = true,
  searchPlaceholder = 'Search trips, routes, or services',
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'ML'>('EN');
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');

  const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Trip Auto-Logged', desc: 'Your bus trip from Kaloor to Vyttila has been securely logged.', time: '10 mins ago', icon: 'check-circle', color: '#0B6E4F' },
    { id: 2, title: 'Weather Advisory', desc: 'Heavy rain expected in Kochi. Transit routes may be delayed.', time: '2 hours ago', icon: 'cloud-rain', color: '#1D4ED8' },
    { id: 3, title: 'Welcome to Kerala Mobility', desc: 'Start tracking your government transit records.', time: '1 day ago', icon: 'shield', color: '#C89B3C' },
  ];

  const handleNotification = () => {
    setIsNotificationsOpen(true);
  };

  const handleLanguage = () => {
    setLang((prev) => (prev === 'EN' ? 'ML' : 'EN'));
  };

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') {
      alert("Voice search is only supported in web browsers.");
      return;
    }

    // Use Web Speech API for React Native Web
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return; // The API will auto-stop when we don't call start()
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === 'EN' ? 'en-US' : 'ml-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setSearchText('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("Microphone access was denied. Please allow microphone access to use voice search.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <View className="bg-kerala-green" style={{ paddingTop: insets.top }}>
      {/* Top row */}
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Wordmark */}
        <Text className="font-inter-bold text-lg text-white tracking-wide">
          Kerala Mobility
        </Text>

        {/* Right icons */}
        <View className="flex-row items-center gap-3">
          {/* Notification bell */}
          <TouchableOpacity
            onPress={handleNotification}
            className="w-9 h-9 rounded-full bg-kerala-gold items-center justify-center"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Language toggle */}
          <TouchableOpacity
            onPress={handleLanguage}
            className="w-9 h-9 rounded-full bg-kerala-green items-center justify-center border-2 border-white/50"
            accessibilityLabel="Language toggle"
          >
            <Text className="font-inter-bold text-[11px] text-white">{lang}</Text>
          </TouchableOpacity>

          {/* Profile / Hamburger */}
          <TouchableOpacity
            onPress={onMenuPress || (() => setIsSettingsOpen(true))}
            className="w-9 h-9 rounded-full bg-kerala-green items-center justify-center border-2 border-white/50"
            accessibilityLabel="Open menu"
          >
            <Feather name="user" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View className="px-4 pb-3">
          <View className="flex-row items-center bg-white rounded-card px-3 py-2.5">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={isListening ? "Listening..." : searchPlaceholder}
              placeholderTextColor={isListening ? "#0B6E4F" : "#9CA3AF"}
              className="flex-1 ml-2 font-inter text-sm text-gray-800 outline-none"
              style={{ padding: 0, outlineStyle: 'none' } as any}
            />
            <TouchableOpacity onPress={handleVoiceSearch} className="px-1 py-1" activeOpacity={0.7}>
              <Feather 
                name={isListening ? "mic" : "mic"} 
                size={18} 
                color={isListening ? "#DC2626" : "#6B7280"} 
                style={isListening ? { opacity: 0.8 } : {}}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notifications Modal */}
      <Modal visible={isNotificationsOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity className="flex-1" onPress={() => setIsNotificationsOpen(false)} activeOpacity={1} />
          <View className="bg-white rounded-t-3xl min-h-[300px] p-5 pb-8" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10 }}>
            <View className="flex-row justify-between items-center mb-5">
              <Text className="font-inter-bold text-xl text-gray-900">Alerts & Notifications</Text>
              <TouchableOpacity onPress={() => setIsNotificationsOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MOCK_NOTIFICATIONS.map((n) => (
                <View key={n.id} className="flex-row items-center p-3.5 mb-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <View className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-200">
                    <Feather name={n.icon as any} size={18} color={n.color} />
                  </View>
                  <View className="flex-1 ml-3.5">
                    <Text className="font-inter-semibold text-sm text-gray-900">{n.title}</Text>
                    <Text className="font-inter text-xs text-gray-500 mt-0.5 leading-4">{n.desc}</Text>
                    <Text className="font-inter text-[10px] text-gray-400 mt-1">{n.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* User Settings Modal */}
      <Modal visible={isSettingsOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity className="flex-1" onPress={() => setIsSettingsOpen(false)} activeOpacity={1} />
          <View className="bg-white rounded-t-3xl p-5 pb-8" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10 }}>
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="font-inter-bold text-xl text-gray-900">Adarsh</Text>
                <Text className="font-inter text-sm text-gray-500 mt-1">+91 98765 43210</Text>
              </View>
              <TouchableOpacity onPress={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View className="gap-2">
              <TouchableOpacity 
                className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                activeOpacity={0.7}
              >
                <Feather name="user" size={18} color="#374151" />
                <Text className="font-inter-semibold text-sm text-gray-900 ml-3 flex-1">My Profile</Text>
                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                activeOpacity={0.7}
                onPress={() => {
                  setIsSettingsOpen(false);
                  (navigation as any).navigate('Privacy');
                }}
              >
                <Feather name="shield" size={18} color="#374151" />
                <Text className="font-inter-semibold text-sm text-gray-900 ml-3 flex-1">Privacy Center</Text>
                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 mt-2 bg-red-50 rounded-xl border border-red-100"
                activeOpacity={0.7}
                onPress={() => {
                  setIsSettingsOpen(false);
                  (navigation as any).reset({ index: 0, routes: [{ name: 'Login' }] });
                }}
              >
                <Feather name="log-out" size={18} color="#DC2626" />
                <Text className="font-inter-semibold text-sm text-red-600 ml-3">Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
