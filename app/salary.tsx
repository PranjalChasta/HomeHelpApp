import HelperDetailPage from '@/components/HomeHelpers/HelperDetailsComponent';
import { useLocalSearchParams } from 'expo-router';

export default function Salary() {
    const params = useLocalSearchParams();
    return (
        <HelperDetailPage params={params} />
    );
}
