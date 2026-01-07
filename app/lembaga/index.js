import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[AppColors.backgroundBlue, AppColors.primaryDark]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Daftar Lembaga Rehab</Text>
                <Text style={styles.subtitle}>
                  {lembagaList.length} Lembaga Terdaftar
                </Text>
              </View>
            </View>

            <View style={styles.listContainer}>
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
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: 'white',
    fontSize: 32,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  listContainer: {
    gap: 12,
  },
});

export default LembagaScreen;
