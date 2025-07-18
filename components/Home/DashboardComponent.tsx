import { toastConfig } from '@/hooks/useToastConfig';
import { default as couchdb } from '@/services/couchdb';
import { dashboardStyles } from '@/styles/dashboardStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Button,
    ImageBackground,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

export type Helper = {
    _id: string;
    [key: string]: any;
};

export default function Dashboard() {
    const [helpers, setHelpers] = useState<any[]>([]);
    const [selectedHelper, setSelectedHelper] = useState<any | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editSalary, setEditSalary] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchHelpers();
    }, []);

    const fetchHelpers = async () => {
        const result = await couchdb.getAllDocs();
        setHelpers(result);
    };

    const handleHelperPress = (helper: any) => {
        setSelectedHelper(helper);
        setEditName(helper.name);
        setEditRole(helper.role);
        setEditSalary(helper.monthly_salary);
    };

    const handleUpdate = async () => {
        if (selectedHelper) {
            await couchdb.updateDoc(selectedHelper._id, { ...selectedHelper, name: editName, role: editRole, monthly_salary: editSalary });
            setSelectedHelper(null);
            fetchHelpers();
            Toast.show({
                type: 'success',
                text1: 'Helper updated successfully!',
                position: 'top',
                visibilityTime: 2000,
                topOffset: 80,
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
            <ImageBackground
                source={require('@/assets/images/bg-smart-home.jpg')} // Replace with your background image
                style={dashboardStyles.background}
                resizeMode="cover"
            >

                <ScrollView style={dashboardStyles.container}>
                    <Toast />
                    <Text style={dashboardStyles.header}>Smart Home Helpers</Text>

                    {helpers.filter((item) => item.role).map((helper) => (
                        <TouchableOpacity key={helper._id} onPress={() => handleHelperPress(helper)}>
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
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={dashboardStyles.addButton}
                        onPress={() => router.push({ pathname: `/add-helper` })}
                    >
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                        <Text style={dashboardStyles.addButtonText}>Add Helper</Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* Update Helper Modal */}
                <Modal visible={!!selectedHelper} transparent animationType="slide">
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={{
                            backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%'
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Update Helper</Text>
                            <TextInput
                                placeholder="Name"
                                value={editName}
                                onChangeText={setEditName}
                                style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 5 }}
                            />
                            <TextInput
                                placeholder="Role"
                                value={editRole}
                                onChangeText={setEditRole}
                                style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 5 }}
                            />
                            <TextInput
                                placeholder="Salary"
                                value={editSalary?.toString()}
                                onChangeText={text => setEditSalary(Number(text))}
                                style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 5 }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button title="Cancel" onPress={() => setSelectedHelper(null)} />
                                <Button title="Update" onPress={handleUpdate} />
                            </View>
                        </View>
                    </View>
                </Modal>
                <Toast config={toastConfig} />
            </ImageBackground>
        </SafeAreaView>
    );
}


