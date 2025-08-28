import React from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SesiSelesai() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    durasi?: string;
    jarakKm?: string;
    status?: string;
    panduan?: string;
    mode?: string;
    rute?: string;
  }>();

  const durasi = params.durasi ?? '15:00';
  const jarakKm = params.jarakKm ?? '1,2';
  const status = params.status ?? 'aktif & stabil';
  const panduan = params.panduan ?? 'ON';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: 28, alignItems: 'center' }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Sesi Olahraga Selesai!</Text>

        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="human-handsup" size={150} color="#2E3942" />
        </View>

        <Text style={styles.thanks}>
          Terima kasih telah bergerak bersama{'\n'}A-Eyes. Sampai jumpa di sesi{'\n'}berikutnya!
        </Text>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statCol}>
              <Ionicons name="time-outline" size={18} color="#2E3942" />
              <Text style={styles.statLabel}>Durasi: <Text style={styles.statValue}>{durasi} menit</Text></Text>
            </View>
            <View style={styles.statCol}>
              <Ionicons name="location" size={18} color="#2E3942" />
              <Text style={styles.statLabel}>Jarak: <Text style={styles.statValue}>{jarakKm} km</Text></Text>
            </View>
          </View>

          <View style={[styles.statRow, { marginTop: 14 }]}>
            <View style={styles.statCol}>
              <MaterialCommunityIcons name="pulse" size={18} color="#2E3942" />
              <Text style={styles.statLabel}>Status: <Text style={styles.statValue}>{status}</Text></Text>
            </View>
            <View style={styles.statCol}>
              <Ionicons name="navigate-outline" size={18} color="#2E3942" />
              <Text style={styles.statLabel}>Panduan: <Text style={styles.statValue}>{panduan}</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.btnRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={[styles.navBtn, styles.ghostBtn]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="home-outline" size={16} color="#111827" />
              <Text style={styles.ghostBtnText}>Kembali ke Beranda</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/(tabs)/riwayat')}
            style={[styles.navBtn, styles.darkBtn]}
          >
            <View style={{ backgroundColor:"transparent", flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="history" size={18} color="#FFFFFF" />
              <Text style={styles.darkBtnText}>Lihat Riwayat</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 23,
    color: '#272829',
    textAlign: 'center',
  },
  heroIcon: {
    marginTop: 22,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thanks: {
    fontFamily: 'PoppinsMedium',
    marginTop: 16,
    fontSize: 15,
    color: '#272829',
    textAlign: 'center',
  },

  statsCard: {
    marginTop: 18,
    alignSelf: 'stretch',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCol: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { fontSize: 13.5, color: '#111827' },
  statValue: { fontWeight: '600' },

  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'stretch',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginHorizontal: 4,
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#FFFFFF',
  },
  ghostBtnText: { color: '#272829', fontSize: 12, fontWeight: '600' },
  darkBtn: { backgroundColor: '#272829' },
  darkBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600'},
});