import db, { checkConnection } from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';

export default function AddHelper() {
    const { control, handleSubmit, reset, setValue } = useForm();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const onSubmit = async (data: any) => {
        try {
            const doc = {
                _id: `helper_${data.role}_${uuid.v4()}`,
                type: 'helper',
                name: data.name,
                role: data.role,
                monthly_salary: parseFloat(data.salary),
            };
            const isConnected = await checkConnection();
            if (isConnected) {
                await db.createDoc(doc);
                Toast.show({
                    type: 'success',
                    text1: 'Helper added successfully!',
                    position: 'top',
                    topOffset: 80,
                });
                reset();
                setTimeout(() => router.replace('/'), 1200);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to add helper',
                    position: 'top',
                    topOffset: 80,
                });
            }
        } catch (err) {
            console.error('Error:', err);
            Toast.show({
                type: 'error',
                text1: 'Failed to add helper',
                position: 'top',
                topOffset: 80,
            });
        }
    };

    // Dropdown state
    const [roles, setRoles] = React.useState<string[]>([]);
    const [roleItems, setRoleItems] = React.useState<any[]>([]);
    const [open, setOpen] = React.useState(false);
    const [roleValue, setRoleValue] = React.useState<string | null>(null);
    const [newRole, setNewRole] = React.useState('');

    const [modalVisible, setModalVisible] = React.useState(false);
    const [newRoleInput, setNewRoleInput] = React.useState('');


    // Fetch roles from CouchDB
    React.useEffect(() => {
        const fetchRoles = async () => {
            const result = await db.getAllDocs();
            const helperItems = result.filter((item: any) => item.role);
            const uniqueRoles = Array.from(new Set(helperItems.map((h: any) => h.role)));
            setRoles(uniqueRoles);
            setRoleItems(uniqueRoles.map(role => ({ label: role, value: role })));
        };
        fetchRoles();
    }, []);

    // When dropdown value changes, update form value
    React.useEffect(() => {
        setValue('role', roleValue || '');
    }, [roleValue]);

    // Add new role to dropdown
    const handleAddRole = () => {
        if (newRole && !roles.includes(newRole)) {
            setRoles(prev => [...prev, newRole]);
            setRoleItems(prev => [...prev, { label: newRole, value: newRole }]);
            setRoleValue(newRole);
            setNewRole('');
        }
    };

    const handleAddRoleFromModal = () => {
        if (newRoleInput && !roles.includes(newRoleInput)) {
            setRoles(prev => [...prev, newRoleInput]);
            setRoleItems(prev => [...prev, { label: newRoleInput, value: newRoleInput }]);
            setRoleValue(newRoleInput);
        }
        setNewRoleInput('');
        setModalVisible(false);
    };


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isDark ? '#18181b' : '#f3f4f6',
            marginTop: StatusBar.currentHeight
        }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1, padding: 24 }}
            >
                {/* <ScrollView contentContainerStyle={{ padding: 24 }}> */}
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[
                            styles.backButton,
                            { backgroundColor: isDark ? '#27272a' : '#e0e7ff' }
                        ]}
                    >
                        <Ionicons name="arrow-back" size={28} color={isDark ? '#818cf8' : '#6366f1'} />
                    </TouchableOpacity>
                    <Text style={[
                        styles.headerTitle,
                        { color: isDark ? '#f9fafb' : '#1f2937' }
                    ]}>Add New Helper</Text>
                </View>

                {/* Card */}
                <View style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? 'transparent' : '#fff',
                        shadowColor: isDark ? 'transparent' : '#6366f1'
                    }
                ]}>
                    {/* Name */}
                    <Text style={[
                        styles.label,
                        { color: isDark ? '#e5e7eb' : '#374151' }
                    ]}>Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: isDark ? '#18181b' : '#f9fafb',
                                        color: isDark ? '#f9fafb' : '#111827',
                                        borderColor: isDark ? '#52525b' : '#d1d5db'
                                    }
                                ]}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., Sunita"
                                placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                            />
                        )}
                    />

                    {/* Role */}
                    {/* <Text style={[
                            styles.label,
                            { marginTop: 18, color: isDark ? '#e5e7eb' : '#374151' }
                        ]}>Role</Text>
                        <Controller
                            control={control}
                            name="role"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark ? '#18181b' : '#f9fafb',
                                            color: isDark ? '#f9fafb' : '#111827',
                                            borderColor: isDark ? '#52525b' : '#d1d5db'
                                        }
                                    ]}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g., Cook"
                                    placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                                />
                            )}
                        /> */}
                    {/* Role Dropdown */}
                    <Text style={[
                        styles.label,
                        { marginTop: 18, color: isDark ? '#e5e7eb' : '#374151' }
                    ]}>Role</Text>
                    <DropDownPicker
                        open={open}
                        value={roleValue}
                        items={[
                            ...roleItems,
                            { label: 'Add New Role', value: 'add_new_role', icon: () => <Ionicons name="add" size={20} color={isDark ? '#818cf8' : '#6366f1'} /> }
                        ]}
                        setOpen={setOpen}
                        setValue={callbackOrValue => {
                            // DropDownPicker passes either a value or a callback, so handle both
                            const value = typeof callbackOrValue === 'function' ? callbackOrValue(roleValue) : callbackOrValue;
                            if (value === 'add_new_role') {
                                setOpen(false);
                                setModalVisible(true);
                            } else {
                                setRoleValue(value);
                            }
                        }}
                        setItems={setRoleItems}
                        placeholder="Select a role"
                        style={{
                            backgroundColor: isDark ? '#18181b' : '#f9fafb',
                            borderColor: isDark ? '#52525b' : '#d1d5db',
                        }}
                        textStyle={{
                            color: isDark ? '#f9fafb' : '#111827',
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: isDark ? '#18181b' : '#fff',
                        }}
                    />

                    {/* Salary */}
                    <Text style={[
                        styles.label,
                        { marginTop: 18, color: isDark ? '#e5e7eb' : '#374151' }
                    ]}>Monthly Salary (₹)</Text>
                    <Controller
                        control={control}
                        name="salary"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: isDark ? '#18181b' : '#f9fafb',
                                        color: isDark ? '#f9fafb' : '#111827',
                                        borderColor: isDark ? '#52525b' : '#d1d5db'
                                    }
                                ]}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., 5000"
                                placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                                keyboardType="numeric"
                            />
                        )}
                    />

                    {/* Button */}
                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            { backgroundColor: isDark ? '#818cf8' : '#6366f1', shadowColor: isDark ? '#818cf8' : '#6366f1' }
                        ]}
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Ionicons name="person-add" size={22} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.addButtonText}>Add Helper</Text>
                    </TouchableOpacity>
                </View>
                {/* </ScrollView> */}
                {/* Modal for adding new role */}
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}>
                        <View style={{
                            backgroundColor: isDark ? '#18181b' : '#fff',
                            padding: 24,
                            borderRadius: 16,
                            width: '80%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 10,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: isDark ? '#f9fafb' : '#1f2937',
                                marginBottom: 12,
                            }}>Add New Role</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: isDark ? '#52525b' : '#d1d5db',
                                    backgroundColor: isDark ? '#18181b' : '#f9fafb',
                                    color: isDark ? '#f9fafb' : '#111827',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16,
                                    marginBottom: 16,
                                }}
                                value={newRoleInput}
                                onChangeText={setNewRoleInput}
                                placeholder="Enter new role"
                                placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 18,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#818cf8' : '#6366f1',
                                        marginRight: 8,
                                    }}
                                    onPress={handleAddRoleFromModal}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 18,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#27272a' : '#e0e7ff',
                                    }}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: isDark ? '#818cf8' : '#6366f1', fontWeight: 'bold' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginRight: 10,
        padding: 4,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    card: {
        borderRadius: 18,
        padding: 22,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 28,
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 1,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});