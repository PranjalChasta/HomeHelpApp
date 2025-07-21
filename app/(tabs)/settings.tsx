import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Appearance, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
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

export default function SettingsScreen() {
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
          styles.settingItem,
          { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]}
      >
        <View style={styles.settingIconContainer}>
          <Ionicons name={item.icon} size={22} color={iconColor} />
        </View>

        <Text style={[styles.settingTitle, { color: textColor }]}>
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
            style={styles.actionButton}
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
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#f9fafb' }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {SETTINGS.map((section, index) => (
          <View
            key={index}
            style={[
              styles.section,
              { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#d1d5db' : '#4b5563' }
              ]}
            >
              {section.title}
            </Text>

            <View style={styles.sectionContent}>
              {section.data.map(item => renderItem(item))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Home Help App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionContent: {
    paddingHorizontal: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  actionButton: {
    padding: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 14,
  },
});