import { Helper } from '@/components/Home/DashboardComponent';
import { useColorScheme } from '@/hooks/useColorScheme';
import { default as couchdb } from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  
  // Calculate stats
  const totalHelpers = helpers.length;
  const activeHelpers = helpers.filter(h => h.active !== false).length;
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/bg-smart-home.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: isDark ? 0.5 : 0.7 }}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                {getGreeting()}
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                Welcome to Home Help App
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.profileButton, { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="person" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
            </TouchableOpacity>
          </View>
          
          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View 
              style={[
                styles.statCard, 
                { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
              ]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: '#6366f1' }]}>
                <Ionicons name="people" size={20} color="#ffffff" />
              </View>
              <Text style={[styles.statValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                {totalHelpers}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                Total Helpers
              </Text>
            </View>
            
            <View 
              style={[
                styles.statCard, 
                { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
              ]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: '#10b981' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
              </View>
              <Text style={[styles.statValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                {activeHelpers}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                Active Helpers
              </Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
              Quick Actions
            </Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[
                  styles.actionCard, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => router.push('/add-helper')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: '#6366f1' }]}>
                  <Ionicons name="person-add" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Add Helper
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionCard, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => router.push('/attendance')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="calendar" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Attendance
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionCard, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => router.push('/salary')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: '#ef4444' }]}>
                  <Ionicons name="cash" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Salary
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionCard, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => router.push('/reports')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: '#f59e0b' }]}>
                  <Ionicons name="stats-chart" size={24} color="#ffffff" />
                </View>
                <Text style={[styles.actionLabel, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                  Reports
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Recent Helpers */}
          <View style={styles.recentHelpersContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                Recent Helpers
              </Text>
              <TouchableOpacity onPress={() => router.push('/helpers')}>
                <Text style={[styles.seeAllText, { color: isDark ? '#818cf8' : '#6366f1' }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            {helpers.slice(0, 3).map((helper) => (
              <TouchableOpacity
                key={helper._id}
                style={[
                  styles.helperCard, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
                onPress={() => {
                  router.push({
                    pathname: `/attendance`,
                    params: { id: helper._id, name: helper.name, role: helper.role }
                  });
                }}
              >
                <View style={styles.helperAvatarContainer}>
                  <Ionicons
                    name="person-circle"
                    size={46}
                    color={isDark ? '#818cf8' : '#6366f1'}
                  />
                </View>
                <View style={styles.helperInfo}>
                  <Text style={[styles.helperName, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    {helper.name}
                  </Text>
                  <Text style={[styles.helperRole, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                    {helper.role}
                  </Text>
                </View>
                <View style={styles.helperActions}>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }]}
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
                    style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' }]}
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
                  styles.emptyState, 
                  { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                ]}
              >
                <Ionicons 
                  name="people-outline" 
                  size={48} 
                  color={isDark ? '#6b7280' : '#9ca3af'} 
                />
                <Text style={[styles.emptyStateText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                  No helpers added yet
                </Text>
                <TouchableOpacity 
                  style={[styles.emptyStateButton, { backgroundColor: isDark ? '#818cf8' : '#6366f1' }]}
                  onPress={() => router.push('/add-helper')}
                >
                  <Text style={styles.emptyStateButtonText}>Add Helper</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  profileButton: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentHelpersContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helperAvatarContainer: {
    marginRight: 12,
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helperRole: {
    fontSize: 14,
  },
  helperActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

