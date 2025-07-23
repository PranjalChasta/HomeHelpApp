import { Ionicons } from '@expo/vector-icons';
import React, { JSX, useRef, useState } from 'react';
import {
    FlatList,
    Keyboard,
    Modal,
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
    icon?: () => JSX.Element;
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
    const dropdownRefs = useRef<any>({});
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const handleDropdownPress = () => {
        Keyboard.dismiss();
        setTimeout(() => {
            const ref = dropdownRefs.current;
            if (ref) {
                ref.measureInWindow((x: number, y: number, width: number, height: number) => {
                    setDropdownPosition({
                        top: y + height + 5,
                        left: x,
                        width,
                    });
                    setVisible((prev) => !prev);
                });
            }
        }, 100);
    };

    const selectedLabel = items.find(item => item.value === value)?.label;

    return (
        <View style={[containerStyle]} >
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
                ref={(ref) => {
                    if (ref) {
                        dropdownRefs.current = ref;
                    }
                }}
                onPress={() => handleDropdownPress()}
            >
                <Text style={[styles.dropdownText, { color: selectedLabel ? (dark ? '#f9fafb' : '#111827') : (dark ? "#a1a1aa" : "#a1a1aa") }]}>
                    {selectedLabel || placeholder}
                </Text>

                <Ionicons
                    name={visible ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={dark ? '#f9fafb' : '#111827'}
                />
            </TouchableOpacity>

            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    onPress={() => setVisible(false)}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={[styles.dropdownListContainer, {
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        backgroundColor: dark ? '#18181b' : '#f9fafb',
                        borderColor: dark ? '#52525b' : '#d1d5db'
                    },]}>
                        <FlatList
                            data={items}
                            style={{ maxHeight: 150 }}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item.value);
                                        setVisible(false);
                                    }}
                                    style={[styles.dropdownItem,
                                    {
                                        borderBottomColor: dark ? '#38445eff' : '#e6e8e9ff',
                                        borderBottomWidth: index === items.length - 1 ? 0 : 0.5,
                                    }]}
                                >
                                    {item.icon && <View style={{ marginRight: 8 }}>{item.icon()}</View>}
                                    <Text style={[styles.dropdownItemText, { color: dark ? '#f9fafb' : '#111827', }]}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
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
        top: 5,
        borderWidth: 1
    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        display: 'flex',
        flexDirection: 'row'
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#111827',
    },
});

