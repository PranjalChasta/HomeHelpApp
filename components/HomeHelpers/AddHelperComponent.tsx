import db, { checkConnection } from '@/services/couchdb';
import { getMonthName, months } from '@/utils/commonFunction';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import CustomDropdown from '../common/CustomDropdown';
import { AddNewRoleModal } from '../Modals/AddNewRoleModal';

export default function AddHelper() {
    const { control, handleSubmit, reset, setValue } = useForm();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const monthItems = months.map(month => ({ label: month, value: month }));
    const today = new Date();
    const currentMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const currentMonth = getMonthName(currentMonthString);

    const [monthValue, setMonthValue] = useState(currentMonth);
    const [monthItemsState] = useState(monthItems);

    // Dropdown state
    const [roles, setRoles] = React.useState<string[]>([]);
    const [roleItems, setRoleItems] = React.useState<any[]>([]);
    const [roleValue, setRoleValue] = React.useState<string | null>(null);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [newRoleInput, setNewRoleInput] = React.useState('');

    const onSubmit = async (data: any) => {
        try {
            const doc = {
                _id: `helper_${data.role}_${uuid.v4()}`,
                type: 'helper',
                name: data.name,
                role: data.role,
                monthly_salary: [
                    {
                        month: monthValue, // from state
                        salary: parseFloat(data.salary),
                        paid_leave: parseInt(data.paidLeave, 10) || 0,
                        updated_at: new Date().toISOString()
                    }
                ],
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
                setTimeout(() => router.navigate('/helpers'), 300);
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

    // Add new month to dropdown
    const handleMonthChange = (month: any) => {
        setMonthValue(month);
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
            <TouchableNativeFeedback onPress={Keyboard.dismiss} >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, padding: 24 }}
                >
                    <ScrollView contentContainerStyle={{ padding: 0 }}>
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

                            {/* Role Dropdown */}
                            <CustomDropdown
                                label="Role"
                                items={[
                                    ...roleItems,
                                    { label: 'Add New Role', value: 'add_new_role', icon: () => <Ionicons name="add" size={20} color={isDark ? '#818cf8' : '#6366f1'} /> }
                                ]}
                                value={roleValue}
                                onSelect={(value) => {
                                    if (value === 'add_new_role') {
                                        setModalVisible(true);
                                    } else {
                                        setRoleValue(value);
                                    }
                                }}
                                placeholder="Select a role"
                                containerStyle={{ marginTop: 18 }}
                                dark={isDark}
                            />

                            {/* Paid Leave */}
                            <Text style={[
                                styles.label,
                                { marginTop: 18, color: isDark ? '#e5e7eb' : '#374151' }
                            ]}>Paid Leaves</Text>
                            <Controller
                                control={control}
                                name="paidLeave"
                                defaultValue="2"
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
                                        placeholder="e.g., 2"
                                        placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                                        keyboardType="numeric"
                                    />
                                )}
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
                                        onChangeText={(text) => {
                                            const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);

                                            if (text === '') {
                                                onChange('');
                                            } else if (!isNaN(numericValue) && numericValue <= 10000) {
                                                onChange(numericValue.toString());
                                            } else {
                                                Toast.show({ type: 'info', text1: "Salary cannot be more than 10,000" });
                                            }
                                        }}
                                        value={value}
                                        placeholder="e.g., 5000"
                                        placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                                        keyboardType="numeric"
                                    />
                                )}
                            />

                            {/* Month */}
                            <CustomDropdown
                                label="Month"
                                value={monthValue}
                                onSelect={handleMonthChange}
                                items={monthItemsState}
                                placeholder="Select a month"
                                dark={isDark}
                                containerStyle={{ marginTop: 15 }}
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
                    </ScrollView>
                    {/* Modal for adding new role */}
                    <AddNewRoleModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        isDark={isDark}
                        newRoleInput={newRoleInput}
                        setNewRoleInput={setNewRoleInput}
                        handleAddRoleFromModal={handleAddRoleFromModal}
                    />
                    <Toast />
                </KeyboardAvoidingView>
            </TouchableNativeFeedback>
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
    dropdownButton: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
    },
    dropdownText: {
        fontSize: 16,
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