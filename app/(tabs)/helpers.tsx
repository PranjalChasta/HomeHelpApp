import Helpers from '@/components/HomeHelpers/HelpersComponent';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function HelpersScreen() {
  const params = useLocalSearchParams();
  return (
    <Helpers params={params} />
  );
}