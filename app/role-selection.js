import React from 'react';
import { PHOTO_URLS } from '../config/photoUrls';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '../constants/AppColors';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#063CA8', '#2563EB']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image
              source={{ uri: PHOTO_URLS.LOGO_BNN_PNG }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cityText}>KOTA{'\n'}SURABAYA</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Selamat Datang</Text>
            <Text style={styles.cardSubtitle}>Silakan pilih jenis akun untuk melanjutkan</Text>

            <View style={styles.buttonStack}>
              <TouchableOpacity
                style={[styles.actionButton, styles.masButton, styles.buttonSpacing]}
                onPress={() => router.push('/login?role=masyarakat')}
                activeOpacity={0.85}
              >
                <Text style={styles.actionText}>Login Masyarakat</Text>
                <Text style={styles.actionNote}>Akses informasi dan layanan rehabilitasi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.adminButton]}
                onPress={() => router.push('/login?role=admin')}
                activeOpacity={0.85}
              >
                <Text style={styles.actionText}>Login Admin</Text>
                <Text style={styles.actionNote}>Kelola data dan verifikasi pengajuan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Badan Narkotika Nasional Kota Surabaya
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 127,
    height: 126,
    borderRadius: 63.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  cityText: {
    fontSize: 20,
    fontWeight: '400',
    color: AppColors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 32,
  },
  buttonStack: {
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  masButton: {
    backgroundColor: AppColors.buttonMasyarakat,
  },
  adminButton: {
    backgroundColor: AppColors.buttonAdmin,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
    marginBottom: 6,
  },
  actionNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});