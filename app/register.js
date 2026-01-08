import React, { useState, useRef } from 'react';
import { PHOTO_URLS } from '../config/photoUrls';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { AppColors } from '../constants/AppColors';
import Toast from '../components/Toast';

const isValidGmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

export default function RegisterScreen() {
  const params = useLocalSearchParams();
  const initialRole = 'admin'; // Always admin role

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setToast({ visible: true, message: 'Mohon lengkapi semua data', type: 'error' });
      return;
    }

        if (!isValidGmail(email)) {
      setToast({
        visible: true,
        message: 'Email tidak valid. Gunakan email @gmail.com',
        type: 'error',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setToast({ visible: true, message: 'Kata sandi dan konfirmasi tidak sama', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ visible: true, message: 'Kata sandi minimal 6 karakter', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to register:', { email, name: fullName, role });
      const result = await signUp(email, password, fullName, role);
      console.log('Registration result:', result);
      
      if (result.success) {
        // Show success modal instead of auto redirect
        setShowSuccessModal(true);
      } else {
        setToast({ visible: true, message: result.error || 'Pendaftaran gagal', type: 'error' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setToast({ visible: true, message: error.message || 'Terjadi kesalahan saat mendaftar', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  return (
    <LinearGradient colors={['#063CA8', '#2563EB']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <View style={styles.backCircle}>
                  <Ionicons name="arrow-back" size={20} color={AppColors.textSecondary} />
                </View>
              </TouchableOpacity>

              <View style={styles.logoSection}>
                <View style={styles.logoCircle}>
                  <Image
                    source={{ uri: PHOTO_URLS.LOGO_BNN_PNG }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.cityText}>KOTA{'\n'}SURABAYA</Text>
              </View>

              <Text style={styles.title}>Buat Akun Baru</Text>
              <Text style={styles.subtitle}>
                Lengkapi data berikut untuk mendaftarkan akun Admin
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={AppColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan nama lengkap"
                    placeholderTextColor={AppColors.textLight}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={AppColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan email aktif"
                    placeholderTextColor={AppColors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kata Sandi</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={AppColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={AppColors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={AppColors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={AppColors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ulangi kata sandi"
                    placeholderTextColor={AppColors.textLight}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={AppColors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>



              <TouchableOpacity
                style={[styles.submitButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Membuat Akun...' : 'Daftar Sekarang'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Sudah punya akun? </Text>
                <TouchableOpacity
                  onPress={() => router.replace('/login')}
                >
                  <Text style={styles.loginLink}>Masuk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.successIconGradient}
              >
                <Ionicons name="checkmark-circle" size={80} color="white" />
              </LinearGradient>
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Registrasi Berhasil!</Text>
            <Text style={styles.successMessage}>
              Akun Anda telah berhasil dibuat.{'\n'}
              Silakan login untuk melanjutkan.
            </Text>

            {/* Button Kembali ke Login */}
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/login');
              }}
            >
              <LinearGradient
                colors={['#063CA8', '#2563EB']}
                style={styles.successButtonGradient}
              >
                <Text style={styles.successButtonText}>Kembali ke Login</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 85,
    height: 85,
  },
  cityText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surfaceGray,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 58,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: AppColors.white,
  },
  roleOptionActive: {
    backgroundColor: '#063CA8',
    borderColor: '#063CA8',
  },
  roleText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  roleTextActive: {
    color: AppColors.white,
  },
  submitButton: {
    backgroundColor: '#063CA8',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#063CA8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#063CA8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#063CA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  successButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
