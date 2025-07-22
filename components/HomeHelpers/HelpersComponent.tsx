import { Helper } from '@/components/Home/DashboardComponent';
import { useColorScheme } from '@/hooks/useColorScheme';
import couchdb from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Helpers({ params }: any) {
    const [helpers, setHelpers] = React.useState<Helper[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        fetchHelpers();
    }, [router]);

    useEffect(() => {
        fetchHelpers();
    }, [params?.role]);

    const fetchHelpers = useCallback(async () => {
        setIsLoading(true);
        try {
            if (params?.role) {
                const selectorData = {
                    role: params?.role,
                    type: 'helper',
                };
                const result = await couchdb.findByRole({ selector: selectorData });
                setHelpers(result?.docs);
            } else {
                const result = await couchdb.getAllDocs();
                const helperItems = result.filter((item: any) => item.role) as Helper[];
                setHelpers(helperItems);
            }
        } catch (error) {
            console.error('Error fetching helpers:', error);
        } finally {
            setIsLoading(false);
        }
    }, [params?.role]);

    useFocusEffect(
        useCallback(() => {
            fetchHelpers();
        }, [fetchHelpers])
    );
    const renderHelperItem = ({ item }: { item: Helper }) => (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
            ]}
            onPress={() => {
                // Navigate to helper details
                router.navigate({
                    pathname: '/helper-details',
                    params: { id: item._id, name: item.name, role: item.role }
                });
            }}
        >
            <View style={styles.avatarContainer}>
                <Ionicons
                    name="person-circle"
                    size={50}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    {item.name}
                </Text>
                <Text style={[styles.role, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                    {item.role}
                </Text>
            </View>
            <View style={styles.actionContainer}>
                <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={isDark ? '#6b7280' : '#9ca3af'}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#111827' : '#e3e3e4ff' }
            ]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    Your Helpers
                </Text>
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        { backgroundColor: isDark ? '#818cf8' : '#6366f1' }
                    ]}
                    onPress={() => router.push('/add-helper')}
                >
                    <Ionicons name="add" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={helpers}
                renderItem={renderHelperItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={isLoading}
                onRefresh={fetchHelpers}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 0.2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 0.5,
    },
    avatarContainer: {
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
    },
    actionContainer: {
        padding: 8,
    },
});