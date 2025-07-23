import couchdb from '@/services/couchdb';
import { RoleIcon } from '@/utils/roleIcons';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export const SideOptionModal = ({
    modalVisible,
    setModalVisible,
    dotsPosition,
    isDark,
    styles,
    salary,
    setEditedSalary,
    setEditModalVisible,
    params,
    setTxnForm,
    setIsEditingTxn,
    setTxnModalVisible,
}: any) => {
    return (
        <Modal
            transparent={true}
            backdropColor={"transparent"}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <View style={[styles.modalContent, {
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? dotsPosition.y + 30 : dotsPosition.y,
                    left: Platform.OS === 'ios' ? dotsPosition.x - 150 : dotsPosition.x - 140,
                    width: 'auto',
                    backgroundColor: isDark ? '#fff' : '#111827',
                }]}>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setModalVisible(false);
                            setEditedSalary(String(salary));
                            setEditModalVisible(true);
                        }}
                    >
                        <MaterialCommunityIcons name="pencil-outline" color={isDark ? '#818cf8' : '#6366f1'} size={22} />
                        <Text style={[styles.modalBtnText, { color: isDark ? '#000' : '#fff' }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setModalVisible(false);
                            setTimeout(() => {
                                router.navigate({
                                    pathname: '/attendance',
                                    params: {
                                        id: params.id,
                                        name: params.name,
                                        role: params.role,
                                    },
                                });
                            }, 300);
                        }}
                    >
                        <Ionicons name="calendar-outline" color={isDark ? '#818cf8' : '#6366f1'} size={22} />
                        <Text style={[styles.modalBtnText, { color: isDark ? '#000' : '#fff' }]}>Add Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setModalVisible(false);
                            setEditModalVisible(false);
                            setTxnForm({ _id: '', amount: '', direction: 'give', note: '' });
                            setIsEditingTxn(false);
                            setTxnModalVisible(true);

                        }}
                    >
                        <RoleIcon role="Money" color={isDark ? '#818cf8' : '#6366f1'} size={22} />
                        <Text style={[styles.modalBtnText, { color: isDark ? '#000' : '#fff' }]}>Add Transaction</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setModalVisible(false);
                            Alert.alert('Confirm Delete', 'Are you sure you want to delete this helper?', [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            const doc = await couchdb.getDoc(params.id);
                                            if (doc) await couchdb.deleteDoc(doc._id, doc._rev);
                                            router.back(); // Navigate back
                                            setTimeout(() => {
                                                Toast.show({
                                                    type: 'success',
                                                    text1: 'Deleted successfully!',
                                                });
                                            }, 0);
                                        } catch (err) {
                                            Alert.alert('Error', 'Failed to delete helper');
                                        }
                                    },
                                },
                            ]);
                        }}
                    >
                        <Ionicons name="remove-circle-outline" color={isDark ? '#f14747ff' : '#f14747ff'} size={22} />
                        <Text style={[styles.modalBtnText, { color: '#f14747ff' }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    )
}
