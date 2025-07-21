import { default as couchdb } from '@/services/couchdb';
import { dashboardStyles } from '@/styles/dashboardStyles';
import { RoleIcon } from '@/utils/roleIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ImageBackground,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export type Helper = {
    _id: string;
    [key: string]: any;
};

export default function Dashboard() {
    const [helpers, setHelpers] = useState<Helper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        fetchHelpers();
    }, []);

    const fetchHelpers = async () => {
        setIsLoading(true);
        try {
            const result = await couchdb.getAllDocs();
            const helperItems = result.filter((item: any) => item.role) as Helper[];
            setHelpers(helperItems);
            const uniqueRoles = Array.from(new Set(helperItems.map(h => h.role)));
            setRoles(uniqueRoles);
        } catch (error) {
            console.error('Error fetching helpers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHelpers();
        setRefreshing(false);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const openListByRole = (role: any) => {
        router.push({ pathname: '/helpers', params: { role } })
    }

    // Calculate stats
    const totalHelpers = helpers.length;
    const activeHelpers = helpers.filter(h => h.active !== false).length;

    return (
        <SafeAreaView style={dashboardStyles.container}>
            <ImageBackground
                source={require('@/assets/images/bg-smart-home.jpg')}
                style={dashboardStyles.backgroundImage}
                imageStyle={{ opacity: isDark ? 0.5 : 0.7 }}
            >
                <ScrollView
                    style={dashboardStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {/* Header Section */}
                    <View style={dashboardStyles.header}>
                        <View>
                            <Text style={[dashboardStyles.greeting, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                {getGreeting()}
                            </Text>
                            <Text style={[dashboardStyles.subtitle, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Welcome to Smart Home App
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[dashboardStyles.profileButton, { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}
                            onPress={() => router.push('/settings')}
                        >
                            <Ionicons name="person" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Overview */}
                    <View style={dashboardStyles.statsContainer}>
                        <View
                            style={[
                                dashboardStyles.statCard,
                                { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                            ]}
                        >
                            <View style={[dashboardStyles.statIconContainer, { backgroundColor: '#6366f1' }]}>
                                <Ionicons name="people" size={20} color="#ffffff" />
                            </View>
                            <Text style={[dashboardStyles.statValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                {totalHelpers}
                            </Text>
                            <Text style={[dashboardStyles.statLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Total Helpers
                            </Text>
                        </View>

                        <View
                            style={[
                                dashboardStyles.statCard,
                                { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                            ]}
                        >
                            <View style={[dashboardStyles.statIconContainer, { backgroundColor: '#10b981' }]}>
                                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                            </View>
                            <Text style={[dashboardStyles.statValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                {activeHelpers}
                            </Text>
                            <Text style={[dashboardStyles.statLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Active Helpers
                            </Text>
                        </View>
                    </View>

                    {/* Roles Overview */}
                    {roles.length > 0 && (
                        <View style={dashboardStyles.quickActionsContainer}>
                            <Text style={[dashboardStyles.sectionTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                Roles
                            </Text>

                            <View style={dashboardStyles.quickActions}>
                                {roles.map((role) => (
                                    <TouchableOpacity key={role} onPress={() => openListByRole(role)} style={[
                                        dashboardStyles.actionCard,
                                        { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                                    ]}>
                                        <RoleIcon role={role} size={22} color="#10b981" />
                                        <Text style={[dashboardStyles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                            {role}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Quick Actions */}
                    <View style={dashboardStyles.quickActionsContainer}>
                        <Text style={[dashboardStyles.sectionTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            Quick Actions
                        </Text>

                        <View style={dashboardStyles.quickActions}>
                            <TouchableOpacity
                                style={[
                                    dashboardStyles.actionCard,
                                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                                ]}
                                onPress={() => router.push('/add-helper')}
                            >
                                <View style={[dashboardStyles.actionIconContainer, { backgroundColor: '#6366f1' }]}>
                                    <Ionicons name="person-add" size={24} color="#ffffff" />
                                </View>
                                <Text style={[dashboardStyles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                    Add Helper
                                </Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                style={[
                  dashboardStyles.actionCard,
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', gap: 10 }
                ]}
                onPress={() => router.push('/attendance')}
              >
                <View style={[dashboardStyles.actionIconContainer, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="calendar" size={24} color="#ffffff" />
                </View>
                <Text style={[dashboardStyles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Attendance
                </Text>
              </TouchableOpacity> */}

                            {/* <TouchableOpacity
                style={[
                  dashboardStyles.actionCard,
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => router.push('/salary')}
              >
                <View style={[dashboardStyles.actionIconContainer, { backgroundColor: '#ef4444' }]}>
                  <Ionicons name="cash" size={24} color="#ffffff" />
                </View>
                <Text style={[dashboardStyles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Salary
                </Text>
              </TouchableOpacity> */}

                            <TouchableOpacity
                                style={[
                                    dashboardStyles.actionCard,
                                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                                ]}
                                onPress={() => router.push('/reports')}
                            >
                                <View style={[dashboardStyles.actionIconContainer, { backgroundColor: '#f59e0b' }]}>
                                    <Ionicons name="stats-chart" size={24} color="#ffffff" />
                                </View>
                                <Text style={[dashboardStyles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                    Reports
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Recent Helpers */}
                    <View style={dashboardStyles.recentHelpersContainer}>
                        <View style={dashboardStyles.sectionHeader}>
                            <Text style={[dashboardStyles.sectionTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                Recent Helpers
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/helpers')}>
                                <Text style={[dashboardStyles.seeAllText, { color: isDark ? '#818cf8' : '#6366f1' }]}>
                                    See All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {helpers.slice(0, 3).map((helper) => (
                            <TouchableOpacity
                                key={helper._id}
                                style={[
                                    dashboardStyles.helperCard,
                                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                                ]}
                                onPress={() => {
                                    router.push({
                                        pathname: `/attendance`,
                                        params: { id: helper._id, name: helper.name, role: helper.role }
                                    });
                                }}
                            >
                                <View style={dashboardStyles.helperAvatarContainer}>
                                    <Ionicons
                                        name="person-circle"
                                        size={46}
                                        color={isDark ? '#818cf8' : '#6366f1'}
                                    />
                                </View>
                                <View style={dashboardStyles.helperInfo}>
                                    <Text style={[dashboardStyles.helperName, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                        {helper.name}
                                    </Text>
                                    <Text style={[dashboardStyles.helperRole, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                        {helper.role}
                                    </Text>
                                </View>
                                <View style={dashboardStyles.helperActions}>
                                    <TouchableOpacity
                                        style={[dashboardStyles.iconButton, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }]}
                                        onPress={() => {
                                            router.push({
                                                pathname: `/attendance`,
                                                params: { id: helper._id, name: helper.name, role: helper.role }
                                            });
                                        }}
                                    >
                                        <Ionicons name="calendar-outline" size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[dashboardStyles.iconButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' }]}
                                        onPress={() => {
                                            router.push({
                                                pathname: `/salary`,
                                                params: { id: helper._id, name: helper.name }
                                            });
                                        }}
                                    >
                                        <Ionicons name="card-outline" size={16} color={isDark ? '#34d399' : '#10b981'} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {helpers.length === 0 && (
                            <View
                                style={[
                                    dashboardStyles.emptyState,
                                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                                ]}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={48}
                                    color={isDark ? '#6b7280' : '#9ca3af'}
                                />
                                <Text style={[dashboardStyles.emptyStateText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                    No helpers added yet
                                </Text>
                                <TouchableOpacity
                                    style={[dashboardStyles.emptyStateButton, { backgroundColor: isDark ? '#818cf8' : '#6366f1' }]}
                                    onPress={() => router.push('/add-helper')}
                                >
                                    <Text style={dashboardStyles.emptyStateButtonText}>Add Helper</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}


