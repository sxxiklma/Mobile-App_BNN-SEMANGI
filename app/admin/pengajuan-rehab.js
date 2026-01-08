import React, { useState, useEffect } from 'react';
import { PHOTO_URLS } from '../../config/photoUrls';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRiwayat } from '../../context/RiwayatContext';
import { getAllLembaga } from '../../services/lembagaService';
import AdminBottomNav from '../../components/AdminBottomNav';
import Toast from '../../components/Toast';

const PengajuanRehab = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { addRiwayat } = useRiwayat();
  const [showLembagaModal, setShowLembagaModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState({ lat: -7.2575, lng: 112.7521 });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    jenisKelamin: 'Laki-laki',
    alamat: '',
    nomorTAT: '',
    status: 'Rawat Jalan',
    lembaga: '',
    tanggalMasuk: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD untuk default hari ini
    latitude: '',
    longitude: '',
  });

  const lembagaList = getAllLembaga();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  // Debug: Log user info on mount
  useEffect(() => {
    console.log('🔵 User Info:', {
      email: user?.email,
      name: user?.name,
      role: user?.role,
      uid: user?.uid
    });
    if (!user) {
      console.error('❌ User is NULL! Anda harus login dulu!');
    }
    if (user && user.role !== 'admin') {
      console.warn('⚠️ User role bukan admin:', user.role);
    }
  }, [user]);

  const formatDate = (dateString) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  useEffect(() => {
    if (Platform.OS === 'web' && showMapModal) {
      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setMapLoaded(true);
          setTimeout(() => initMap(), 100);
        };
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
        setTimeout(() => initMap(), 100);
      }
    }
  }, [showMapModal]);

  const initMap = () => {
    if (!window.L || Platform.OS !== 'web') return;

    const mapElement = document.getElementById('coordinate-picker-map');
    if (!mapElement) return;

    // Remove existing map if any
    mapElement.innerHTML = '';

    // Create map centered on existing coordinates or Surabaya
    const map = window.L.map('coordinate-picker-map').setView(
      [tempCoordinates.lat, tempCoordinates.lng], 
      13
    );

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add draggable marker
    const marker = window.L.marker([tempCoordinates.lat, tempCoordinates.lng], {
      draggable: true
    }).addTo(map);

    marker.bindPopup('Drag marker atau klik peta untuk memilih lokasi').openPopup();

    // Update coordinates when marker is dragged
    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      setTempCoordinates({ lat: position.lat, lng: position.lng });
      marker.setPopupContent(
        `Koordinat: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
      ).openPopup();
    });

    // Update coordinates when map is clicked
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setTempCoordinates({ lat, lng });
      marker.setPopupContent(
        `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      ).openPopup();
    });
  };

  const handleConfirmLocation = () => {
    setFormData({
      ...formData,
      latitude: tempCoordinates.lat.toString(),
      longitude: tempCoordinates.lng.toString(),
    });
    setShowMapModal(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (event.type === 'set' && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      setFormData({ ...formData, tanggalMasuk: formattedDate });
    }
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async () => {
    console.log('🔵 Form Submit Started');
    console.log('🔵 Form Data:', formData);
    console.log('🔵 User Info:', { email: user?.email, role: user?.role });
    
    if (!formData.nama || !formData.nik || !formData.alamat || !formData.lembaga) {
      setToast({ visible: true, message: 'Mohon lengkapi data yang diperlukan', type: 'error' });
      return;
    }
    
    if (!formData.latitude || !formData.longitude) {
      setToast({ visible: true, message: 'Mohon masukkan koordinat lokasi', type: 'error' });
      return;
    }
    
    const submissionData = {
      nama: formData.nama,
      nik: formData.nik,
      jenisKelamin: formData.jenisKelamin,
      alamat: formData.alamat,
      nomorTAT: formData.nomorTAT || `TAT-${Date.now()}`,
      status: formData.status,
      lembaga: formData.lembaga,
      tanggalMasuk: formData.tanggalMasuk,
      tanggalMasukDisplay: formatDate(formData.tanggalMasuk),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      submittedBy: user?.email || 'unknown',
      submittedByName: user?.name || 'Admin',
    };
    
    console.log('🔵 Submission Data:', submissionData);
    
    // Add to Firebase Realtime Database
    const result = await addRiwayat(submissionData);
    
    console.log('🔵 Add Result:', result);
    
    if (result.success) {
      setToast({ visible: true, message: 'Pengajuan rehabilitasi berhasil disimpan!', type: 'success' });
      // Wait for toast then navigate back
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      console.error('❌ Submit Failed:', result.error);
      setToast({ visible: true, message: 'Gagal menyimpan: ' + result.error, type: 'error' });
    }
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
            <Text style={styles.pageTitle}>Pengajuan Rehabilitasi</Text>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              {/* Nama */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChangeText={(text) => setFormData({ ...formData, nama: text })}
                />
              </View>

              {/* NIK */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIK *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan NIK"
                  keyboardType="numeric"
                  value={formData.nik}
                  onChangeText={(text) => setFormData({ ...formData, nik: text })}
                />
              </View>

              {/* Jenis Kelamin */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Jenis Kelamin</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, jenisKelamin: 'Laki-laki' })}
                  >
                    <View style={[styles.radioCircle, formData.jenisKelamin === 'Laki-laki' && styles.radioCircleSelected]}>
                      {formData.jenisKelamin === 'Laki-laki' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>Laki-laki</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, jenisKelamin: 'Perempuan' })}
                  >
                    <View style={[styles.radioCircle, formData.jenisKelamin === 'Perempuan' && styles.radioCircleSelected]}>
                      {formData.jenisKelamin === 'Perempuan' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>Perempuan</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Alamat */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alamat *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Masukkan alamat lengkap"
                  multiline
                  numberOfLines={3}
                  value={formData.alamat}
                  onChangeText={(text) => setFormData({ ...formData, alamat: text })}
                />
              </View>

              {/* Nomor TAT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nomor TAT</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nomor TAT"
                  value={formData.nomorTAT}
                  onChangeText={(text) => setFormData({ ...formData, nomorTAT: text })}
                />
              </View>

              {/* Status */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status Rehabilitasi</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, status: 'Rawat Jalan' })}
                  >
                    <View style={[styles.radioCircle, formData.status === 'Rawat Jalan' && styles.radioCircleSelected]}>
                      {formData.status === 'Rawat Jalan' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>Rawat Jalan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setFormData({ ...formData, status: 'Rawat Inap' })}
                  >
                    <View style={[styles.radioCircle, formData.status === 'Rawat Inap' && styles.radioCircleSelected]}>
                      {formData.status === 'Rawat Inap' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>Rawat Inap</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lembaga Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Lembaga Rehabilitasi *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowLembagaModal(true)}
                >
                  <Text style={[styles.dropdownText, !formData.lembaga && styles.placeholder]}>
                    {formData.lembaga || 'Pilih Lembaga Rehabilitasi'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Tanggal Masuk */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tanggal Masuk Rehab *</Text>
                <TouchableOpacity 
                  style={styles.dateInputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={18} color="#64748B" style={styles.dateIcon} />
                  <Text style={[styles.dateText, !formData.tanggalMasuk && styles.placeholder]}>
                    {formData.tanggalMasuk || 'Pilih tanggal masuk rehab'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.tanggalMasuk ? new Date(formData.tanggalMasuk) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}

              {/* Koordinat Section */}
              <View style={styles.coordinateSection}>
                <Text style={styles.sectionTitle}>Koordinat Lokasi *</Text>
                <Text style={styles.sectionSubtitle}>Klik peta untuk menentukan lokasi</Text>
                
                <TouchableOpacity 
                  style={styles.mapPickerButton}
                  onPress={() => {
                    if (formData.latitude && formData.longitude) {
                      setTempCoordinates({ 
                        lat: parseFloat(formData.latitude), 
                        lng: parseFloat(formData.longitude) 
                      });
                    }
                    setShowMapModal(true);
                  }}
                >
                  <View style={styles.mapPickerContent}>
                    <Ionicons name="location" size={40} color="#2563EB" />
                    {formData.latitude && formData.longitude ? (
                      <View style={styles.coordinatesDisplay}>
                        <Text style={styles.coordinatesLabel}>Koordinat Dipilih:</Text>
                        <Text style={styles.coordinatesText}>
                          {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.coordinatesDisplay}>
                        <Text style={styles.mapPickerText}>Pilih Lokasi di Peta</Text>
                        <Text style={styles.mapPickerHint}>Tap untuk membuka peta interaktif</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <LinearGradient colors={['#2563EB', '#063CA8']} style={styles.submitGradient}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.submitText}>Submit Pengajuan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
      
      {/* Lembaga Modal */}
      <Modal
        visible={showLembagaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLembagaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Lembaga Rehabilitasi</Text>
              <TouchableOpacity onPress={() => setShowLembagaModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {lembagaList.map((lembaga) => (
                <TouchableOpacity
                  key={lembaga.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData({ ...formData, lembaga: lembaga.nama });
                    setShowLembagaModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{lembaga.nama}</Text>
                  {formData.lembaga === lembaga.nama && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Map Picker Modal */}
      <Modal
        visible={showMapModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mapModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Lokasi di Peta</Text>
              <TouchableOpacity onPress={() => setShowMapModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapInstructions}>
              <Ionicons name="information-circle" size={20} color="#2563EB" />
              <Text style={styles.instructionText}>
                Klik pada peta atau drag marker untuk menentukan lokasi
              </Text>
            </View>

            {Platform.OS === 'web' && (
              <div
                id="coordinate-picker-map"
                style={{
                  width: '100%',
                  height: 400,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '2px solid #E5E7EB',
                  marginVertical: 16,
                }}
              />
            )}

            <View style={styles.coordinatePreview}>
              <Text style={styles.previewLabel}>Koordinat Dipilih:</Text>
              <Text style={styles.previewValue}>
                Lat: {tempCoordinates.lat.toFixed(6)}, Lng: {tempCoordinates.lng.toFixed(6)}
              </Text>
            </View>

            <View style={styles.mapModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowMapModal(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmLocation}
              >
                <LinearGradient colors={['#2563EB', '#063CA8']} style={styles.confirmGradient}>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.confirmButtonText}>Konfirmasi</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  scrollContent: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dateInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  coordinateSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  coordinateRow: {
    flexDirection: 'row',
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
    maxHeight: '70%',
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
    maxHeight: 400,
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
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapPickerButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
  },
  mapPickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coordinatesDisplay: {
    marginLeft: 12,
    flex: 1,
  },
  coordinatesLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  coordinatesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  mapPickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 2,
  },
  mapPickerHint: {
    fontSize: 12,
    color: '#64748B',
  },
  mapModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '90%',
    marginTop: 'auto',
  },
  mapInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 13,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
  },
  coordinatePreview: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  mapModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default PengajuanRehab;
