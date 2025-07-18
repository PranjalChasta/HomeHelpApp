import db, { checkConnection } from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';

export default function AddHelperScreen() {
    const { control, handleSubmit, reset } = useForm();
    const router = useRouter();

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
                Alert.alert('Success', 'Helper added successfully!');
                reset();
                router.replace('/'); // Go back to home
            } else {
                console.error('Error:', isConnected);
                Alert.alert('Error', 'Failed to add helper');
            }

        } catch (err) {
            console.error('Error:', err);
            Alert.alert('Error', 'Failed to add helper');
        }
    };

    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: '#f9f9f9',
            marginVertical: 30
        }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <View style={{ position: 'relative', marginBottom: 20, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ position: 'absolute', left: 0, top: 5 }}
                        >
                            <Ionicons name="arrow-back" size={28} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>
                            Add New Helper
                        </Text>
                    </View>

                    <Text style={{ marginBottom: 5 }}>Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., Sunita"
                                placeholderTextColor="#aaa"
                            />
                        )}
                    />

                    <Text style={{ marginBottom: 5, marginTop: 15 }}>Role</Text>
                    <Controller
                        control={control}
                        name="role"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., Cook"
                                placeholderTextColor="#aaa"
                            />
                        )}
                    />

                    <Text style={{ marginBottom: 5, marginTop: 15 }}>Monthly Salary (₹)</Text>
                    <Controller
                        control={control}
                        name="salary"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., 5000"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                            />
                        )}
                    />

                    <View style={{ marginTop: 30 }}>
                        <Button title="Add Helper" onPress={handleSubmit(onSubmit)} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
    },
});
