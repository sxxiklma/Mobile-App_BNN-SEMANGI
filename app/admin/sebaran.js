import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiwayat } from '../../context/RiwayatContext';
import AdminBottomNav from '../../components/AdminBottomNav';

const SebaranScreen = () => {
  const router = useRouter();
  const { riwayatList } = useRiwayat();
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const mapInitializedRef = useRef(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Filter data yang punya koordinat - memoized
  const dataWithCoordinates = useMemo(() => {
    console.log('🔵 Sebaran: Processing riwayat data', riwayatList.length, 'items');
    
    const filteredData = riwayatList.filter(item => {
      const hasCoords = item.latitude && item.longitude && 
                       !isNaN(item.latitude) && !isNaN(item.longitude);
      
      if (hasCoords) {
        console.log('✅ Valid coordinates:', {
          nama: item.nama,
          lat: item.latitude,
          lng: item.longitude
        });
      } else {
        console.log('❌ Invalid coordinates:', {
          nama: item.nama || 'No name',
          lat: item.latitude,
          lng: item.longitude,
          hasLat: !!item.latitude,
          hasLng: !!item.longitude
        });
      }
      
      return hasCoords;
    });
    
    console.log('🔵 Sebaran: Filtered data count:', filteredData.length);
    return filteredData;
  }, [riwayatList]);

  // Load Leaflet library once
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.id = 'leaflet-css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else if (window.L) {
      setLeafletLoaded(true);
    }
  }, []);

  // Create or recreate map when needed
  const initializeMap = useCallback(() => {
    if (!leafletLoaded || typeof window === 'undefined' || !window.L) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.log('Map element not found');
      return;
    }

    // Check if map is still valid
    if (mapRef.current) {
      try {
        const container = mapRef.current.getContainer();
        if (container && container.parentNode) {
          // Map is valid, force refresh size and update markers
          console.log('Map exists, refreshing...');
          mapRef.current.invalidateSize();
          updateMarkers();
          return;
        }
      } catch (e) {
        // Map is invalid, need to recreate
        console.log('Map invalid, recreating...');
        mapRef.current = null;
        markersLayerRef.current = null;
        mapInitializedRef.current = false;
      }
    }

    try {
      // Clear any existing Leaflet instance
      if (mapElement._leaflet_id) {
        delete mapElement._leaflet_id;
      }
      mapElement.innerHTML = '';

      // Create map
      const map = window.L.map('map').setView([-7.2575, 112.7521], 12);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create layer group for markers
      const markersLayer = window.L.layerGroup().addTo(map);
      
      mapRef.current = map;
      markersLayerRef.current = markersLayer;
      mapInitializedRef.current = true;

      console.log('Map created');
      
      // Force size calculation
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          updateMarkers();
        }
      }, 100);
    } catch (error) {
      console.error('Error creating map:', error);
    }
  }, [leafletLoaded]);

  // Update markers function
  const updateMarkers = useCallback(() => {
    if (!markersLayerRef.current || typeof window === 'undefined') return;

    console.log('Updating markers, count:', dataWithCoordinates.length);

    try {
      // Clear all markers
      markersLayerRef.current.clearLayers();

      // Add new markers for each client
      dataWithCoordinates.forEach((item) => {
        // Create person icon marker
        const personIcon = window.L.divIcon({
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background-color: #3B82F6;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          `,
          className: 'person-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = window.L.marker([item.latitude, item.longitude], { icon: personIcon })
          .bindPopup(`
            <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 14px; font-weight: bold;">${item.nama}</h3>
              <div style="margin-bottom: 4px; color: #64748B; font-size: 12px;">
                <strong>NIK:</strong> ${item.nik}
              </div>
              <div style="margin-bottom: 4px; color: #64748B; font-size: 12px;">
                <strong>Alamat:</strong> ${item.alamat}
              </div>
              <div style="margin-bottom: 4px; color: #64748B; font-size: 12px;">
                <strong>Lembaga:</strong> ${item.lembaga}
              </div>
              <div style="margin-bottom: 4px; color: #64748B; font-size: 12px;">
                <strong>Tanggal:</strong> ${item.tanggalMasukDisplay}
              </div>
              <div style="margin-top: 4px; color: #64748B; font-size: 12px;">
                <strong>Status:</strong> ${item.status}
              </div>
            </div>
          `);
        
        // Add marker to layer group
        markersLayerRef.current.addLayer(marker);
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [dataWithCoordinates]);

  // Initialize map when screen is focused (like Flutter's didChangeAppLifecycleState)
  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        initializeMap();
      }, 200);

      return () => clearTimeout(timeoutId);
    }, [initializeMap])
  );

  // Update markers when data changes
  useEffect(() => {
    if (mapInitializedRef.current) {
      updateMarkers();
    }
  }, [dataWithCoordinates, updateMarkers]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#063CA8', '#00AEEF']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sebaran Klien</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' && (
            <div
              id="map"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 0,
              }}
            />
          )}
        </View>

      </LinearGradient>

      <AdminBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

export default SebaranScreen;