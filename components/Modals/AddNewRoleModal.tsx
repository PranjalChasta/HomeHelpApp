import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
// import Toast from 'react-native-toast-message'; // Uncomment if using toast

export const AddNewRoleModal = ({
    modalVisible,
    setModalVisible,
    isDark,
    newRoleInput,
    setNewRoleInput,
    handleAddRoleFromModal,
}: any) => {
    const handleAdd = () => {
        handleAddRoleFromModal();
        // Optional: show toast on success
        // Toast.show({
        //   type: 'success',
        //   text1: 'Role added successfully!',
        // });
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ width: '100%', alignItems: 'center', }}
                    >
                        <View
                            style={{
                                backgroundColor: isDark ? '#18181b' : '#fff',
                                padding: 24,
                                borderRadius: 16,

                                width: '80%',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                                elevation: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: isDark ? '#f9fafb' : '#1f2937',
                                    marginBottom: 12,
                                }}
                            >
                                Add New Role
                            </Text>
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
                                placeholderTextColor={isDark ? '#a1a1aa' : '#6b7280'}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 18,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#27272a' : '#e0e7ff',
                                    }}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text
                                        style={{
                                            color: isDark ? '#818cf8' : '#6366f1',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 18,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#818cf8' : '#6366f1',
                                        marginRight: 8,
                                    }}
                                    onPress={handleAdd}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
