import db from '@/services/couchdb';
import { RoleIcon } from '@/utils/roleIcons';
import { calculateSalary, getCurrentMonth } from '@/utils/salaryCalculator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function SalaryManagement({ netAmount = 0, netDirection = null }: any) {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    type Summary = {
        present: number;
        totalLeaves: number;
        unpaidLeaves: number;
        deductions: number;
        finalSalary: number,
        netAmt: number,
        netDir: string
    };
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);

    const generateSummary = useCallback(async () => {
        setLoading(true);
        try {
            const helperDoc = await db.getDoc(id as string);
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const currentMonthPrefix = `${year}-${month}`; // e.g. "2025-07"

            const result = await db.find({
                selector: {
                    type: "attendance",
                    helper_id: id.toString(),
                }
            });
            const allDates: string[] = result.docs.flatMap((doc: any) => doc.dates || []);
            const currentMonthDates = allDates.filter(date => date.startsWith(currentMonthPrefix));
            const leaveCount = result.docs.flatMap((doc: any) => (doc.status === 'leave' ? doc.dates : []) || [])
                .filter((date: string) => date.startsWith(currentMonthPrefix)).length;

            const totalDays = new Date(year, now.getMonth() + 1, 0).getDate();
            const present = currentMonthDates.length;

            const currentMonth = getCurrentMonth();

            const monthlySalary = (helperDoc.monthly_salary as { month: string; salary: number }[] | undefined)
                ?.find(item => item.month === currentMonth)?.salary || 0;

            const salary = calculateSalary(monthlySalary, present, leaveCount, totalDays, netAmount, netDirection);
            const unPaid = leaveCount > 2 ? leaveCount - 2 : 0;

            setSummary({
                ...salary,
                present,
                totalLeaves: leaveCount,
                unpaidLeaves: unPaid,
                netAmt: netAmount,
                netDir: netDirection
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, netAmount, netDirection]);

    useEffect(() => {
        generateSummary();
    }, [generateSummary]);



    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', marginBottom: 18 }}>
                <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#1f2937' }]}>SALARY DETAILS</Text>
            </View>
            {loading && summary ? (
                <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#6366f1'} />
            ) : (
                summary && (
                    <>
                        <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Present:</Text>
                            <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary?.present}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="card-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Total Paid Leaves:</Text>
                            <Text style={[styles.detailValue, { color: '#16a34a' }]}>{2}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <RoleIcon role="Absent" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Unpaid Leave:</Text>
                            <Text style={[styles.detailValue, { color: '#dc2626' }]}>{summary.unpaidLeaves}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <RoleIcon role="Leave" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Total Leave Taken:</Text>
                            <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary.totalLeaves}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <RoleIcon role="Deduction" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Leave Deductions:</Text>
                            <Text style={[styles.detailValue, { color: '#dc2626' }]}>₹ {summary.deductions.toFixed(2)}</Text>
                        </View>
                        {
                            summary?.netAmt !== 0 && summary?.netDir !== null && (
                                <View style={styles.detailRow}>
                                    <MaterialCommunityIcons name="cash-100" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                                    <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Net Transaction:</Text>
                                    <Text
                                        style={[styles.detailValue, {
                                            color: summary?.netDir === 'take' ? '#dc2626' : '#16a34a',
                                        }]}
                                    >
                                        ₹ {summary.netAmt.toFixed(2)}
                                    </Text>
                                </View>
                            )
                        }
                        <View style={styles.detailRow}>
                            <RoleIcon role="Total Salary" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                            <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Final Salary:</Text>
                            <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>₹ {summary.finalSalary}</Text>
                        </View>
                    </>
                )
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 20,
        elevation: 3,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginBottom: 24,
    },
    cardHeader: {
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1
    },
    summaryBox: {
        gap: 10,
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontWeight: 'bold',
    },
    valueGreen: {
        fontWeight: 'bold',
    },
    valueRed: {
        fontWeight: 'bold',
    },

    role: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
    },
});