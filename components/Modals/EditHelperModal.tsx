import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import CustomDropdown from '../common/CustomDropdown';

export const EditHelperModal = ({
    editModalVisible,
    setEditModalVisible,
    styles,
    isDark,
    editedName,
    setEditedName,
    editedRole,
    setEditedRole,
    editedSalary,
    setEditedSalary,
    monthValue,
    handleMonthChange,
    monthItemsState,
    updateHelper,
}: any) => {
    return (
        <Modal
            transparent
            animationType="slide"
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20,
                            }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View
                                style={[
                                    styles.modalContent,
                                    {
                                        width: '100%',
                                        maxWidth: 400,
                                        backgroundColor: isDark ? '#18181b' : '#fff',
                                        borderRadius: 16,
                                        padding: 24,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => setEditModalVisible(false)}
                                    style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
                                >
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>

                                <Text style={styles.modalTitle}>Edit Helper</Text>

                                <Text style={[styles.inputLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Name</Text>
                                <TextInput
                                    value={editedName}
                                    onChangeText={setEditedName}
                                    style={styles.inputField}
                                />

                                <Text style={[styles.inputLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Role</Text>
                                <TextInput
                                    value={editedRole}
                                    onChangeText={setEditedRole}
                                    style={styles.inputField}
                                />

                                <Text style={[styles.inputLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Monthly Salary</Text>
                                <TextInput
                                    value={editedSalary}
                                    onChangeText={setEditedSalary}
                                    keyboardType="numeric"
                                    style={styles.inputField}
                                />

                                <CustomDropdown
                                    label="Month"
                                    value={monthValue}
                                    onSelect={handleMonthChange}
                                    items={monthItemsState}
                                    placeholder="Select a month"
                                    dark={isDark}
                                />

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: '#e5e7eb' }]}
                                        onPress={() => setEditModalVisible(false)}
                                    >
                                        <Text style={[styles.buttonText, { color: '#374151' }]}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: '#4f46e5' }]}
                                        onPress={updateHelper}
                                    >
                                        <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
