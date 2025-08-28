import React, { useMemo, useState } from 'react';
import { StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Option = {
  key: string;
  title: string;
  subtitle: string;
  chip?: string;
};

const ACTIVITY: Option[] = [
  { key: 'santai', title: 'Jalan Santai', subtitle: 'Kecepatan rendah, santai' },
  { key: 'cepat', title: 'Jalan Cepat', subtitle: 'Kecepatan sedang, aktif' },
  { key: 'lari', title: 'Lari', subtitle: 'Kecepatan tinggi, intensif' },
];

const ROUTES: Option[] = [
  { key: 'taman', title: 'Rute Taman', subtitle: 'Jalur taman dengan trek rata', chip: '15–30 menit' },
  { key: 'perumahan', title: 'Rute Perumahan', subtitle: 'Jalur sekitar perumahan', chip: '20–40 menit' },
  { key: 'track', title: 'Rute Track', subtitle: 'Jalur atletik standar', chip: '10–20 menit' },
  { key: 'custom', title: 'Buat Rute Sendiri', subtitle: 'Tentukan jalur sesuai keinginan', chip: 'Bebas' },
];

export default function MulaiOlahraga() {
  const insets = useSafeAreaInsets();
  const [activity, setActivity] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  const ready = useMemo(() => Boolean(activity && route), [activity, route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 28 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Text style={styles.title}>Mulai Olahraga</Text>
          <Text style={styles.subtitle}>Pilih mode dan rute olahraga Anda</Text>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="pulse" size={20} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.cardHeaderText}>Pilih Mode Aktivitas</Text>
          </View>

          {ACTIVITY.map((opt, idx) => {
            const selected = activity === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setActivity(opt.key)}
                style={[
                  styles.optionRow,
                  selected && styles.optionRowSelected,
                  idx !== ACTIVITY.length - 1 && { marginBottom: 10 },
                ]}
              >
                {/* Just the logo, no grey box */}
                <MaterialCommunityIcons
                  name="run"
                  size={20}
                  color={selected ? '#FFFFFF' : '#111827'}
                  style={{ marginRight: 12 }}
                />

                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{opt.title}</Text>
                  <Text style={[styles.optionSubtitle, selected && styles.optionSubtitleSelected]}>{opt.subtitle}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.card, { marginTop: 18 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="location-outline" size={20} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.cardHeaderText}>Pilih Rute Olahraga</Text>
          </View>

          {ROUTES.map((opt, idx) => {
            const selected = route === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setRoute(opt.key)}
                style={[
                  styles.routeRow,
                  selected && styles.routeRowSelected,
                  idx !== ROUTES.length - 1 && { marginBottom: 12 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.routeTitle, selected && styles.routeTitleSelected]}>{opt.title}</Text>
                  <Text style={[styles.routeSubtitle, selected && styles.routeSubtitleSelected]}>{opt.subtitle}</Text>

                  {opt.chip && (
                    <View style={[styles.chip, selected && styles.chipSelected]}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color="#2A363F"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.chip}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={[styles.cta, ready ? styles.ctaEnabled : styles.ctaDisabled]} disabled={!ready}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="play-circle-outline"
              size={18}
              color={ready ? '#FFFFFF' : '#111827'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.ctaText, ready ? styles.ctaTextEnabled : styles.ctaTextDisabled]}>
              Mulai Olahraga
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 30,
    color: '#272829',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#272829',
    textAlign: 'center',
  },

  card: {
    marginTop: 28,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#DADADA',
  },
  cardHeaderText: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DADADA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionRowSelected: {
    backgroundColor: '#2A363F',
    borderColor: '#2A363F',
  },
  optionTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
  },
  optionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#535C60',
  },
  optionTitleSelected: { color: '#FFFFFF' },
  optionSubtitleSelected: { color: '#FFFFFF' },

  routeRow: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DADADA',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  routeRowSelected: {
    backgroundColor: '#2A363F',
    borderColor: '#2A363F',
  },
  routeTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#2A363F',
  },
  routeSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#535C60',
  },
  routeTitleSelected: { color: '#FFFFFF' },
  routeSubtitleSelected: { color: '#FFFFFF' },

  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
  },
  chipSelected: {
    backgroundColor: '#F1F5F9',
  },
  chipText: {
    fontSize: 12,
    color: '#2A363F',
  },
  chipTextSelected: {
    color: '#2A363F',
  },

  cta: {
    marginTop: 22,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: '#878B94',
  },
  ctaEnabled: {
    backgroundColor: '#2A363F',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PoppinsMedium',
  },
  ctaTextDisabled: {
    color: '#FFFFFF',
  },
  ctaTextEnabled: {
    color: '#FFFFFF',
  },
});
