import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { AppColors } from '../constants/AppColors';

const LembagaCard = ({ nama, alamat, telepon, foto, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <Image 
          source={foto}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {nama}
          </Text>
          <Text style={styles.address} numberOfLines={2}>
            📍 {alamat}
          </Text>
          <Text style={styles.phone}>
            📞 {telepon}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: AppColors.buttonMasyarakat,
    fontWeight: '600',
  },
});

export default LembagaCard;
