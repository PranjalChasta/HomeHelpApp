import { useColorScheme } from '@/hooks/useColorScheme';
import { settingStyles } from '@/styles/settingStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Appearance, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Setting sections and items
const SETTINGS = [
    {
        title: 'Appearance',
        data: [
            { id: 'darkMode', title: 'Dark Mode', type: 'switch', icon: 'moon' },
        ],
    },
    {
        title: 'Notifications',
        data: [
            { id: 'attendanceReminder', title: 'Attendance Reminders', type: 'switch', icon: 'notifications' },
            { id: 'salaryReminder', title: 'Salary Due Reminders', type: 'switch', icon: 'cash' },
        ],
    },
    {
        title: 'Data Management',
        data: [
            { id: 'backup', title: 'Backup Data', type: 'action', icon: 'cloud-upload' },
            { id: 'restore', title: 'Restore Data', type: 'action', icon: 'cloud-download' },
            { id: 'export', title: 'Export as CSV', type: 'action', icon: 'document-text' },
        ],
    },
    {
        title: 'About',
        data: [
            { id: 'about', title: 'About App', type: 'action', icon: 'information-circle' },
            { id: 'help', title: 'Help & Support', type: 'action', icon: 'help-circle' },
            { id: 'privacy', title: 'Privacy Policy', type: 'action', icon: 'shield' },
        ],
    },
];

export default function SettingDashboard() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // State for toggle switches
    const [settings, setSettings] = useState({
        darkMode: isDark,
        attendanceReminder: true,
        salaryReminder: true,
    });

    const handleToggle = (id: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [id]: value }));
        Appearance.setColorScheme(value ? 'dark' : 'light');
        // Here you would implement actual functionality for these toggles
        // For example, changing the theme system-wide
    };

    const handleAction = (id: string) => {
        // Implement actions for buttons
        console.log(`Action triggered: ${id}`);

        // Here you would implement actual functionality
        // For example, triggering a backup or showing an about modal
    };

    const renderItem = (item: any) => {
        const iconColor = isDark ? '#818cf8' : '#6366f1';
        const textColor = isDark ? '#f9fafb' : '#1f2937';
        const secondaryTextColor = isDark ? '#d1d5db' : '#4b5563';

        return (
            <View
                key={item.id}
                style={[
                    settingStyles.settingItem,
                    { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                ]}
            >
                <View style={settingStyles.settingIconContainer}>
                    <Ionicons name={item.icon} size={22} color={iconColor} />
                </View>

                <Text style={[settingStyles.settingTitle, { color: textColor }]}>
                    {item.title}
                </Text>

                {item.type === 'switch' && (
                    <Switch
                        value={settings[item.id as keyof typeof settings]}
                        onValueChange={(value) => handleToggle(item.id, value)}
                        trackColor={{ false: '#d1d5db', true: isDark ? '#4f46e5' : '#6366f1' }}
                        thumbColor="#ffffff"
                    />
                )}

                {item.type === 'action' && (
                    <TouchableOpacity
                        onPress={() => handleAction(item.id)}
                        style={settingStyles.actionButton}
                    >
                        <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView
            style={[
                settingStyles.container,
                { backgroundColor: isDark ? '#111827' : '#f9fafb' }
            ]}
        >
            <View style={settingStyles.header}>
                <Text style={[settingStyles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    Settings
                </Text>
            </View>

            <ScrollView style={settingStyles.scrollView} showsVerticalScrollIndicator={false}>
                {SETTINGS.map((section, index) => (
                    <View
                        key={index}
                        style={[
                            settingStyles.section,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <Text
                            style={[
                                settingStyles.sectionTitle,
                                { color: isDark ? '#d1d5db' : '#4b5563' }
                            ]}
                        >
                            {section.title}
                        </Text>

                        <View style={settingStyles.sectionContent}>
                            {section.data.map(item => renderItem(item))}
                        </View>
                    </View>
                ))}

                <View style={settingStyles.appInfo}>
                    <Text style={[settingStyles.appVersion, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                        Home Help App v1.0.0
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
