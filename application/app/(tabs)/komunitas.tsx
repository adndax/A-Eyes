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
import { Ionicons } from '@expo/vector-icons';

type UserStatus = 'online' | 'offline';

interface User {
  id: string;
  name: string;
  status: UserStatus;
  distance: string;
  location: string;
  lastSeen?: string;
}

export default function OlahragaBersamaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data - in real app this would come from API
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Andi',
      status: 'online',
      distance: '50m',
      location: 'Jalan Santai',
    },
    {
      id: '2',
      name: 'Sari',
      status: 'online',
      distance: '120m',
      location: 'Jalan Cepat',
    },
    {
      id: '3',
      name: 'Ken',
      status: 'offline',
      distance: 'Lari',
      location: '',
      lastSeen: '30 menit yang lalu',
    },
  ]);

  const filteredUsers = users;

  const handleSearchUsers = () => {
    Alert.alert(
      'Mencari Pengguna',
      'Mulai pencarian pengguna di sekitar Anda?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Cari', 
          onPress: () => {
            Alert.alert('Mencari...', 'Sedang mencari pengguna terdekat');
          }
        },
      ]
    );
  };

  const handleInviteUser = (user: User) => {
    Alert.alert(
      'Undang Partner',
      `Kirim undangan olahraga ke ${user.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Kirim', 
          onPress: () => Alert.alert('Berhasil', `Undangan terkirim ke ${user.name}`) 
        },
      ]
    );
  };

  const handleSelfTraining = () => {
    Alert.alert(
      'Olahraga Mandiri',
      'Mulai sesi olahraga mandiri?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Mulai', 
          onPress: () => Alert.alert('Selamat berolahraga!', 'Sesi olahraga mandiri dimulai') 
        },
      ]
    );
  };

  const renderSearchButton = () => (
    <Pressable 
      style={styles.searchButton}
      onPress={() => handleSearchUsers()}
      android_ripple={{ color: 'rgba(147, 51, 234, 0.1)' }}
    >
      <Ionicons name="mic" size={20} color="#A12AD0" style={styles.micIcon} />
      <Text style={styles.searchButtonText}>Cari pengguna di sekitar...</Text>
    </Pressable>
  );

  const renderUserCard = (user: User) => {
    const isOnline = user.status === 'online';
    
    return (
      <View key={user.id} style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isOnline ? '#48814C' : '#D02A2A' }
            ]}>
              <Text style={styles.statusText}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.locationText}>
              {user.distance}
              {user.location && ` • ${user.location}`}
              {!isOnline && user.lastSeen && ` • ${user.lastSeen}`}
            </Text>
          </View>
        </View>
        
        {isOnline && (
          <Pressable 
            style={styles.inviteButton} 
            onPress={() => handleInviteUser(user)}
            android_ripple={{ color: '#rgba(255,255,255,0.1)' }}
          >
            <Ionicons name="people" size={16} color="#FFFFFF" />
            <Text style={styles.inviteText}>Undang</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderNearbyUsersSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="people" size={24} color="#374151" />
        <Text style={styles.sectionTitle}>
          Pengguna Terdekat ({filteredUsers.length})
        </Text>
      </View>
      
      <View style={styles.usersList}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(renderUserCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna terdekat'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSelfTrainingCard = () => (
    <View style={styles.selfTrainingContainer}>
      <Text style={styles.selfTrainingTitle}>
        Tidak menemukan partner yang cocok?
      </Text>
      <Pressable 
        style={styles.selfTrainingButton} 
        onPress={handleSelfTraining}
        android_ripple={{ color: '#E5E7EB' }}
      >
        <Text style={styles.selfTrainingButtonText}>Olahraga Mandiri Saja</Text>
      </Pressable>
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
          <Text style={styles.pageTitle}>Olahraga Bersama</Text>
          <Text style={styles.pageSubtitle}>
            Temukan partner olahraga di sekitar Anda
          </Text>
        </View>

        {/* Search Button Section */}
        {renderSearchButton()}

        {/* Nearby Users Section */}
        {renderNearbyUsersSection()}

        {/* Self Training Section */}
        {renderSelfTrainingCard()}
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

  // Search Button Styles
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9333EA',
    borderStyle: 'dashed',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    minHeight: 56,
  },
  micIcon: {
    marginRight: 12,
  },
  searchButtonText: {
    fontSize: 14,
    color: '#9333EA',
    fontFamily: 'PoppinsMedium',
    textAlign: 'center',
  },

  // Section Styles
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DADADA'
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
  usersList: {
    gap: 12,
  },

  // User Card Styles
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    color: '#6B7280',
    marginLeft: 4,
    flexShrink: 1,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272829',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inviteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'PoppinsMedium',
    marginLeft: 6,
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },

  // Self Training Styles
  selfTrainingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DADADA'
  },
  selfTrainingTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
    marginBottom: 16,
    lineHeight: 24,
  },
  selfTrainingButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  selfTrainingButtonText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'PoppinsMedium',
  },
});