import { useColorScheme } from '@/hooks/useColorScheme';
import couchdb from '@/services/couchdb';
import { reportStyles } from '@/styles/ReportStyles';
import { AttendanceData, getCurrentMonth, getSalaryHistory, getTotalDaysInCurrentMonth, months, SalaryDataType } from '@/utils/salaryCalculator';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Helper } from '../Home/DashboardComponent';

// Mock data for reports
const attendanceData = [
    { month: 'Jan', present: 28, absent: 3 },
    { month: 'Feb', present: 25, absent: 3 },
    { month: 'Mar', present: 27, absent: 4 },
    { month: 'Apr', present: 26, absent: 4 },
    { month: 'May', present: 29, absent: 2 },
    { month: 'Jun', present: 28, absent: 2 },
];

// const salaryData = [
//     { month: 'Jan', amount: 12000 },
//     { month: 'Feb', amount: 12000 },
//     { month: 'Mar', amount: 12500 },
//     { month: 'Apr', amount: 12500 },
//     { month: 'May', amount: 13000 },
//     { month: 'Jun', amount: 13000 },
// ];

export default function ReportDashboard() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const screenWidth = Dimensions.get('window').width;

    const [totalHelpers, setTotalHelpers] = useState(0);
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [maxSalary, setMaxSalary] = useState<number>(0);
    const [attendanceRate, setAttendanceRate] = useState<number>(0);
    const [maxAttendance] = useState<number>(getTotalDaysInCurrentMonth());
    const [salaryData, setSalaryData] = useState<SalaryDataType[]>([]);
    const [sortedSalary, setSortedSalary] = useState<SalaryDataType[]>([]);
    const [monthsLabel, setMonthsLabel] = useState<any>([]);
    // const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);


    const fetchHelpers = useCallback(async () => {
        try {
            const result = await couchdb.getAllDocs();
            const helperItems = result.filter((item: any) => item.role) as Helper[];
            const attendanceDocs = result.filter((d: any) => d.type === 'attendance') as AttendanceData[];
            const currentMonth = getCurrentMonth();

            const totalSalary = helperItems.reduce((sum, h) => sum + (h.monthly_salary?.find((item: any) => item.month === currentMonth)?.salary || 0), 0);
            setMonthlyExpense(totalSalary);

            const total = helperItems.length;
            setTotalHelpers(total);

            const attendancePercentage = maxAttendance > 0 ? Math.round((attendanceDocs.length / maxAttendance) * 100) : 0;
            setAttendanceRate(attendancePercentage);

            const salary = getSalaryHistory(helperItems, months);
            setSalaryData(salary);
        } catch (error) {
            console.error('Error fetching helpers:', error);
        } finally {
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHelpers();
        }, [fetchHelpers])
    );

    const fetchSalaryData = () => {
        const selectedHelper = 'Jayshree Ben'; // Or based on selection
        const filteredSalaryData = salaryData.filter(item => item.name === selectedHelper);


        const sortedSalaryData = [...filteredSalaryData].sort((a, b) => {
            const monthA = a.month?.trim();
            const monthB = b.month?.trim();
            return months.indexOf(monthA) - months.indexOf(monthB);
        });
        setSortedSalary(sortedSalaryData);
        const maxSalary = Math.max(...sortedSalaryData.map(item => item?.amount));
        setMaxSalary(maxSalary);
        // const months: any[] = sortedSalaryData.map(item => item.month);
        setMonthsLabel(months);
    }

    useEffect(() => {
        fetchSalaryData();
    }, [salaryData]);

    return (
        <SafeAreaView
            style={[
                reportStyles.container,
                { backgroundColor: isDark ? '#111827' : '#e3e3e4ff' }
            ]}
        >
            <View style={reportStyles.header}>
                <Text style={[reportStyles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    Reports & Analytics
                </Text>
            </View>

            <ScrollView style={reportStyles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Summary Cards */}
                <View style={reportStyles.summaryContainer}>
                    <View
                        style={[
                            reportStyles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[reportStyles.iconContainer, { backgroundColor: '#10b981' }]}>
                            <Ionicons name="people" size={24} color="#ffffff" />
                        </View>
                        <Text style={[reportStyles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            {totalHelpers}
                        </Text>
                        <Text style={[reportStyles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Total Helpers
                        </Text>
                    </View>

                    <View
                        style={[
                            reportStyles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[reportStyles.iconContainer, { backgroundColor: '#6366f1' }]}>
                            <Ionicons name="calendar" size={24} color="#ffffff" />
                        </View>
                        <Text style={[reportStyles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            {attendanceRate}%
                        </Text>
                        <Text style={[reportStyles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Attendance Rate
                        </Text>
                    </View>

                    <View
                        style={[
                            reportStyles.summaryCard,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                        ]}
                    >
                        <View style={[reportStyles.iconContainer, { backgroundColor: '#ef4444' }]}>
                            <Ionicons name="cash" size={24} color="#ffffff" />
                        </View>
                        <Text style={[reportStyles.summaryValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                            ₹{monthlyExpense.toLocaleString()}
                        </Text>
                        <Text style={[reportStyles.summaryLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                            Monthly Expense
                        </Text>
                    </View>
                </View>

                {/* Attendance Chart */}
                <View
                    style={[
                        reportStyles.chartContainer,
                        { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                    ]}
                >
                    <Text style={[reportStyles.chartTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                        Attendance Overview
                    </Text>

                    <View style={reportStyles.barChartContainer}>
                        {attendanceData.map((item, index) => (
                            <View key={index} style={reportStyles.barGroup}>
                                <View style={reportStyles.barContainer}>
                                    <View
                                        style={[
                                            reportStyles.bar,
                                            {
                                                height: (item.present / maxAttendance) * 150,
                                                backgroundColor: '#6366f1'
                                            }
                                        ]}
                                    />
                                    <View
                                        style={[
                                            reportStyles.bar,
                                            {
                                                height: (item.absent / maxAttendance) * 150,
                                                backgroundColor: '#ef4444',
                                                marginLeft: 4
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[reportStyles.barLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                    {item.month}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={reportStyles.legendContainer}>
                        <View style={reportStyles.legendItem}>
                            <View style={[reportStyles.legendColor, { backgroundColor: '#6366f1' }]} />
                            <Text style={[reportStyles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Present
                            </Text>
                        </View>
                        <View style={reportStyles.legendItem}>
                            <View style={[reportStyles.legendColor, { backgroundColor: '#ef4444' }]} />
                            <Text style={[reportStyles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                                Absent
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Salary Chart */}
                <View
                    style={[
                        reportStyles.chartContainer,
                        { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)' }
                    ]}
                >
                    <Text style={[reportStyles.chartTitle, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                        Salary Trends
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={reportStyles.lineChartContainer}>
                            {/* Line chart background grid */}
                            <View style={reportStyles.chartGrid}>
                                {months.map((i) => (
                                    <View
                                        key={i}
                                        style={[
                                            reportStyles.gridLine,
                                            { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Line chart */}
                            <View style={reportStyles.lineChart}>
                                <View style={reportStyles.lineChartInner}>
                                    {sortedSalary.map((item, index) => {
                                        const nextItem = sortedSalary[index + 1];
                                        if (!nextItem) return null;

                                        const startHeight = (item?.amount / maxSalary) * 150;
                                        const endHeight = (nextItem?.amount / maxSalary) * 150;
                                        const heightDiff = endHeight - startHeight;

                                        return (
                                            <View key={index} style={reportStyles.lineSegment}>
                                                <View
                                                    style={[
                                                        reportStyles.line,
                                                        {
                                                            backgroundColor: '#10b981',
                                                            height: 2,
                                                            width: 40,
                                                            position: 'absolute',
                                                            bottom: startHeight,
                                                            transform: [
                                                                { rotate: `${Math.atan2(heightDiff, 40)}rad` },
                                                                { scaleX: Math.sqrt(40 * 40 + heightDiff * heightDiff) / 40 }
                                                            ],
                                                        }
                                                    ]}
                                                />
                                                <View
                                                    style={[
                                                        reportStyles.dot,
                                                        {
                                                            backgroundColor: '#10b981',
                                                            transform: [{ translateY: -startHeight }]
                                                        }
                                                    ]}
                                                />
                                            </View>
                                        );
                                    })}
                                    {/* Last dot */}
                                    <View
                                        style={[
                                            reportStyles.dot,
                                            {
                                                backgroundColor: '#10b981',
                                                transform: [
                                                    {
                                                        translateY:
                                                            -(sortedSalary[sortedSalary.length - 1]?.amount / maxSalary) * 150
                                                    }
                                                ],
                                                right: 0
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* X-axis labels */}
                            <View style={reportStyles.xAxisLabels}>
                                {months.map((item, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            reportStyles.xAxisLabel,
                                            { color: isDark ? '#d1d5db' : '#4b5563' }
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}