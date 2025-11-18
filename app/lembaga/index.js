import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ScrollView,
  Pressable,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '../../constants/AppColors';
import LembagaCard from '../../components/LembagaCard';
import { getAllLembaga } from '../../services/lembagaService';

const LembagaScreen = () => {
  const router = useRouter();
  const [lembagaList, setLembagaList] = useState([]);

  useEffect(() => {
    const data = getAllLembaga();
    setLembagaList(data);
  }, []);

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
            <HStack alignItems="center" mb="$6">
              <Pressable onPress={() => router.back()} mr="$4">
                <Text fontSize="$2xl" color="$white">
                  
                </Text>
              </Pressable>
              <VStack flex={1}>
                <Heading size="2xl" color="$white">
                  Daftar Lembaga Rehab
                </Heading>
                <Text fontSize="$sm" color="$white" mt="$1">
                  {lembagaList.length} Lembaga Terdaftar
                </Text>
              </VStack>
            </HStack>

            {}
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
          </Box>
        </ScrollView>
      </LinearGradient>
    </Box>
  );
};

export default LembagaScreen;
