import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function SesiOlahraga() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string; rute?: string }>();

  const mode = params.mode ?? 'Jalan Cepat';
  const rute = params.rute ?? 'Rute Taman';
  const router = useRouter();

  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);

  const distanceRef = useRef(0);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) {
        setSeconds((s) => s + 1);
        distanceRef.current += 1.33;
        setDistance(distanceRef.current);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const durMMSS = formatMMSS(seconds);
  const distanceKm = useMemo(() => (distance / 1000).toFixed(1).replace('.', ','), [distance]);

  const onTogglePause = () => setPaused((p) => !p);
  const onFinish = () => {
    router.replace({
      pathname: '/olahragaSelesai',
      params: {
        durasi: durMMSS,
        jarakKm: distanceKm,
        status: paused ? 'aktif & jeda' : 'aktif & stabil',
        panduan: 'ON',
        mode,
        rute,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: insets.top + 120, paddingBottom: 28 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sedang Berolahraga</Text>
          <Text style={styles.timer}>{durMMSS}</Text>
          <Text style={styles.subline}>{mode} - {rute}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusCol}>
              <MaterialCommunityIcons name="pulse" size={22} color="#2E3942" />
              <Text style={styles.statusLabel}>Status: <Text style={styles.statusOk}>Aktif</Text></Text>
            </View>

            <View style={styles.statusCol}>
              <Ionicons name="navigate-outline" size={22} color="#2E3942" />
              <Text style={styles.statusLabel}>Panduan: <Text style={styles.statusOk}>ON</Text></Text>
            </View>
          </View>

          <Pressable style={[styles.btn, styles.btnDark]} onPress={onTogglePause}>
            <View style={styles.btnRow}>
              <MaterialCommunityIcons name={paused ? 'play' : 'pause'} size={16} color="#FFFFFF" />
              <Text style={styles.btnDarkText}>{paused ? 'Lanjut' : 'Jeda'}</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnGreen]} onPress={onFinish}>
            <View style={styles.btnRow}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.btnGreenText}>Selesai</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DADADA',
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 20,
    color: '#272829',
    textAlign: 'center',
  },
  timer: {
    marginTop: 10,
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 32,
    color: '#000000',
    textAlign: 'center',
  },
  subline: {
    fontFamily: 'PoppinsMedium',
    marginTop: 4,
    fontSize: 12,
    color: '#535C60',
    textAlign: 'center',
  },
  statusRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCol: { alignItems: 'center', flex: 1 },
  statusLabel: { marginTop: 6, fontSize: 12, color: '#000000' },
  statusOk: { fontFamily: 'PoppinsMedium', color: '#48814C', fontWeight: '500' },

  btn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: "transparent" },

  btnDark: { backgroundColor: '#272829' },
  btnDarkText: { fontFamily: 'PoppinsMedium', color: '#FFFFFF', fontSize: 16, fontWeight: '500'},

  btnGreen: { backgroundColor: '#48814C' },
  btnGreenText: { fontFamily: 'PoppinsMedium', color: '#FFFFFF', fontSize: 16, fontWeight: '500'},
});
