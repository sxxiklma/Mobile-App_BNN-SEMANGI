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

const BeritaCard = ({ title, excerpt, image, date, onPress }) => {
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
        {}
        <Image
          source={{ uri: image }}
          alt={title}
          style={{
            width: '100%',
            height: 200,
          }}
          resizeMode="cover"
        />

        {}
        <VStack p="$4" space="sm">
          {}
          <HStack alignItems="center">
            <Box
              bg={AppColors.buttonMasyarakat}
              px="$3"
              py="$1"
              borderRadius="$full"
            >
              <Text fontSize="$xs" color="$white" fontWeight="$medium">
                {date}
              </Text>
            </Box>
          </HStack>

          {}
          <Text
            fontSize="$lg"
            fontWeight="$bold"
            color={AppColors.textPrimary}
            numberOfLines={2}
          >
            {title}
          </Text>

          {}
          <Text
            fontSize="$sm"
            color={AppColors.textSecondary}
            numberOfLines={3}
          >
            {excerpt}
          </Text>

          {}
          <Text
            fontSize="$sm"
            color={AppColors.buttonMasyarakat}
            fontWeight="$semibold"
            mt="$2"
          >
            Baca Selengkapnya ’
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default BeritaCard;
