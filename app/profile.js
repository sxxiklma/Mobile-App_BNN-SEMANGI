import React from 'react';
import { PHOTO_URLS } from '../config/photoUrls';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { AppColors } from '../constants/AppColors';
import { useAuth } from '../context/AuthContext';

const BNN_WEBSITE = 'https://surabayakota.bnn.go.id/';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const displayName = user?.name || 'Pengguna';
  const email = user?.email || 'email@bnn.go.id';
  const firstName = displayName.split(' ')[0] || 'User';

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleOpenWebsite = async () => {
    try {
      await WebBrowser.openBrowserAsync(BNN_WEBSITE);
    } catch (error) {
      console.error('Tidak dapat membuka website BNN:', error);
    }
  };

  const handleFaq = async () => {
    try {
      await WebBrowser.openBrowserAsync(`${BNN_WEBSITE}faq`);
    } catch (error) {
      Alert.alert('Informasi', 'Tidak dapat membuka halaman FAQ saat ini.');
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Segera Hadir',
      'Fitur ubah kata sandi akan tersedia setelah integrasi layanan keamanan selesai.'
    );
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          const result = await signOut();
          if (result.success) {
            router.replace('/role-selection');
          } else {
            Alert.alert('Gagal', result.error || 'Tidak dapat keluar dari akun.');
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      key: 'profil-bnnk',
      title: 'Profil BNNK Surabaya',
      subtitle: 'Lihat informasi profil BNNK Surabaya',
      icon: 'business-outline',
      onPress: handleOpenWebsite,
    },
    {
      key: 'faq',
      title: 'FAQ',
      subtitle: 'Pertanyaan yang sering diajukan',
      icon: 'help-circle-outline',
      onPress: handleFaq,
    },
    {
      key: 'security',
      title: 'Keamanan',
      subtitle: 'Ubah kata sandi',
      icon: 'shield-checkmark-outline',
      onPress: handleChangePassword,
    },
    {
      key: 'logout',
      title: 'Keluar',
      subtitle: 'Keluar dari akun dan kembali ke halaman login',
      icon: 'log-out-outline',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <LinearGradient colors={['#063CA8', '#2563EB']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color={AppColors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoCircle} onPress={handleOpenWebsite}>
            <Image
              source={{ uri: PHOTO_URLS.LOGO_BNN_PNG }}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.cityContainer}>
            <Text style={styles.cityText}>KOTA{'\n'}SURABAYA</Text>
          </View>

          <View style={styles.userChip}>
            <Text style={styles.userChipText}>{firstName}</Text>
            <View style={styles.userChipIcon}>
              <Ionicons name="person" size={16} color={AppColors.white} />
            </View>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Akun & Pengaturan</Text>
              <View style={styles.sectionBadge}>
                <Ionicons name="person-outline" size={16} color="#2563EB" />
                <Text style={styles.sectionBadgeText}>Profil User</Text>
              </View>
            </View>

            <View style={styles.profileCard}>
              {loading ? (
                <ActivityIndicator size="small" color="#063CA8" />
              ) : (
                <>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={38} color={AppColors.white} />
                  </View>
                  <Text style={styles.profileName}>{displayName}</Text>
                  <Text style={styles.profileEmail}>{email}</Text>
                </>
              )}
            </View>

            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.menuCard}
                  onPress={item.onPress}
                  activeOpacity={0.85}
                >
                  <View style={[styles.menuIconContainer, item.danger && styles.menuIconDanger]}>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.danger ? '#EF4444' : '#3B82F6'}
                    />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={[styles.menuTitle, item.danger && styles.menuTitleDanger]}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={item.danger ? '#EF4444' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: 54,
    height: 54,
  },
  cityContainer: {
    marginLeft: 16,
    flex: 1,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
    lineHeight: 20,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  userChipText: {
    color: '#063CA8',
    fontWeight: '600',
    marginRight: 8,
  },
  userChipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#063CA8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: 20,
  },
  sectionBadgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  profileCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#063CA8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  menuContainer: {
    paddingBottom: 8,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(59,130,246,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconDanger: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuTitleDanger: {
    color: '#EF4444',
  },
  menuSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ProfileScreen;
