import React, { useState, useEffect } from 'react';
import { PHOTO_URLS } from '../../config/photoUrls';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAllLembaga } from '../../services/lembagaService';
import AdminBottomNav from '../../components/AdminBottomNav';

const DaftarLembaga = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [lembagaList, setLembagaList] = useState([]);

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  useEffect(() => {
    loadLembaga();
  }, []);

  const loadLembaga = () => {
    const data = getAllLembaga();
    setLembagaList(data);
  };

  const filteredData = lembagaList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.85}
      onPress={() => router.push(`/lembaga/detail?id=${item.id}`)}
    >
      <View style={styles.cardMainContent}>
        {item.foto && (
          <Image
            source={item.foto}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.cardTextContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.nama}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={14} color="#64748B" />
              <Text style={styles.infoText}>{item.alamat}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={14} color="#64748B" />
              <Text style={styles.infoText}>{item.telepon}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={14} color="#64748B" />
              <Text style={styles.infoText}>PIC: {item.pic}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.capacityContainer}>
        <View style={styles.capacityCard}>
          <Text style={styles.capacityLabel}>Total Kapasitas</Text>
          <Text style={styles.capacityValue}>{item.kapasitas}</Text>
        </View>
        <View style={styles.capacityCard}>
          <Text style={styles.capacityLabel}>Terisi</Text>
          <Text style={[styles.capacityValue, { color: '#EF4444' }]}>{item.terisi}</Text>
        </View>
        <View style={styles.capacityCard}>
          <Text style={styles.capacityLabel}>Tersedia</Text>
          <Text style={[styles.capacityValue, { color: '#10B981' }]}>{item.kapasitas - item.terisi}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient colors={['#063CA8', '#00AEEF']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: PHOTO_URLS.LOGO_BNN_PNG }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cityContainer}>
            <Text style={styles.cityText}>KOTA{'\n'}SURABAYA</Text>
          </View>
          <View style={styles.userChip}>
            <Text style={styles.userChipText}>{firstName}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Daftar Lembaga</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama atau lokasi lembaga..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{lembagaList.length}</Text>
              <Text style={styles.statLabel}>Total Lembaga</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {lembagaList.reduce((sum, item) => sum + item.kapasitas, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Kapasitas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {lembagaList.reduce((sum, item) => sum + (item.kapasitas - item.terisi), 0)}
              </Text>
              <Text style={styles.statLabel}>Tersedia</Text>
            </View>
          </View>

          {/* List */}
          {filteredData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-off" size={64} color="#CBD5E0" />
              <Text style={styles.emptyStateTitle}>Tidak Ada Data</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Tidak ditemukan hasil pencarian' : 'Belum ada lembaga terdaftar'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </LinearGradient>
      
      <AdminBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  cityContainer: {
    alignItems: 'center',
  },
  cityText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
    letterSpacing: 1,
  },
  userChip: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userChipText: {
    color: '#063CA8',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardMainContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  cardTextContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  cardInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  capacityContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  capacityCard: {
    flex: 1,
    alignItems: 'center',
  },
  capacityLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 4,
  },
  capacityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default DaftarLembaga;
