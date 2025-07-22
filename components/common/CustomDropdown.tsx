import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

type DropdownItem = {
    label: string;
    value: string;
};

type CommonDropdownProps = {
    label?: string;
    items: DropdownItem[];
    value: string | null;
    onSelect: (value: string) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
    dark?: boolean;
};

const CustomDropdown: React.FC<CommonDropdownProps> = ({
    label,
    items,
    value,
    onSelect,
    placeholder = 'Select',
    containerStyle,
    dark = false,
}) => {
    const [visible, setVisible] = useState(false);

    const selectedLabel = items.find(item => item.value === value)?.label;

    return (
        <View style={[containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: dark ? '#e5e7eb' : '#374151' }]}>{label}</Text>
            )}

            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    {
                        backgroundColor: dark ? '#18181b' : '#f9fafb',
                        borderColor: dark ? '#52525b' : '#d1d5db',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between', // space between text and icon
                        paddingHorizontal: 12,
                    },
                ]}
                onPress={() => setVisible(!visible)}
            >
                <Text style={[styles.dropdownText, { color: dark ? '#f9fafb' : '#111827' }]}>
                    {selectedLabel || placeholder}
                </Text>

                <Ionicons
                    name={visible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={dark ? '#f9fafb' : '#111827'}
                />
            </TouchableOpacity>
            {
                visible && (
                    <Pressable style={{ zIndex: 9999999 }} onPress={() => setVisible(false)}>
                        <View style={[styles.dropdownListContainer,]}>
                            <FlatList
                                data={items}
                                style={{ maxHeight: 150 }}
                                keyExtractor={item => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelect(item.value);
                                            setVisible(false);
                                        }}
                                        style={styles.dropdownItem}
                                    >
                                        <Text style={[styles.dropdownItemText]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                )
            }
        </View>
    );
};

export default CustomDropdown;

const styles = StyleSheet.create({
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
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdownListContainer: {
        width: '100%',
        maxHeight: 300,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        position: 'absolute',
        zIndex: 99999,
        top: 5
    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e7eb',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#111827',
    },
});

