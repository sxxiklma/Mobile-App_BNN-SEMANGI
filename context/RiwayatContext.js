import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, set, push, onValue, off, update, remove } from 'firebase/database';
import { database } from '../config/firebase';

const RiwayatContext = createContext();

export const useRiwayat = () => {
  const context = useContext(RiwayatContext);
  if (!context) {
    throw new Error('useRiwayat must be used within RiwayatProvider');
  }
  return context;
};

export const RiwayatProvider = ({ children }) => {
  const [riwayatList, setRiwayatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Firebase with real-time listener
  useEffect(() => {
    console.log('🔵 Setting up Firebase listener...');
    const pengajuanRef = ref(database, 'pengajuan');
    
    // Set up real-time listener
    const unsubscribe = onValue(pengajuanRef, (snapshot) => {
      console.log('🔵 Firebase onValue triggered');
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('✅ Data exists in Firebase:', Object.keys(data).length, 'items');
        // Convert object to array and sort by timestamp (newest first)
        const riwayatArray = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        console.log('✅ Converted to array:', riwayatArray.length, 'items');
        setRiwayatList(riwayatArray);
      } else {
        console.log('⚠️ No data in Firebase, creating default data...');
        // Set default data jika belum ada
        const defaultData = [
          {
            id: '1',
            nama: 'Ahmad Suryanto',
            nik: '3578012345678901',
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Mawar No. 10, Surabaya',
            nomorTAT: 'TAT-2024-001',
            status: 'Rawat Inap',
            lembaga: 'Yayasan Rumah Kita Surabaya',
            tanggalMasuk: '2024-11-15',
            tanggalMasukDisplay: '15 Nov 2024',
            latitude: -7.2701,
            longitude: 112.7261,
            timestamp: Date.now() - 1000000,
          },
          {
            id: '2',
            nama: 'Siti Nurhaliza',
            nik: '3578019876543210',
            jenisKelamin: 'Perempuan',
            alamat: 'Jl. Melati No. 25, Surabaya',
            nomorTAT: 'TAT-2024-002',
            status: 'Rawat Jalan',
            lembaga: 'Klinik Pratama BNN Kota Surabaya',
            tanggalMasuk: '2024-11-12',
            tanggalMasukDisplay: '12 Nov 2024',
            latitude: -7.2819,
            longitude: 112.7478,
            timestamp: Date.now() - 2000000,
          },
          {
            id: '3',
            nama: 'Budi Santoso',
            nik: '3578011234567890',
            jenisKelamin: 'Laki-laki',
            alamat: 'Jl. Kenanga No. 5, Surabaya',
            nomorTAT: 'TAT-2024-003',
            status: 'Rawat Inap',
            lembaga: 'Yayasan Orbit Surabaya',
            tanggalMasuk: '2024-11-10',
            tanggalMasukDisplay: '10 Nov 2024',
            latitude: -7.3155,
            longitude: 112.7689,
            timestamp: Date.now() - 3000000,
          },
        ];
        
        // Save default data to Firebase
        defaultData.forEach(item => {
          const itemRef = ref(database, `pengajuan/${item.id}`);
          set(itemRef, item);
        });
        
        setRiwayatList(defaultData);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('❌ Firebase Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      alert('Error koneksi Firebase: ' + error.message);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      off(pengajuanRef);
    };
  }, []);

  const addRiwayat = async (data) => {
    try {
      console.log('🔵 Starting addRiwayat...', data);
      
      // Validate data before saving
      if (!data.nama || !data.nik || !data.alamat || !data.lembaga) {
        throw new Error('Missing required fields: nama, nik, alamat, or lembaga');
      }
      
      if (!data.latitude || !data.longitude || isNaN(data.latitude) || isNaN(data.longitude)) {
        throw new Error('Invalid coordinates: latitude and longitude must be valid numbers');
      }
      
      // Generate new unique ID using Firebase push
      const pengajuanRef = ref(database, 'pengajuan');
      const newPengajuanRef = push(pengajuanRef);
      
      const newRiwayat = {
        nama: String(data.nama).trim(),
        nik: String(data.nik).trim(),
        jenisKelamin: String(data.jenisKelamin || 'Laki-laki').trim(),
        alamat: String(data.alamat).trim(),
        nomorTAT: String(data.nomorTAT || `TAT-${Date.now()}`).trim(),
        status: String(data.status || 'Rawat Jalan').trim(),
        lembaga: String(data.lembaga).trim(),
        tanggalMasuk: String(data.tanggalMasuk || new Date().toISOString().split('T')[0]).trim(),
        tanggalMasukDisplay: String(data.tanggalMasukDisplay || new Date().toLocaleDateString('id-ID')).trim(),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        submittedBy: String(data.submittedBy || 'unknown').trim(),
        submittedByName: String(data.submittedByName || 'Admin').trim(),
      };
      
      console.log('🔵 Cleaned data to save:', newRiwayat);
      console.log('🔵 Saving to Firebase with ID:', newPengajuanRef.key);
      
      // Save to Firebase (will auto-update via onValue listener)
      await set(newPengajuanRef, newRiwayat);
      
      console.log('✅ Pengajuan berhasil disimpan ke Firebase Realtime Database');
      console.log('✅ Firebase path: pengajuan/' + newPengajuanRef.key);
      return { success: true, id: newPengajuanRef.key };
    } catch (error) {
      console.error('❌ Error saving pengajuan:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Data that failed:', data);
      return { success: false, error: error.message };
    }
  };

  const updateStatusRiwayat = async (id, newStatus) => {
    try {
      const pengajuanRef = ref(database, `pengajuan/${id}`);
      await update(pengajuanRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Status pengajuan berhasil diupdate');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating status:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteRiwayat = async (id) => {
    try {
      console.log('🔵 Starting deleteRiwayat for ID:', id);
      console.log('🔵 Database reference:', database);
      
      if (!id) {
        throw new Error('ID is required for deletion');
      }
      
      if (!database) {
        throw new Error('Database not initialized');
      }
      
      const pengajuanRef = ref(database, `pengajuan/${id}`);
      console.log('🔵 Firebase ref created for path:', `pengajuan/${id}`);
      
      // Delete from Firebase (will auto-update via onValue listener)
      console.log('🔵 Calling remove()...');
      await remove(pengajuanRef);
      
      console.log('✅ Pengajuan berhasil dihapus dari Firebase Realtime Database');
      console.log('✅ Deleted Firebase path: pengajuan/' + id);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting pengajuan:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return { success: false, error: error.message };
    }
  };

  return (
    <RiwayatContext.Provider value={{ 
      riwayatList, 
      addRiwayat, 
      updateStatusRiwayat, 
      deleteRiwayat,
      isLoading 
    }}>
      {children}
    </RiwayatContext.Provider>
  );
};
