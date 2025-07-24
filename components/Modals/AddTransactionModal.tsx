import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export const AddTransactionModal = ({
    txnModalVisible,
    setTxnModalVisible,
    styles,
    isEditingTxn,
    txnForm,
    isDark,
    setTxnForm,
    saveTransactionAmt,
    handleTransDelete,
}: any) => {
    const handleClose = () => {
        Keyboard.dismiss();
        setTxnModalVisible(false);
    };

    const handleDelete = async () => {
        try {
            handleTransDelete(txnForm.trans_id);
        } catch (err) {
            Alert.alert('Error', 'Failed to delete transaction');
        }
    };

    return (
        <Modal
            transparent
            visible={txnModalVisible}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[styles.modalContent, { width: '90%' }]}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{ position: 'absolute', right: 12, top: 12, zIndex: 10 }}
                        >
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>
                            {isEditingTxn ? 'Edit Transaction' : 'Add Transaction'}
                        </Text>

                        <Text style={styles.inputLabel}>Amount</Text>
                        <TextInput
                            keyboardType="numeric"
                            value={txnForm.amount}
                            placeholder="e.g., 500"
                            placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                            onChangeText={(val) => setTxnForm((prev: any) => ({ ...prev, amount: val }))}
                            style={styles.inputField}
                        />

                        <Text style={styles.inputLabel}>Direction</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
                            {['give', 'take'].map((dir) => {
                                const isActive = txnForm.direction === dir;
                                return (
                                    <TouchableOpacity
                                        key={dir}
                                        style={{
                                            backgroundColor: isActive ? '#4f46e5' : '#e5e7eb',
                                            paddingVertical: 6,
                                            paddingHorizontal: 16,
                                            borderRadius: 6,
                                            marginRight: 12,
                                        }}
                                        onPress={() => setTxnForm((prev: any) => ({ ...prev, direction: dir }))}
                                    >
                                        <Text style={{ color: isActive ? '#fff' : '#111827' }}>
                                            {dir.charAt(0).toUpperCase() + dir.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.inputLabel}>Note</Text>
                        <TextInput
                            value={txnForm.note}
                            onChangeText={(val) => setTxnForm((prev: any) => ({ ...prev, note: val }))}
                            style={styles.inputField}
                            placeholder="Enter note"
                            placeholderTextColor={isDark ? "#a1a1aa" : "#a1a1aa"}
                        />

                        <View style={styles.buttonRow}>
                            {isEditingTxn ? (
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: '#f87171' }]}
                                    onPress={handleDelete}
                                >
                                    <Text style={[styles.buttonText, { color: '#ffffff' }]}>Delete</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: '#e5e7eb' }]}
                                    onPress={handleClose}
                                >
                                    <Text style={[styles.buttonText, { color: '#374151' }]}>Cancel</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#4f46e5' }]}
                                onPress={saveTransactionAmt}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};
