import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { AppColors } from '../constants/AppColors';

const BeritaCard = ({ title, excerpt, image, date, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{date}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={3}>
          {excerpt}
        </Text>
        <Text style={styles.readMore}>
          Baca Selengkapnya →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.buttonMasyarakat,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    color: AppColors.buttonMasyarakat,
    fontWeight: 'bold',
  },
});

export default BeritaCard;
