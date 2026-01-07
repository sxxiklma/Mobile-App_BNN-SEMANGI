import React, { useState, useEffect } from 'react';
import { PHOTO_URLS } from '../../config/photoUrls';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AppColors } from '../../constants/AppColors';
import { getAllLembaga } from '../../services/lembagaService';
import AdminBottomNav from '../../components/AdminBottomNav';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [topLembaga, setTopLembaga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopLembaga();
  }, []);

  const loadTopLembaga = async () => {
    try {
      setIsLoading(true);
      const allLembaga = await getAllLembaga();
      
      // Sort by available capacity (descending)
      const sorted = [...allLembaga].sort((a, b) => {
        const aAvailable = a.kapasitas - a.terisi;
        const bAvailable = b.kapasitas - b.terisi;
        return bAvailable - aAvailable;
      });
      
      // Take top 3
      setTopLembaga(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error loading lembaga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#063CA8', '#00AEEF']}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
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
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.85}
                onPress={() => router.push('/admin/pengajuan-rehab')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(79, 195, 247, 0.1)' }]}>
                  <Ionicons name="document-text" size={24} color="#4FC3F7" />
                </View>
                <Text style={styles.actionCardTitle}>Pengajuan{'\n'}Rehab</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.85}
                onPress={() => router.push('/admin/riwayat')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(129, 199, 132, 0.1)' }]}>
                  <Ionicons name="time" size={24} color="#81C784" />
                </View>
                <Text style={styles.actionCardTitle}>Riwayat{'\n'}Pengajuan</Text>
              </TouchableOpacity>
            </View>

            {/* Top Lembaga Section */}
            <View style={styles.lembagaSection}>
              <Text style={styles.sectionTitle}>Top Lembaga Rehabilitasi</Text>
              
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#063CA8" />
                </View>
              ) : topLembaga.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="business-outline" size={64} color="#CBD5E0" />
                  <Text style={styles.emptyStateTitle}>Belum Ada Data Lembaga</Text>
                  <Text style={styles.emptyStateText}>
                    Silakan tambahkan lembaga rehabilitasi{'\n'}terlebih dahulu
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/admin/daftar-lembaga')}
                  >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.addButtonText}>Kelola Lembaga</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {topLembaga.map((lembaga, index) => (
                    <TouchableOpacity
                      key={lembaga.id}
                      style={styles.lembagaCard}
                      activeOpacity={0.85}
                      onPress={() => router.push(`/lembaga/detail?id=${lembaga.id}`)}
                    >
                      <View style={styles.lembagaRank}>
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                      </View>
                      {lembaga.foto && (
                        <Image
                          source={{ uri: lembaga.foto }}
                          style={styles.lembagaImage}
                          resizeMode="cover"
                        />
                      )}
                      <View style={styles.lembagaInfo}>
                        <Text style={styles.lembagaName}>{lembaga.nama}</Text>
                        <View style={styles.locationRow}>
                          <Ionicons name="location" size={14} color="#64748B" />
                          <Text style={styles.lembagaLocation}>{lembaga.alamat}</Text>
                        </View>
                        <View style={styles.capacityRow}>
                          <View style={styles.capacityBadge}>
                            <Ionicons name="people" size={14} color="#0891B2" />
                            <Text style={styles.capacityText}>
                              Tersedia: {lembaga.kapasitas - lembaga.terisi}/{lembaga.kapasitas}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  ))}
                  
                  {/* View All Button */}
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/admin/daftar-lembaga')}
                  >
                    <LinearGradient
                      colors={['#2563EB', '#063CA8']}
                      style={styles.viewAllGradient}
                    >
                      <Ionicons name="list" size={20} color="white" />
                      <Text style={styles.viewAllText}>Lihat Semua Lembaga</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </ScrollView>
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
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
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
    flex: 1,
    alignItems: 'center',
  },
  cityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 1,
  },
  userChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userChipText: {
    color: '#063CA8',
    fontSize: 13,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  scrollContent: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
  lembagaSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
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
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  lembagaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  lembagaRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  lembagaImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  lembagaInfo: {
    flex: 1,
  },
  lembagaName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  lembagaLocation: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  capacityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0891B2',
  },
  viewAllButton: {
    marginTop: 16,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  viewAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminDashboard;
