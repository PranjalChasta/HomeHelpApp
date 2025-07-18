import { default as couchdb } from '@/services/couchdb';
import { dashboardStyles } from '@/styles/dashboardStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export type Helper = {
    _id: string;
    [key: string]: any;
};

export default function Dashboard() {
    const [helpers, setHelpers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchHelpers();
    }, []);

    const fetchHelpers = async () => {
        const result = await couchdb.getAllDocs();
        setHelpers(result);
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
            <ImageBackground
                source={require('@/assets/images/bg-smart-home.jpg')} // Replace with your background image
                style={dashboardStyles.background}
                resizeMode="cover"
            >
                <ScrollView style={dashboardStyles.container}>
                    <Text style={dashboardStyles.header}>Smart Home Helpers</Text>

                    {helpers.filter((item) => item.role).map((helper) => (
                        <View key={helper._id} style={dashboardStyles.card}>
                            <View style={dashboardStyles.cardHeader}>
                                <Text style={dashboardStyles.name}>
                                    {helper.name}
                                    <Text style={dashboardStyles.role}> ({helper.role})</Text>
                                </Text>
                            </View>

                            <View style={dashboardStyles.actions}>
                                <TouchableOpacity
                                    style={[dashboardStyles.actionBtn, { backgroundColor: '#60a5fa' }]}
                                    onPress={() => router.push({ pathname: `/attendance`, params: { id: helper._id, name: helper.name, role: helper.role } })}
                                >
                                    <Ionicons name="calendar-clear-outline" size={20} color="#fff" />
                                    <Text style={dashboardStyles.actionText}>Attendance</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[dashboardStyles.actionBtn, { backgroundColor: '#34d399' }]}
                                    onPress={() => router.push({ pathname: `/salary`, params: { id: helper._id, name: helper.name } })}
                                >
                                    <Ionicons name="card-outline" size={20} color="#fff" />
                                    <Text style={dashboardStyles.actionText}>Salary</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={dashboardStyles.addButton}
                        onPress={() => router.push({ pathname: `/add-helper` })}
                    >
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                        <Text style={dashboardStyles.addButtonText}>Add Helper</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}


