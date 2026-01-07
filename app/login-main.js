import React from 'react';
import { PHOTO_URLS } from '../config/photoUrls';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '../constants/AppColors';

export default function LoginMainScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[AppColors.backgroundBlue, AppColors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo & Title Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <Image
                source={{ uri: PHOTO_URLS.LOGO_BNN_PNG }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cityText}>KOTA{'\n'}SURABAYA</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.welcomeText}>Selamat Datang</Text>
            <Text style={styles.subtitleText}>Silakan login untuk melanjutkan</Text>

            <View style={styles.buttonContainer}>
              {/* Login Masyarakat */}
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: AppColors.buttonMasyarakat }]}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.buttonText}>Login Masyarakat</Text>
              </TouchableOpacity>

              {/* Login Lembaga */}
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: AppColors.buttonLembaga }]}
                onPress={() => router.push('/login-lembaga')}
              >
                <Text style={styles.buttonText}>Login Lembaga</Text>
              </TouchableOpacity>

              {/* Login Admin */}
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: AppColors.buttonAdmin }]}
                onPress={() => router.push('/login-admin')}
              >
                <Text style={styles.buttonText}>Login Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  cityText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textWhite,
    textAlign: 'center',
    lineHeight: 22,
  },
  loginCard: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});
