import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ScrollView,
  Pressable,
  Image,
  Button,
  ButtonText,
  Divider,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';
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
      <Box flex={1} bg={AppColors.backgroundBlue}>
        <StatusBar style="light" />
      </Box>
    );
  }

  const InfoRow = ({ label, value, color = AppColors.textSecondary }) => (
    <HStack alignItems="flex-start" space="sm" mb="$3">
      <Text fontSize="$md" color={AppColors.textPrimary} fontWeight="$semibold" w={140}>
        {label}
      </Text>
      <Text fontSize="$md" color={color} flex={1}>
        {value}
      </Text>
    </HStack>
  );

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
            <HStack alignItems="center" mb="$6">
              <Pressable onPress={() => router.back()} mr="$4">
                <Text fontSize="$2xl" color="$white">
                
                </Text>
              </Pressable>
              <Heading size="xl" color="$white" flex={1}>
                Detail Lembaga
              </Heading>
            </HStack>

            {}
            <Box
              bg={AppColors.surface}
              borderRadius="$3xl"
              overflow="hidden"
              sx={{
                shadowColor: AppColors.black,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {}
              <Image
                source={lembaga.foto}
                alt={lembaga.nama}
                style={{
                  width: '100%',
                  height: 250,
                }}
                resizeMode="cover"
              />

              {}
              <VStack p="$6" space="md">
                {}
                <Heading size="xl" color={AppColors.textPrimary}>
                  {lembaga.nama}
                </Heading>

                <Divider bg={AppColors.textSecondary} opacity={0.2} />

                {}
                <VStack space="xs">
                  <Text fontSize="$lg" fontWeight="$bold" color={AppColors.textPrimary} mb="$2">
                     Informasi Kontak
                  </Text>
                  
                  <InfoRow label="Telepon:" value={lembaga.telepon} color={AppColors.buttonMasyarakat} />
                  <InfoRow label="Email:" value={lembaga.email} color={AppColors.buttonMasyarakat} />
                  <InfoRow label="PIC:" value={lembaga.pic} />
                </VStack>

                <Divider bg={AppColors.textSecondary} opacity={0.2} />

                {}
                <VStack space="xs">
                  <Text fontSize="$lg" fontWeight="$bold" color={AppColors.textPrimary} mb="$2">
                    Alamat
                  </Text>
                  <Text fontSize="$md" color={AppColors.textSecondary}>
                    {lembaga.alamat}
                  </Text>
                </VStack>

                <Divider bg={AppColors.textSecondary} opacity={0.2} />

                {}
                <VStack space="xs">
                  <Text fontSize="$lg" fontWeight="$bold" color={AppColors.textPrimary} mb="$2">
                    Kapasitas Layanan
                  </Text>
                  
                  <InfoRow label="Pria:" value={`${lembaga.kapasitas_pria} orang`} />
                  <InfoRow label="Wanita:" value={`${lembaga.kapasitas_wanita} orang`} />
                  <InfoRow label="Rawat Jalan:" value={`${lembaga.kapasitas_rawat_jalan} orang`} />
                  
                  <Box mt="$2" bg={AppColors.buttonLembaga} p="$3" borderRadius="$xl">
                    <Text fontSize="$md" color="$white" fontWeight="$bold" textAlign="center">
                      Total Kapasitas: {lembaga.kapasitas_pria + lembaga.kapasitas_wanita + lembaga.kapasitas_rawat_jalan} orang
                    </Text>
                  </Box>
                </VStack>

                {}
                <VStack space="md" mt="$4">
                  <Button
                    size="lg"
                    bg={AppColors.buttonMasyarakat}
                    borderRadius="$2xl"
                    onPress={() => handleCallPress(lembaga.telepon)}
                  >
                    <ButtonText fontWeight="$semibold">
                      Hubungi Sekarang
                    </ButtonText>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    borderColor={AppColors.buttonMasyarakat}
                    borderRadius="$2xl"
                    onPress={() => handleEmailPress(lembaga.email)}
                  >
                    <ButtonText fontWeight="$semibold" color={AppColors.buttonMasyarakat}>
                       Kirim Email
                    </ButtonText>
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </LinearGradient>
    </Box>
  );
};

export default DetailLembagaScreen;
