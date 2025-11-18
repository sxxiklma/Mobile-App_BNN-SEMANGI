import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import { AppColors } from '../constants/AppColors';

const LembagaCard = ({ nama, alamat, telepon, foto, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        bg="$white"
        borderRadius="$2xl"
        overflow="hidden"
        mb="$4"
        sx={{
          shadowColor: AppColors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <HStack space="md" p="$4" alignItems="center">
          {}
          <Box
            borderRadius="$lg"
            overflow="hidden"
            w={80}
            h={80}
          >
            <Image
              source={foto}
              alt={nama}
              style={{
                width: 80,
                height: 80,
              }}
              resizeMode="cover"
            />
          </Box>

          {}
          <VStack flex={1} space="xs">
            {}
            <Text
              fontSize="$md"
              fontWeight="$bold"
              color={AppColors.textPrimary}
              numberOfLines={2}
            >
              {nama}
            </Text>

            {}
            <Text
              fontSize="$xs"
              color={AppColors.textSecondary}
              numberOfLines={2}
            >
             {alamat}
            </Text>

            {}
            <Text
              fontSize="$xs"
              color={AppColors.buttonMasyarakat}
              fontWeight="$medium"
            >
              {telepon}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export default LembagaCard;
