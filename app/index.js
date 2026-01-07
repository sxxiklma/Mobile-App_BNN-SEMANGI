import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Give some time for layout to be ready, then redirect
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return (
    <LinearGradient colors={['#063CA8', '#0066CC', '#00AEEF']} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </LinearGradient>
  );
}


