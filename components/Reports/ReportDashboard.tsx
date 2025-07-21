import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for reports
const attendanceData = [
    { month: 'Jan', present: 28, absent: 3 },
    { month: 'Feb', present: 25, absent: 3 },
    { month: 'Mar', present: 27, absent: 4 },
    { month: 'Apr', present: 26, absent: 4 },
    { month: 'May', present: 29, absent: 2 },
    { month: 'Jun', present: 28, absent: 2 },
];

const salaryData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 12000 },
    { month: 'Mar', amount: 12500 },
    { month: 'Apr', amount: 12500 },
    { month: 'May', amount: 13000 },
    { month: 'Jun', amount: 13000 },
];

export default function ReportDashboard() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const screenWidth = Dimensions.get('window').width;

    // Calculate max values for scaling
    const maxSalary = Math.max(...salaryData.map(item => item.amount));
    const maxAttendance = 31; // Maximum days in a month

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#111827' : '#f9fafb' }
            ]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    Reports & Analytics
                </Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View
                        style={[
                            styles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#10b981' }]}>
                            <Ionicons name="people" size={24} color="#ffffff" />
                        </View>
                        <Text style={[styles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            4
                        </Text>
                        <Text style={[styles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Total Helpers
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#6366f1' }]}>
                            <Ionicons name="calendar" size={24} color="#ffffff" />
                        </View>
                        <Text style={[styles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            95%
                        </Text>
                        <Text style={[styles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Attendance Rate
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
                            <Ionicons name="cash" size={24} color="#ffffff" />
                        </View>
                        <Text style={[styles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            ₹49,500
                        </Text>
                        <Text style={[styles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Monthly Expense
                        </Text>
                    </View>
                </View>

                {/* Attendance Chart */}
                <View
                    style={[
                        styles.chartContainer,
                        { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                    ]}
                >
                    <Text style={[styles.chartTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                        Attendance Overview
                    </Text>

                    <View style={styles.barChartContainer}>
                        {attendanceData.map((item, index) => (
                            <View key={index} style={styles.barGroup}>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: (item.present / maxAttendance) * 150,
                                                backgroundColor: '#6366f1'
                                            }
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: (item.absent / maxAttendance) * 150,
                                                backgroundColor: '#ef4444',
                                                marginLeft: 4
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.barLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                    {item.month}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#6366f1' }]} />
                            <Text style={[styles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Present
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                            <Text style={[styles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Absent
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Salary Chart */}
                <View
                    style={[
                        styles.chartContainer,
                        { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                    ]}
                >
                    <Text style={[styles.chartTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                        Salary Trends
                    </Text>

                    <View style={styles.lineChartContainer}>
                        {/* Line chart background grid */}
                        <View style={styles.chartGrid}>
                            {[0, 1, 2, 3].map((i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.gridLine,
                                        { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Line chart */}
                        <View style={styles.lineChart}>
                            <View style={styles.lineChartInner}>
                                {salaryData.map((item, index) => {
                                    const nextItem = salaryData[index + 1];
                                    if (!nextItem) return null;

                                    const startHeight = (item.amount / maxSalary) * 150;
                                    const endHeight = (nextItem.amount / maxSalary) * 150;

                                    return (
                                        <View key={index} style={styles.lineSegment}>
                                            <View
                                                style={[
                                                    styles.line,
                                                    {
                                                        backgroundColor: '#10b981',
                                                        transform: [
                                                            { translateY: -startHeight },
                                                            { rotate: Math.atan2(endHeight - startHeight, 40) + 'rad' },
                                                            { scaleX: Math.sqrt(Math.pow(40, 2) + Math.pow(endHeight - startHeight, 2)) / 40 }
                                                        ]
                                                    }
                                                ]}
                                            />
                                            <View
                                                style={[
                                                    styles.dot,
                                                    {
                                                        backgroundColor: '#10b981',
                                                        transform: [{ translateY: -startHeight }]
                                                    }
                                                ]}
                                            />
                                        </View>
                                    );
                                })}
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor: '#10b981',
                                            transform: [{ translateY: -(salaryData[salaryData.length - 1].amount / maxSalary) * 150 }],
                                            right: 0
                                        }
                                    ]}
                                />
                            </View>
                        </View>

                        {/* X-axis labels */}
                        <View style={styles.xAxisLabels}>
                            {salaryData.map((item, index) => (
                                <Text
                                    key={index}
                                    style={[
                                        styles.xAxisLabel,
                                        { color: isDark ? '#d1d5db' : '#4b5563' }
                                    ]}
                                >
                                    {item.month}
                                </Text>
                            ))}
                        </View>
                    </View>
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
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
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
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    chartContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        marginBottom: 8,
    },
    barGroup: {
        alignItems: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 150,
    },
    bar: {
        width: 12,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
    },
    lineChartContainer: {
        height: 200,
        position: 'relative',
    },
    chartGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        borderBottomWidth: 1,
    },
    lineChart: {
        height: 150,
        position: 'relative',
    },
    lineChartInner: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'flex-end',
        position: 'relative',
    },
    lineSegment: {
        width: 40,
        height: '100%',
        position: 'relative',
    },
    line: {
        position: 'absolute',
        height: 3,
        width: 40,
        bottom: 0,
        left: 0,
        borderRadius: 1.5,
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        bottom: 0,
        left: 0,
        marginLeft: -4,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    xAxisLabel: {
        fontSize: 12,
        width: 40,
        textAlign: 'center',
    },
});