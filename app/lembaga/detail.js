import React, { useState, useEffect } from 'react';
import { ScrollView, Linking, View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '../../constants/AppColors';
import { getAllLembaga } from '../../services/lembagaService';

const DetailLembagaScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [lembaga, setLembaga] = useState(null);

  useEffect(() => {
    if (params.id) {
      const allLembaga = getAllLembaga();
      const found = allLembaga.find(l => l.id === parseInt(params.id));
      setLembaga(found);
    }
  }, [params.id]);

  const handleCallPress = (telepon) => {
    Linking.openURL(`tel:${telepon}`);
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  if (!lembaga) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[AppColors.backgroundBlue, AppColors.primaryDark]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Detail Lembaga</Text>
            </View>

            <View style={styles.card}>
              <Image
                source={lembaga.foto}
                style={styles.image}
                resizeMode="cover"
              />
              
              <View style={styles.content}>
                <Text style={styles.title}>{lembaga.nama}</Text>

                <View style={styles.divider} />

                {/* Contact Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📞 Informasi Kontak</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Telepon:</Text>
                    <TouchableOpacity onPress={() => handleCallPress(lembaga.telepon)}>
                      <Text style={styles.linkText}>{lembaga.telepon}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <TouchableOpacity onPress={() => handleEmailPress(lembaga.email)}>
                      <Text style={styles.linkText}>{lembaga.email}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>PIC:</Text>
                    <Text style={styles.value}>{lembaga.pic}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Address */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📍 Alamat</Text>
                  <Text style={styles.value}>{lembaga.alamat}</Text>
                </View>

                <View style={styles.divider} />

                {/* Capacity */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🏥 Kapasitas Layanan</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Pria:</Text>
                    <Text style={styles.value}>{lembaga.kapasitas_pria} orang</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Wanita:</Text>
                    <Text style={styles.value}>{lembaga.kapasitas_wanita} orang</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Rawat Jalan:</Text>
                    <Text style={styles.value}>{lembaga.kapasitas_rawat_jalan} orang</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      Total Kapasitas: {lembaga.kapasitas_pria + lembaga.kapasitas_wanita + lembaga.kapasitas_rawat_jalan} orang
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: AppColors.buttonMasyarakat }]}
                    onPress={() => handleCallPress(lembaga.telepon)}
                  >
                    <Text style={styles.buttonText}>📞 Hubungi Sekarang</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={() => handleEmailPress(lembaga.email)}
                  >
                    <Text style={[styles.buttonText, { color: AppColors.buttonMasyarakat }]}>✉️ Kirim Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: 'white',
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
    color: '#333',
  },
  value: {
    flex: 1,
    color: AppColors.textSecondary,
  },
  linkText: {
    flex: 1,
    color: AppColors.buttonMasyarakat,
  },
  badge: {
    backgroundColor: AppColors.buttonLembaga,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppColors.buttonMasyarakat,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailLembagaScreen;
