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
  { key: 'cepat',  title: 'Jalan Cepat',  subtitle: 'Kecepatan sedang, aktif' },
  { key: 'lari',   title: 'Lari',         subtitle: 'Kecepatan tinggi, intensif' },
];

const ROUTES: Option[] = [
  { key: 'taman',      title: 'Rute Taman',        subtitle: 'Jalur taman dengan trek rata',  chip: '15–30 menit' },
  { key: 'perumahan',  title: 'Rute Perumahan',    subtitle: 'Jalur sekitar perumahan',       chip: '20–40 menit' },
  { key: 'track',      title: 'Rute Track',        subtitle: 'Jalur atletik standar',         chip: '10–20 menit' },
  { key: 'custom',     title: 'Buat Rute Sendiri', subtitle: 'Tentukan jalur sesuai keinginan', chip: 'Bebas' },
];

export default function Latihan() {
  const insets = useSafeAreaInsets();
  const [activity, setActivity] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  const ready = useMemo(() => Boolean(activity && route), [activity, route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 28 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <Text style={styles.title}>Mulai Olahraga</Text>
          <Text style={styles.subtitle}>Pilih mode dan rute olahraga Anda</Text>
        </View>

        {/* Card: Pilih Mode Aktivitas */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="pulse" size={20} color="#111827" />
            <Text style={styles.cardHeaderText}>Pilih Mode Aktivitas</Text>
          </View>

          <View style={{ marginTop: 12 }}>
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
                  <View style={styles.optionIconBox}>
                    <MaterialCommunityIcons
                      name="run"
                      size={18}
                      color={selected ? '#FFFFFF' : '#111827'}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
                      {opt.title}
                    </Text>
                    <Text style={[styles.optionSubtitle, selected && styles.optionSubtitleSelected]}>
                      {opt.subtitle}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Card: Pilih Rute Olahraga */}
        <View style={[styles.card, { marginTop: 18 }]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={20} color="#111827" />
            <Text style={styles.cardHeaderText}>Pilih Rute Olahraga</Text>
          </View>

          <View style={{ marginTop: 12 }}>
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
                    <Text style={[styles.routeTitle, selected && styles.routeTitleSelected]}>
                      {opt.title}
                    </Text>
                    <Text style={[styles.routeSubtitle, selected && styles.routeSubtitleSelected]}>
                      {opt.subtitle}
                    </Text>

                    {/* duration chip */}
                    {opt.chip && (
                      <View style={[styles.chip, selected && styles.chipSelected]}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={selected ? '#E5E7EB' : '#4B5563'}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                          {opt.chip}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA */}
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

/* ================= STYLES ================ */
const styles = StyleSheet.create({
  title: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 24,
    color: '#272829',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  card: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderText: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionRowSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    color: '#6B7280',
  },
  optionTitleSelected: { color: '#FFFFFF' },
  optionSubtitleSelected: { color: '#E5E7EB' },

  routeRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  routeRowSelected: {
    backgroundColor: '#2E3942', // slightly lighter than full black for contrast
    borderColor: '#2E3942',
  },
  routeTitle: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    fontSize: 13.5,
    color: '#111827',
  },
  routeSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  routeTitleSelected: { color: '#FFFFFF' },
  routeSubtitleSelected: { color: '#E5E7EB' },

  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2F7',
  },
  chipSelected: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#E5E7EB',
  },

  cta: {
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: '#9CA3AF',
  },
  ctaEnabled: {
    backgroundColor: '#111827',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
  },
  ctaTextDisabled: {
    color: '#111827',
  },
  ctaTextEnabled: {
    color: '#FFFFFF',
  },
});