import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Center,
  ScrollView,
  Spinner,
  Heading,
  Divider,
  Image,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
import { AppColors } from '../constants/AppColors';
import BeritaCard from '../components/BeritaCard';
import LembagaCard from '../components/LembagaCard';
import { fetchBerita } from '../services/beritaService';
import { getLembagaLimit } from '../services/lembagaService';
import * as WebBrowser from 'expo-web-browser';

const HomeScreen = () => {
  const router = useRouter();

  const [beritaList, setBeritaList] = useState([]);
  const [lembagaList, setLembagaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBerita();
    loadLembaga();
  }, []);

  const loadBerita = async () => {
    try {
      setLoading(true);
      const data = await fetchBerita();
      setBeritaList(data);
    } catch (error) {
      console.error('Error loading berita:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLembaga = () => {

    const data = getLembagaLimit(3);
    setLembagaList(data);
  };

  const handleBeritaPress = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const handleCallPress = (telepon) => {
    Linking.openURL(`tel:${telepon}`);
  };

  const handleLihatSemuaLembaga = () => {
    router.push('/lembaga');
  };

  const handleLembagaPress = (lembaga) => {
    router.push({
      pathname: '/lembaga/detail',
      params: { id: lembaga.id }
    });
  };

  return (
    <Box flex={1}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[AppColors.backgroundBlue, AppColors.primaryDark]}
        style={{ flex: 1 }}
      >
        <ScrollView flex={1}>
          <Box px="$5" pt="$16" pb="$10">
            {}
            <VStack alignItems="center" mb="$8">
              {}
              <Box
                w={100}
                h={100}
                borderRadius="$full"
                overflow="hidden"
                bg={AppColors.white}
                mb="$3"
              >
                <Image
                  source={require('../assets/logo_bnn.png')}
                  alt="Logo BNN"
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  resizeMode="contain"
                />
              </Box>

              {}
              <Text
                fontSize="$lg"
                fontWeight="$bold"
                color={AppColors.textWhite}
                textAlign="center"
              >
                KOTA SURABAYA
              </Text>
            </VStack>

            {}
            <Box
              bg={AppColors.surface}
              borderRadius="$3xl"
              p="$6"
              mb="$6"
              sx={{
                shadowColor: AppColors.black,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <VStack space="md">
                <Heading size="lg" color={AppColors.textPrimary}>
                  Kontak BNN Surabaya
                </Heading>
                
                <Divider bg={AppColors.textSecondary} opacity={0.2} />

                <VStack space="sm">
                  <HStack alignItems="flex-start" space="sm">
                    <Text fontSize="$md" color={AppColors.textPrimary} fontWeight="$semibold" w={70}>
                      Alamat:
                    </Text>
                    <Text fontSize="$md" color={AppColors.textSecondary} flex={1}>
                      Jl. Ngagel Madya V No. 22, Surabaya
                    </Text>
                  </HStack>

                  <HStack alignItems="center" space="sm">
                    <Text fontSize="$md" color={AppColors.textPrimary} fontWeight="$semibold" w={70}>
                      Telepon:
                    </Text>
                    <Button
                      size="sm"
                      variant="link"
                      onPress={() => handleCallPress('081231878822')}
                    >
                      <ButtonText color={AppColors.buttonMasyarakat} fontSize="$md">
                        081231878822
                      </ButtonText>
                    </Button>
                  </HStack>

                  <HStack alignItems="center" space="sm">
                    <Text fontSize="$md" color={AppColors.textPrimary} fontWeight="$semibold" w={70}>
                      Email:
                    </Text>
                    <Text fontSize="$md" color={AppColors.buttonMasyarakat}>
                      rehab.bnnksby@gmail.com
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            {}
            <Box mb="$6">
              <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <Heading size="xl" color="$white">
                   Lembaga Rehab
                </Heading>
              </HStack>

              <VStack space="md">
                {lembagaList.map((lembaga) => (
                  <LembagaCard
                    key={lembaga.id}
                    nama={lembaga.nama}
                    alamat={lembaga.alamat}
                    telepon={lembaga.telepon}
                    foto={lembaga.foto}
                    onPress={() => handleLembagaPress(lembaga)}
                  />
                ))}
              </VStack>

              {}
              <Button
                size="lg"
                bg={AppColors.buttonLembaga}
                borderRadius="$2xl"
                mt="$4"
                onPress={handleLihatSemuaLembaga}
              >
                <ButtonText fontWeight="$semibold">
                  Lihat Semua Lembaga
                </ButtonText>
              </Button>
            </Box>

            {}
            <Box mb="$6">
              <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <Heading size="xl" color="$white">
                  Berita Terkini
                </Heading>
                {loading && <Spinner color="$white" />}
              </HStack>

              {loading ? (
                <Center py="$10">
                  <Spinner size="large" color="$white" />
                  <Text color="$white" mt="$4">
                    Memuat berita
                  </Text>
                </Center>
              ) : (
                <VStack space="md">
                  {beritaList.map((berita) => (
                    <BeritaCard
                      key={berita.id}
                      title={berita.title}
                      excerpt={berita.excerpt}
                      image={berita.image}
                      date={berita.date}
                      onPress={() => handleBeritaPress(berita.link)}
                    />
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        </ScrollView>
      </LinearGradient>
    </Box>
  );
};

export default HomeScreen;
