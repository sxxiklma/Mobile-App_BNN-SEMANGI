import React, { useState, useEffect } from 'react';
import { PHOTO_URLS } from '../../config/photoUrls';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRiwayat } from '../../context/RiwayatContext';
import AdminBottomNav from '../../components/AdminBottomNav';
import Toast from '../../components/Toast';

const RiwayatPengajuan = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Debug the context
  const riwayatContext = useRiwayat();
  console.log('🔵 Full Riwayat Context:', riwayatContext);
  
  const { riwayatList, updateStatusRiwayat, deleteRiwayat, addRiwayat } = riwayatContext;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  // Debug: Check if deleteRiwayat function exists
  useEffect(() => {
    console.log('🔵 Riwayat Component Mounted');
    console.log('🔵 deleteRiwayat function available:', typeof deleteRiwayat);
    console.log('🔵 deleteRiwayat function:', deleteRiwayat);
    console.log('🔵 riwayatList length:', riwayatList.length);
    console.log('🔵 All context functions:', {
      addRiwayat: typeof addRiwayat,
      updateStatusRiwayat: typeof updateStatusRiwayat,
      deleteRiwayat: typeof deleteRiwayat
    });
  }, [deleteRiwayat, riwayatList, addRiwayat, updateStatusRiwayat]);

  const statusOptions = ['Rawat Inap', 'Rawat Jalan', 'Selesai'];

  const handleStatusChange = (newStatus) => {
    if (selectedItem) {
      updateStatusRiwayat(selectedItem.id, newStatus);
      setShowStatusModal(false);
      setSelectedItem(null);
    }
  };

  // Alternative delete method using state instead of Alert
  const showDeleteConfirmation = (item) => {
    console.log('🔵 Alternative delete method triggered for:', item.nama);
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    console.log('🔵 Delete confirmed for:', itemToDelete?.nama);
    if (!itemToDelete) return;
    
    setDeletingId(itemToDelete.id);
    try {
      console.log('🔵 Calling deleteRiwayat...');
      await deleteRiwayat(itemToDelete.id);
      console.log('✅ Delete completed');
      setToast({ visible: true, message: 'Data berhasil dihapus', type: 'success' });
    } catch (error) {
      console.error('❌ Delete failed:', error);
      setToast({ visible: true, message: 'Gagal menghapus: ' + error.message, type: 'error' });
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    console.log('🔵 Delete cancelled');
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleDelete = (item) => {
    console.log('🔵 Delete button clicked for:', item.nama, 'ID:', item.id);
    console.log('🔵 Item data:', JSON.stringify(item, null, 2));
    console.log('🔵 deleteRiwayat function check:', typeof deleteRiwayat);
    
    // Add more debugging
    console.log('🔵 Full context object:', typeof riwayatContext);
    console.log('🔵 All context methods:', Object.keys(riwayatContext || {}));
    
    // Test Alert availability
    console.log('🔵 Alert object:', typeof Alert);
    console.log('🔵 Alert.alert:', typeof Alert.alert);
    
    try {
      console.log('🔵 About to call Alert.alert...');
      Alert.alert(
        'Konfirmasi Hapus',
        `Apakah Anda yakin ingin menghapus data rehabilitasi:\n\n👤 ${item.nama}\n📄 NIK: ${item.nik}\n\n⚠️ Data yang dihapus tidak dapat dikembalikan!`,
        [
          {
            text: 'Batal',
            style: 'cancel',
            onPress: () => console.log('🔵 Delete cancelled')
          },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: async () => {
              console.log('🔵 User confirmed deletion for ID:', item.id);
              console.log('🔵 About to call deleteRiwayat...');
              setDeletingId(item.id);
              
              try {
                if (!deleteRiwayat) {
                  throw new Error('deleteRiwayat function is not available');
                }
                
                console.log('🔵 Calling deleteRiwayat with ID:', item.id);
                const result = await deleteRiwayat(item.id);
                console.log('🔵 Delete result received:', result);
                
                if (result && result.success) {
                  console.log('✅ Delete successful');
                  Alert.alert(
                    'Berhasil! ✅',
                    `Data ${item.nama} telah dihapus dari Firebase Realtime Database.\n\nPerubahan akan terlihat secara real-time di semua device!`,
                    [{ text: 'OK' }]
                  );
                } else {
                  console.error('❌ Delete failed:', result?.error || 'Unknown error');
                  Alert.alert(
                    'Gagal Menghapus',
                    'Terjadi kesalahan: ' + (result?.error || 'Unknown error'),
                    [{ text: 'OK' }]
                  );
                }
              } catch (error) {
                console.error('❌ Delete exception:', error);
                console.error('❌ Error details:', {
                  message: error.message,
                  stack: error.stack
                });
                Alert.alert(
                  'Error',
                  'Terjadi error unexpected: ' + error.message,
                  [{ text: 'OK' }]
                );
              }
              
              setDeletingId(null);
            },
          },
        ]
      );
      console.log('🔵 Alert.alert called successfully');
    } catch (alertError) {
      console.error('❌ Error showing alert:', alertError);
      console.error('❌ Alert error details:', {
        message: alertError.message,
        stack: alertError.stack,
        name: alertError.name
      });
      
      // Fallback to simple confirm dialog
      console.log('🔵 Trying fallback confirm dialog...');
      const confirmed = confirm(`Hapus data ${item.nama}?`);
      if (confirmed) {
        console.log('🔵 Fallback confirm: User confirmed');
        // Call delete directly
        (async () => {
          try {
            setDeletingId(item.id);
            await deleteRiwayat(item.id);
            alert('Data berhasil dihapus');
          } catch (deleteError) {
            console.error('❌ Delete error:', deleteError);
            alert('Gagal menghapus: ' + deleteError.message);
          } finally {
            setDeletingId(null);
          }
        })();
      } else {
        console.log('🔵 Fallback confirm: User cancelled');
      }
    }
  };

  const filteredData = riwayatList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nik.includes(searchQuery) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const getStatusStyle = () => {
      switch (item.status) {
        case 'Rawat Inap':
          return styles.statusInap;
        case 'Rawat Jalan':
          return styles.statusJalan;
        case 'Selesai':
          return styles.statusSelesai;
        default:
          return styles.statusJalan;
      }
    };

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.85}>
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.cardName}>{item.nama}</Text>
            <TouchableOpacity
              style={[styles.statusBadge, getStatusStyle()]}
              onPress={() => {
                setSelectedItem(item);
                setShowStatusModal(true);
              }}
            >
              <Text style={styles.statusText}>{item.status}</Text>
              <Ionicons name="chevron-down" size={14} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                deletingId === item.id && styles.deleteButtonDisabled
              ]}
              onPress={() => {
                console.log('🔵 Delete button pressed for item:', item.id);
                // Try both methods
                handleDelete(item);
                console.log('🔵 Also trying alternative method...');
                setTimeout(() => showDeleteConfirmation(item), 100);
              }}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <Ionicons name="hourglass-outline" size={16} color="white" />
              ) : (
                <Ionicons name="trash-outline" size={16} color="white" />
              )}
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" style={{ marginLeft: 8 }} />
          </View>
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="card" size={14} color="#64748B" />
            <Text style={styles.infoText}>NIK: {item.nik}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#64748B" />
            <Text style={styles.infoText}>{item.alamat}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={14} color="#64748B" />
            <Text style={styles.infoText}>{item.lembaga}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={14} color="#64748B" />
            <Text style={styles.infoText}>Masuk: {item.tanggalMasukDisplay}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text style={styles.pageTitle}>Riwayat Rehabilitasi</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama, NIK, atau alamat..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* List */}
          {filteredData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-off" size={64} color="#CBD5E0" />
              <Text style={styles.emptyStateTitle}>Tidak Ada Data</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Tidak ditemukan hasil pencarian' : 'Belum ada riwayat pengajuan'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </LinearGradient>
      
      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.modalItem}
                  onPress={() => handleStatusChange(status)}
                >
                  <Text style={styles.modalItemText}>{status}</Text>
                  {selectedItem?.status === status && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <View style={[styles.modalContent, { borderRadius: 20, margin: 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konfirmasi Hapus</Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>
                Apakah Anda yakin ingin menghapus data rehabilitasi:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
                {itemToDelete?.nama}
              </Text>
              <Text style={{ fontSize: 14, color: '#EF4444', marginBottom: 20 }}>
                ⚠️ Data yang dihapus tidak dapat dikembalikan!
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                  onPress={cancelDelete}
                >
                  <Text style={{ color: '#374151', fontWeight: '600' }}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#EF4444',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                  onPress={confirmDelete}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <AdminBottomNav />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
    marginBottom: 8,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusInap: {
    backgroundColor: '#3B82F6',
  },
  statusJalan: {
    backgroundColor: '#10B981',
  },
  statusSelesai: {
    backgroundColor: '#8B5CF6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  cardInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalList: {
    paddingTop: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
});

export default RiwayatPengajuan;
