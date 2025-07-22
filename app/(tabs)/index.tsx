import Dashboard from '@/components/Home/DashboardComponent';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback } from 'react';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Clear params when screen is focused
      // navigation.getParent()?.navigate('/helpers', { role: null });
      router.setParams(undefined);
    }, [])
  );
  return (
    <Dashboard />
  );
}

