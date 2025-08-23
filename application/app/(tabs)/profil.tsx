import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Pressable,
  Switch,
  Alert 
} from 'react-native';
import { 
  Ionicons 
} from '@expo/vector-icons';

interface ProfileData {
  name: string;
  age: number;
}

interface DeviceStatus {
  battery: number;
  connected: boolean;
  firmware: string;
}

interface Settings {
  detectionSensitivity: number;
  speechSpeed: number;
  vibrationIntensity: number;
  autoAnnouncement: boolean;
  securityReminders: boolean;
}

export default function ProfilPengaturanPage() {
  // State management
  const [profileData] = useState<ProfileData>({
    name: 'Elios',
    age: 18
  });

  const [deviceStatus] = useState<DeviceStatus>({
    battery: 78,
    connected: true,
    firmware: '2.1.4'
  });

  const [settings, setSettings] = useState<Settings>({
    detectionSensitivity: 75,
    speechSpeed: 80,
    vibrationIntensity: 60,
    autoAnnouncement: true,
    securityReminders: true,
  });

  const [speechGender, setSpeechGender] = useState<'female' | 'male'>('female');

  // Handler functions
  const handleReadProfile = () => {
    Alert.alert('Baca Profil', 'Membacakan informasi profil Anda...');
  };

  const handleReconnectDevice = () => {
    Alert.alert('Hubungkan Ulang', 'Menghubungkan ulang perangkat...');
  };

  const handleCheckUpdate = () => {
    Alert.alert('Cek Update', 'Memeriksa update firmware terbaru...');
  };

  const handleSliderChange = (key: keyof Settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSwitchChange = (key: keyof Settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Aplikasi',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: () => Alert.alert('Logout', 'Anda telah keluar dari aplikasi')
        },
      ]
    );
  };

  const getSensitivityLabel = (value: number) => {
    if (value <= 33) return 'Kurang Sensitif';
    if (value <= 66) return 'Sedang';
    return 'Sangat Sensitif';
  };

  const getSpeedLabel = (value: number) => {
    if (value <= 33) return 'Lambat';
    if (value <= 66) return 'Sedang';
    return 'Cepat';
  };

  const getVibrationLabel = (value: number) => {
    if (value <= 33) return 'Lemah';
    if (value <= 66) return 'Sedang';
    return 'Kuat';
  };

  // Render functions
  const renderProfileSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="person" size={24} color="#374151" />
        <Text style={styles.sectionTitle}>Informasi Profil</Text>
      </View>
      
      <View style={styles.profileInfo}>
        <View style={styles.profileRow}>
          <View style={styles.profileItem}>
            <Text style={styles.infoLabel}>Nama</Text>
            <Text style={styles.infoValue}>{profileData.name}</Text>
          </View>
          
          <View style={styles.profileItem}>
            <Text style={styles.infoLabel}>Usia</Text>
            <Text style={styles.infoValue}>{profileData.age}</Text>
          </View>
        </View>
      </View>

      <Pressable 
        style={styles.actionButton}
        onPress={handleReadProfile}
        android_ripple={{ color: '#E5E7EB' }}
      >
        <Ionicons name="volume-high-outline" size={20} color="#374151" />
        <Text style={styles.actionButtonText}>Baca Profil</Text>
      </Pressable>
    </View>
  );

  const renderDeviceStatus = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="phone-portrait" size={24} color="#374151" />
        <Text style={styles.sectionTitle}>Status Perangkat</Text>
      </View>

      <View style={styles.deviceStatusContainer}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons name="battery-half" size={20} color="#48814C" />
            <Text style={styles.statusText}>Baterai: {deviceStatus.battery}%</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="bluetooth" size={20} color={deviceStatus.connected ? '#48814C' : '#D02A2A'} />
            <Text style={styles.statusText}>
              {deviceStatus.connected ? 'Terhubung' : 'Terputus'}
            </Text>
          </View>
        </View>

        <View style={styles.firmwareInfo}>
          <Text style={styles.firmwareLabel}>Versi Firmware</Text>
          <Text style={styles.firmwareVersion}>{deviceStatus.firmware}</Text>
        </View>

        <View style={styles.deviceActions}>
          <Pressable 
            style={styles.deviceActionButton}
            onPress={handleReconnectDevice}
            android_ripple={{ color: 'rgba(66, 133, 244, 0.1)' }}
          >
            <Ionicons name="flash" size={16} color="#6B7280" />
            <Text style={styles.deviceActionText}>Hubungkan Ulang</Text>
          </Pressable>

          <Pressable 
            style={[styles.deviceActionButton, styles.deviceActionButton]}
            onPress={handleCheckUpdate}
            android_ripple={{ color: '#E5E7EB' }}
          >
            <Ionicons name="refresh" size={16} color="#6B7280" />
            <Text style={[styles.deviceActionText, styles.deviceActionText]}>Cek Update</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderSlider = (
    label: string, 
    value: number, 
    onValueChange: (value: number) => void,
    getLabel: (value: number) => string
  ) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderWrapper}>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${value}%` }]} />
          <View style={[styles.sliderThumb, { left: `${value - 2}%` }]} />
        </View>
      </View>
      <Text style={styles.sliderValue}>{value}% - {getLabel(value)}</Text>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="settings" size={24} color="#374151" />
        <Text style={styles.sectionTitle}>Pengaturan</Text>
      </View>

      {/* Detection Sensitivity */}
      {renderSlider(
        'Sensitivitas Deteksi Rintangan',
        settings.detectionSensitivity,
        (value) => handleSliderChange('detectionSensitivity', value),
        getSensitivityLabel
      )}

      {/* Speech Settings */}
      <Text style={styles.subsectionTitle}>Pengaturan Suara</Text>
      
      {renderSlider(
        'Kecepatan Bicara',
        settings.speechSpeed,
        (value) => handleSliderChange('speechSpeed', value),
        getSpeedLabel
      )}

      {/* Voice Gender Selection */}
      <View style={styles.voiceGenderContainer}>
        <Pressable 
          style={[
            styles.voiceButton, 
            speechGender === 'female' ? styles.voiceButtonActive : styles.voiceButtonInactive
          ]}
          onPress={() => setSpeechGender('female')}
        >
          <Text style={[
            styles.voiceButtonText,
            speechGender === 'female' ? styles.voiceButtonTextActive : styles.voiceButtonTextInactive
          ]}>
            Suara Perempuan
          </Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.voiceButton, 
            speechGender === 'male' ? styles.voiceButtonActive : styles.voiceButtonInactive
          ]}
          onPress={() => setSpeechGender('male')}
        >
          <Text style={[
            styles.voiceButtonText,
            speechGender === 'male' ? styles.voiceButtonTextActive : styles.voiceButtonTextInactive
          ]}>
            Suara Laki-laki
          </Text>
        </Pressable>
      </View>

      {/* Vibration Intensity */}
      {renderSlider(
        'Intensitas Getaran',
        settings.vibrationIntensity,
        (value) => handleSliderChange('vibrationIntensity', value),
        getVibrationLabel
      )}

      {/* Toggle Settings */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Pengumuman Otomatis</Text>
          <Switch
            value={settings.autoAnnouncement}
            onValueChange={(value) => handleSwitchChange('autoAnnouncement', value)}
            trackColor={{ false: '#E5E7EB', true: '#272829' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#E5E7EB"
          />
        </View>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Peringatan Keamanan</Text>
          <Switch
            value={settings.securityReminders}
            onValueChange={(value) => handleSwitchChange('securityReminders', value)}
            trackColor={{ false: '#E5E7EB', true: '#272829' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#E5E7EB"
          />
        </View>
      </View>
    </View>
  );

  const renderLogoutButton = () => (
    <Pressable 
      style={styles.logoutButton}
      onPress={handleLogout}
      android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}
    >
      <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
      <Text style={styles.logoutButtonText}>Keluar dari Aplikasi</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profil & Pengaturan</Text>
          <Text style={styles.pageSubtitle}>
            Kelola pengaturan dan informasi akun Anda
          </Text>
        </View>

        {/* Profile Section */}
        {renderProfileSection()}

        {/* Device Status Section */}
        {renderDeviceStatus()}

        {/* Settings Section */}
        {renderSettingsSection()}

        {/* Logout Button */}
        {renderLogoutButton()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#6B7280',
    lineHeight: 24,
  },

  // Section Card Styles
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    color: '#374151',
    marginLeft: 8,
  },

  // Profile Info Styles
  profileInfo: {
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  profileItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
  },

  // Action Button Styles
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
    marginLeft: 8,
  },

  // Device Status Styles
  deviceStatusContainer: {
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
    marginLeft: 8,
  },
  firmwareInfo: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  firmwareLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#6B7280',
    marginBottom: 4,
  },
  firmwareVersion: {
    fontSize: 12,
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
  },
  deviceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deviceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  deviceActionText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
    marginLeft: 6,
  },

  // Settings Styles
  subsectionTitle: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 14,
  },

  // Slider Styles
  sliderContainer: {
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: 'PoppinsSemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  sliderWrapper: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#272829',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#272829',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderValue: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
  },

  // Voice Gender Styles
  voiceGenderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  voiceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#272829',
  },
  voiceButtonInactive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voiceButtonText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
  },
  voiceButtonTextActive: {
    color: '#FFFFFF',
  },
  voiceButtonTextInactive: {
    color: '#6B7280',
  },

  // Toggle Styles
  toggleContainer: {
    marginTop: 20,
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
    flex: 1,
  },

  // Logout Button Styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D02A2A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});