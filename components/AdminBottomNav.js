import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const AdminBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', icon: 'home-outline', route: '/admin' },
    { label: 'Sebaran', icon: 'map-outline', route: '/admin/sebaran' },
    { label: 'Ajukan', icon: 'person-add-outline', route: '/admin/pengajuan-rehab' },
    { label: 'Riwayat', icon: 'time-outline', route: '/admin/riwayat' },
    { label: 'Akun', icon: 'person-outline', route: '/admin/profile' },
  ];

  const isActive = (route) => {
    if (route === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(route);
  };

  const handleNavigation = (route) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item, index) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              {active ? (
                <LinearGradient
                  colors={['#00AEEF', '#063CA8']}
                  style={styles.activeBackground}
                >
                  <Ionicons name={item.icon} size={20} color="white" />
                  <Text style={[styles.navLabel, styles.navLabelActive]}>{item.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveBackground}>
                  <Ionicons name={item.icon} size={20} color="#B0C4DE" />
                  <Text style={styles.navLabel}>{item.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#063CA8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navBar: {
    flexDirection: 'row',
    height: 65,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  navItem: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  inactiveBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  navLabel: {
    color: '#B0C4DE',
    fontSize: 10,
    fontWeight: '400',
    marginTop: 2,
    textAlign: 'center',
  },
  navLabelActive: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AdminBottomNav;
