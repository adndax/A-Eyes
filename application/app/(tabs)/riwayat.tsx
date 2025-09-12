import React, { useState } from 'react';
import * as Speech from 'expo-speech';
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
  totalDistance: string;
}

export default function RiwayatStatistikPage() {
  const [activeTab, setActiveTab] = useState<'olahraga' | 'latihan'>('olahraga');
  const [speakingWorkoutId, setSpeakingWorkoutId] = useState<string | null>(null);
  const [speakingSummary, setSpeakingSummary] = useState(false);

  const [statistics] = useState<Statistics>({
    totalWorkouts: 2,
    totalDistance: '3,5 km'
  });

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

  const getIndonesianVoice = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.language})`));
      
      const indonesianVoice = voices.find(voice => 
        voice.language === 'id-ID' || 
        voice.language === 'id' || 
        voice.name.toLowerCase().includes('indonesian') ||
        voice.name.toLowerCase().includes('indonesia')
      );
      
      return indonesianVoice?.identifier || null;
    } catch (error) {
      console.log('Error getting voices:', error);
      return null;
    }
  };

  const handlePlayWorkoutAudio = async (workout: WorkoutHistory) => {
    if (speakingWorkoutId) {
      Speech.stop();
      if (speakingWorkoutId === workout.id) {
        setSpeakingWorkoutId(null);
        return;
      }
    }

    setSpeakingWorkoutId(workout.id);

    const statusText = workout.status === 'berhasil' ? 'berhasil' : 'perlu perbaikan';
    const speechText = `
      Aktivitas ${workout.type}, status ${statusText}. 
      Tanggal ${workout.date}. 
      Durasi ${workout.duration}, jarak ${workout.distance}. 
      ${workout.route}.
    `.trim();

    try {
      const indonesianVoiceId = await getIndonesianVoice();
    
      const speechOptions: any = {
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setSpeakingWorkoutId(null),
        onStopped: () => setSpeakingWorkoutId(null),
        onError: () => setSpeakingWorkoutId(null),
      };

      // Use Indonesian voice if available
      if (indonesianVoiceId) {
        speechOptions.voice = indonesianVoiceId;
        console.log('Using Indonesian voice:', indonesianVoiceId);
      } else {
        // Fallback to language code
        speechOptions.language = 'id-ID';
        console.log('Using language fallback: id-ID');
      }

      await Speech.speak(speechText, speechOptions);
    } catch (error) {
      console.error('Speech error:', error);
      setSpeakingWorkoutId(null);
    }
  };

  const handlePlaySummary = async () => {
    // Stop any current speech
    if (speakingSummary) {
      Speech.stop();
      setSpeakingSummary(false);
      return;
    }

    // Stop individual workout speech if playing
    if (speakingWorkoutId) {
      Speech.stop();
      setSpeakingWorkoutId(null);
    }

    setSpeakingSummary(true);

    try {
      const totalActivities = workoutHistory.length;
      const successfulActivities = workoutHistory.filter(w => w.status === 'berhasil').length;
      const failedActivities = totalActivities - successfulActivities;
      const successRate = totalActivities > 0 ? Math.round((successfulActivities / totalActivities) * 100) : 0;

      const summaryParts = [
        "Ringkasan aktivitas olahraga Anda.",
        
        totalActivities > 0 
          ? `Total ${totalActivities} aktivitas telah dilakukan.`
          : "Belum ada aktivitas yang tercatat.",
        
        successfulActivities > 0 
          ? `${successfulActivities} aktivitas berhasil diselesaikan.`
          : "",
        
        failedActivities > 0 
          ? `${failedActivities} aktivitas memerlukan perbaikan.`
          : "",
        
        totalActivities > 0 
          ? `Tingkat keberhasilan Anda adalah ${successRate} persen.`
          : "",

        successRate >= 80 
          ? "Kinerja Anda sangat baik! Pertahankan konsistensi ini."
          : successRate >= 60
          ? "Kinerja Anda cukup baik. Terus tingkatkan untuk hasil yang lebih optimal."
          : totalActivities > 0
          ? "Mari tingkatkan kinerja Anda pada aktivitas selanjutnya."
          : "Mulai aktivitas olahraga pertama Anda untuk membangun kebiasaan sehat."
      ];

      const speechText = summaryParts.filter(part => part.trim() !== "").join(" ");

      const indonesianVoiceId = await getIndonesianVoice();
      
      const speechOptions: any = {
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setSpeakingSummary(false),
        onStopped: () => setSpeakingSummary(false),
        onError: () => setSpeakingSummary(false),
      };

      if (indonesianVoiceId) {
        speechOptions.voice = indonesianVoiceId;
      } else {
        speechOptions.language = 'id-ID';
      }

      await Speech.speak(speechText, speechOptions);

    } catch (error) {
      console.error('Summary speech error:', error);
      setSpeakingSummary(false);
      Alert.alert('Error', 'Gagal memutar ringkasan audio');
    }
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
          <Text style={styles.statNumber}>{statistics.totalDistance}</Text>
          <Text style={styles.statLabel}>Total Jarak Tempuh</Text>
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
          style={[
            styles.audioButton,
            speakingWorkoutId === workout.id && styles.audioButtonActive
          ]}
          onPress={() => handlePlayWorkoutAudio(workout)}
          android_ripple={{ color: '#E5E7EB' }}
        >
          <Volume2 
            size={20} 
            color={speakingWorkoutId === workout.id ? '#48814C' : '#6B7280'} 
          />
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
    fontSize: 12,
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
    borderRadius: 12,
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

  audioButtonActive: {
    backgroundColor: '#F0F9F0', // Light green background when active
    borderWidth: 1,
    borderColor: '#48814C',
  },
  summaryButtonActive: {
    backgroundColor: '#F0F9F0',
    borderColor: '#48814C',
  },
  summaryButtonTextActive: {
    color: '#48814C',
  },
});