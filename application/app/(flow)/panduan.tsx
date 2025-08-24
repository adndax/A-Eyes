import React, { useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

type Step = {
  key: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    key: 'device-check',
    title: 'Pemeriksaan Perangkat',
    subtitle: 'Pastikan kacamata menyala dan terhubung',
    cta: 'Mulai Pemeriksaan Perangkat',
    icon: <Octicons name="checklist" size={28} color="#FFFFFF" />,
  },
  {
    key: 'audio-test',
    title: 'Tes Audio Spasial',
    subtitle: 'Dengarkan petunjuk arah dari berbagai sisi',
    cta: 'Mulai Tes Audio Spasial',
    icon: <Ionicons name="volume-high" size={30} color="#FFFFFF" />,
  },
  {
    key: 'vibration-test',
    title: 'Tes Getaran',
    subtitle: 'Rasakan pola getaran untuk berbagai situasi',
    cta: 'Mulai Tes Getaran',
    icon: <MaterialCommunityIcons name="vibrate" size={30} color="#FFFFFF" />,
  },
  {
    key: 'navigation-sim',
    title: 'Simulasi Navigasi',
    subtitle: 'Praktik navigasi dalam ruangan yang aman',
    cta: 'Mulai Simulasi Navigasi',
    icon: <Ionicons name="navigate" size={28} color="#FFFFFF" />,
  },
];

export default function Panduan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<boolean[]>(new Array(STEPS.length).fill(false));
  const [finished, setFinished] = useState(false);

  const total = STEPS.length;
  const step = STEPS[stepIndex];

  const completedCount = done.filter(Boolean).length;
  const percent = Math.round((completedCount / total) * 100);

  const progressWidth = useMemo(() => {
    return (completedCount / total) * 100;
  }, [completedCount, total]);

  function markStepDone() {
    if (!done[stepIndex]) {
      const copy = [...done];
      copy[stepIndex] = true;
      setDone(copy);
    }
  }

  function onNext() {
    if (stepIndex === total - 1 && done[stepIndex]) {
      setFinished(true);
      return;
    }
    if (!done[stepIndex]) return;
    if (stepIndex < total - 1) setStepIndex(i => i + 1);
  }

  function onPrev() {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  }

  if (finished) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 36, alignItems: 'center' }}
          style={{ paddingHorizontal: 20, paddingTop: insets.top + 120 }}
        >
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontWeight: '600',
              fontSize: 24,
              lineHeight: 24,
              color: '#272829',
              textAlign: 'center',
            }}
          >
            Panduan Awal Selesai!
          </Text>

          <View style={{ marginTop: 32, width: 180, height: 180, borderRadius: 60, backgroundColor: '#44525B', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="human-handsup" size={140} color="#FFFFFF" />
          </View>

          <Text style={{ fontFamily: 'Poppins-Medium', marginTop: 36, lineHeight: 22, fontSize: 16, color: '#111827', textAlign: 'center' }}>
            A-Eyes siap digunakan.{'\n'}Saatnya bergerak bebas dan percaya diri!
          </Text>

          <View style={styles.navRow}>
          <Pressable
            style={[styles.navBtn, styles.ghostBtn]}
            onPress={() => router.back()}
          >
            <Text style={styles.ghostBtnText}>Kembali ke Beranda</Text>
          </Pressable>

          <Pressable
            style={[
              styles.navBtn, styles.primaryDark
            ]}
            onPress={() => router.push('/olahraga')}
          >
            <Text style={styles.primaryDarkText}>
              Mulai Olahraga
            </Text>
          </Pressable>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        style={{ paddingHorizontal: 20, paddingTop: insets.top + 16 }}
      >
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontWeight: '600',
              fontSize: 22,
              lineHeight: 24,
              color: '#272829',
            }}
          >
            Panduan Awal
          </Text>

          <Text style={{ fontFamily: 'Poppins-Medium', marginTop: 6, fontSize: 13, color: '#272829' }}>
            Langkah {stepIndex + 1} dari {total}
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
          </View>
          <Text style={styles.progressText}>{percent}% selesai</Text>
        </View>

        <View style={styles.card}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.iconCircle}>
              {step.icon}
            </View>

            <Text
              style={{
                marginTop: 16,
                fontFamily: 'Poppins-SemiBold',
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 24,
                color: '#000000',
                textAlign: 'center',
              }}
            >
              {step.title}
            </Text>

            <Text style={{ marginTop: 6, fontSize: 12, color: '#535C60', textAlign: 'center' }}>
              {step.subtitle}
            </Text>

            <Pressable
              style={[done[stepIndex] ? styles.primaryMuted : styles.primaryDark, { marginTop: 16, alignSelf: 'stretch' }]}
              onPress={markStepDone}
            >
              <Text style={done[stepIndex] ? styles.primaryMutedText : styles.primaryDarkText}>
                {done[stepIndex] ? `${step.title} Selesai` : step.cta}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.navRow}>
          <Pressable
            style={[styles.navBtn, styles.ghostBtn, stepIndex === 0 && { opacity: 1.0 }]}
            disabled={stepIndex === 0}
            onPress={onPrev}
          >
            <Text style={styles.ghostBtnText}>← Sebelumnya</Text>
          </Pressable>

          <Pressable
            style={[
              styles.navBtn,
              done[stepIndex] ? styles.primaryDark : styles.nextDisabled,
            ]}
            disabled={!done[stepIndex]}
            onPress={onNext}
          >
            <Text style={done[stepIndex] ? styles.primaryDarkText : styles.nextDisabledText}>
              Selanjutnya →
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 32 }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 13, color: '#111827' }}>
            Lewati Panduan
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 999,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#272829',
    borderRadius: 999,
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
    fontSize: 11,
    color: '#707070',
    textAlign: 'center',
  },

  card: {
    marginTop: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#DADADA',
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 34,
    backgroundColor: '#44525B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  primaryDark: {
    borderRadius: 8,
    backgroundColor: '#272829',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDarkText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    fontWeight: '600',
  },

  primaryMuted: {
    borderRadius: 8,
    backgroundColor: '#878B94',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryMutedText: {
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  nextDisabled: {
    borderRadius: 8,
    backgroundColor: '#878B94',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDisabledText: {
    fontFamily: 'Poppins-Medium',
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },

  navBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginHorizontal: 4,
  },

  ghostBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  ghostBtnText: {
    fontFamily: 'Poppins-Medium',
    color: '#8C8C8C',
    fontSize: 13,
    fontWeight: '500',
  },
});
