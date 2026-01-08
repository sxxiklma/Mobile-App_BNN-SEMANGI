import React, { useRef, useState } from 'react';
import { PHOTO_URLS } from '../config/photoUrls';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '../constants/AppColors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Selamat Datang di SEMANGGI',
    subtitle: 'Semangat Menggapai Asa untuk Memulai Rehabilitasi',
    description:
      'Aplikasi resmi BNN Kota Surabaya untuk mendukung proses rehabilitasi dengan informasi lengkap dan akses mudah ke layanan.',
    image: PHOTO_URLS.SEMANGGI_PNG,
    gradient: ['#063CA8', '#0A48C7'],
    imageMode: 'cover',
  },
  {
    id: 2,
    title: 'Informasi Lembaga Rehabilitasi',
    subtitle: 'Temukan Fasilitas Terdekat',
    description:
      'Dapatkan detail lembaga rehabilitasi di Surabaya, termasuk alamat, fasilitas, dan kontak untuk memulai proses rehabilitasi.',
    image: PHOTO_URLS.KLINIK_PRATAMA1_JPG,
    gradient: ['#0456C6', '#0B6DE4'],
    imageMode: 'cover',
  },
  {
    id: 3,
    title: 'Edukasi dan Dukungan',
    subtitle: 'Belajar dan Berkembang Bersama',
    description:
      'Akses materi edukasi tentang bahaya narkotika, tips pemulihan, dan dukungan berkelanjutan untuk keluarga serta masyarakat.',
    image: PHOTO_URLS.SMCC_UNESA_JPEG,
    gradient: ['#0A5DE0', '#1187F0'],
    imageMode: 'cover',
  },
  {
    id: 4,
    title: 'Website BNN Kota Surabaya',
    subtitle: 'Informasi Resmi dan Terpercaya',
    description:
      'Kunjungi surabayakota.bnn.go.id untuk update program rehabilitasi, konsultasi, dan layanan resmi BNN Kota Surabaya.',
    image: PHOTO_URLS.LOGO_BNN_PNG,
    gradient: ['#0974F6', '#11A4FF'],
    imageMode: 'contain',
    imageBackground: 'rgba(255,255,255,0.88)',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: width * nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
      return;
    }
    router.replace('/role-selection');
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      return;
    }
    const previousIndex = currentIndex - 1;
    scrollViewRef.current?.scrollTo({
      x: width * previousIndex,
      animated: true,
    });
    setCurrentIndex(previousIndex);
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          style={styles.scrollView}
        >
          {slides.map((slide) => (
            <LinearGradient
              key={slide.id}
              colors={slide.gradient}
              style={styles.slide}
            >
              <View style={styles.slideInner}>
                <View
                  style={[
                    styles.imageWrapper,
                    slide.imageBackground
                      ? { backgroundColor: slide.imageBackground }
                      : null,
                  ]}
                >
                  <Image
                    source={{ uri: slide.image }}
                    style={[
                      styles.image,
                      slide.imageMode === 'contain' && styles.logoImage,
                    ]}
                    resizeMode={slide.imageMode || 'cover'}
                  />
                </View>

                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {isLastSlide ? (
          <View style={styles.finalButtons}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.secondaryButton, styles.finalButton, styles.finalButtonSpacing]}
              onPress={handleBack}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonBase, styles.primaryButton, styles.finalButton]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>Mulai</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navigationRow}>
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.8}>
              <Text style={styles.skipText}>Lewati</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonBase, styles.primaryButton]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>Selanjutnya</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#063CA8',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  slideInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 220,
    height: 220,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logoImage: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: AppColors.white,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
    marginTop: 32,
  },
  skipText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonBase: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryText: {
    color: '#063CA8',
    fontSize: 16,
    fontWeight: '700',
  },
  finalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
    marginTop: 32,
  },
  finalButton: {
    flex: 1,
  },
  finalButtonSpacing: {
    marginRight: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: AppColors.white,
    backgroundColor: 'transparent',
  },
  secondaryText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
