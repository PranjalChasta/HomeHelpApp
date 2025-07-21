import HelperDetailPage from '@/components/HomeHelpers/HelperDetailsComponent';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function HelperDetailScreen() {
    const params = useLocalSearchParams();
    return (
        <HelperDetailPage params={params} />
    );
}
