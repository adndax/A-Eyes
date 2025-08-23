import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Pressable,
  Alert 
} from 'react-native';
import { TrendingUp, Volume2, Calendar, Clock, MapPin, Activity, Dumbbell } from 'lucide-react-native';

interface WorkoutHistory {
  id: string;
  type: string;
  status: 'berhasil' | 'gagal';
  date: string;
  duration: string;
  distance: string;
  route: string;
}

interface Statistics {
  totalWorkouts: number;
  accuracyRate: string;
}

export default function RiwayatStatistikPage() {
  const [activeTab, setActiveTab] = useState<'olahraga' | 'latihan'>('olahraga');
  
  // Sample statistics data
  const [statistics] = useState<Statistics>({
    totalWorkouts: 2,
    accuracyRate: '80%'
  });

  // Sample workout history data
  const [workoutHistory] = useState<WorkoutHistory[]>([
    {
      id: '1',
      type: 'Jalan Santai',
      status: 'berhasil',
      date: '2024-01-10',
      duration: '25 menit',
      distance: '1,2 km',
      route: 'Rute Taman',
    },
    {
      id: '2',
      type: 'Jalan Cepat',
      status: 'berhasil',
      date: '2024-01-09',
      duration: '18 menit',
      distance: '1,5 km',
      route: 'Rute Perumahan',
    },
    {
      id: '3',
      type: 'Lari',
      status: 'gagal',
      date: '2024-01-08',
      duration: '15 menit',
      distance: '0,8 km',
      route: 'Rute Track',
    },
  ]);

  const handlePlaySummary = () => {
    Alert.alert('Ringkasan Audio', 'Memutar ringkasan aktivitas olahraga Anda...');
  };

  const handlePlayWorkoutAudio = (workoutType: string) => {
    Alert.alert('Audio Workout', `Memutar audio untuk ${workoutType}`);
  };

  const renderStatisticsCard = () => (
    <View style={styles.statisticsCard}>
      <View style={styles.statisticsHeader}>
        <TrendingUp size={24} color="#374151" />
        <Text style={styles.statisticsTitle}>Statistik Keseluruhan</Text>
      </View>
      
      <View style={styles.statisticsContent}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Olahraga Berhasil</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.accuracyRate}</Text>
          <Text style={styles.statLabel}>Rata-rata Akurasi</Text>
        </View>
      </View>
      
      <Pressable 
        style={styles.summaryButton}
        onPress={handlePlaySummary}
        android_ripple={{ color: '#E5E7EB' }}
      >
        <Volume2 size={20} color="#374151" />
        <Text style={styles.summaryButtonText}>Dengarkan Ringkasan</Text>
      </Pressable>
    </View>
  );

  const renderTabButtons = () => (
    <View style={styles.tabContainer}>
      <Pressable 
        style={[
          styles.tabButton, 
          activeTab === 'olahraga' ? styles.tabButtonActive : styles.tabButtonInactive
        ]}
        onPress={() => setActiveTab('olahraga')}
      >
        <Activity size={18} color={activeTab === 'olahraga' ? '#374151' : '#9CA3AF'} />
        <Text style={[
          styles.tabButtonText,
          activeTab === 'olahraga' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
        ]}>
          Olahraga
        </Text>
      </Pressable>
      
      <Pressable 
        style={[
          styles.tabButton, 
          activeTab === 'latihan' ? styles.tabButtonActive : styles.tabButtonInactive
        ]}
        onPress={() => setActiveTab('latihan')}
      >
        <Dumbbell size={18} color={activeTab === 'latihan' ? '#374151' : '#9CA3AF'} />
        <Text style={[
          styles.tabButtonText,
          activeTab === 'latihan' ? styles.tabButtonTextActive : styles.tabButtonTextInactive
        ]}>
          Latihan
        </Text>
      </Pressable>
    </View>
  );

  const renderWorkoutCard = (workout: WorkoutHistory) => (
    <View key={workout.id} style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutTitleContainer}>
          <Text style={styles.workoutType}>{workout.type}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: workout.status === 'berhasil' ? '#48814C' : '#D02A2A' }
          ]}>
            <Text style={styles.statusText}>
              {workout.status === 'berhasil' ? 'Berhasil' : 'Perlu Perbaikan'}
            </Text>
          </View>
        </View>
        
        <Pressable 
          style={styles.audioButton}
          onPress={() => handlePlayWorkoutAudio(workout.type)}
          android_ripple={{ color: '#E5E7EB' }}
        >
          <Volume2 size={20} color="#6B7280" />
        </Pressable>
      </View>
      
      <View style={styles.workoutDetails}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>{workout.date}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>{workout.duration} • {workout.distance}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>{workout.route}</Text>
        </View>
      </View>
    </View>
  );

  const renderWorkoutHistory = () => (
    <View style={styles.historyContainer}>
      {activeTab === 'olahraga' ? (
        workoutHistory.length > 0 ? (
          workoutHistory.map(renderWorkoutCard)
        ) : (
          <View style={styles.emptyState}>
            <Activity size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>Belum ada riwayat olahraga</Text>
          </View>
        )
      ) : (
        <View style={styles.emptyState}>
          <Dumbbell size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>Belum ada riwayat latihan</Text>
        </View>
      )}
    </View>
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
          <Text style={styles.pageTitle}>Riwayat & Statistik</Text>
          <Text style={styles.pageSubtitle}>
            Lihat progres aktivitas Anda
          </Text>
        </View>

        {/* Statistics Card */}
        {renderStatisticsCard()}

        {/* Tab Buttons */}
        {renderTabButtons()}

        {/* Workout History */}
        {renderWorkoutHistory()}
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
    paddingTop: 28,
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

  // Statistics Card Styles
  statisticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DADADA'
  },
  statisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statisticsTitle: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    color: '#374151',
    marginLeft: 8,
  },
  statisticsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'PoppinsSemiBold',
    color: '#48814C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryButton: {
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
  summaryButtonText: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#374151',
    marginLeft: 8,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    marginLeft: 6,
  },
  tabButtonTextActive: {
    color: '#374151',
  },
  tabButtonTextInactive: {
    color: '#9CA3AF',
  },

  // History Container Styles
  historyContainer: {
    paddingHorizontal: 20,
  },

  // Workout Card Styles
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DADADA'
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutType: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    color: '#111827',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  audioButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADADA',
    overflow: 'hidden',
  },
  workoutDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#575c68ff',
    marginLeft: 8,
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
});