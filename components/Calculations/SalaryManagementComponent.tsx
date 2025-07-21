import db from '@/services/couchdb';
import { RoleIcon } from '@/utils/roleIcons';
import { calculateSalary } from '@/utils/salaryCalculator';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function SalaryManagement() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    type Summary = { present: number; totalLeaves: number; deductions: number; finalSalary: number };
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(false);
    type Helper = { name: string; monthly_salary: number; role?: string;[key: string]: any };
    const [helper, setHelper] = useState<Helper | null>(null);

    useEffect(() => {
        generateSummary();
    }, [id]);

    const generateSummary = async () => {
        try {
            const helperDoc = await db.getDoc(id as string);
            setHelper(helperDoc);
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const firstDayOfMonth = `${year}-${month}-01`;
            const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
            const lastDayOfMonth = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

            const selectorData = {
                date: {
                    $gte: firstDayOfMonth,
                    $lte: lastDayOfMonth
                },
                helper_id: id.toString(),
                type: "attendance"
            };
            const result = await db.find({
                selector: selectorData
            });
            const leaveCount = result.docs.filter((d: any) => d.status === 'leave').length;
            const monthNumber = now.getMonth();
            const totalDays = new Date(year, monthNumber + 1, 0).getDate();
            const present = totalDays;

            const salary = calculateSalary(helperDoc.monthly_salary, present, leaveCount, totalDays);
            setSummary({ present, totalLeaves: leaveCount, ...salary });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', marginBottom: 18 }}>
                <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#1f2937' }]}>SALARY DETAILS</Text>
            </View>
            {loading && summary ? (
                <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#6366f1'} />
            ) : (
                summary && (<>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Present:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary?.present}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="card-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Paid Leave:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{2}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <RoleIcon role="Absent" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Unpaid Leave:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary.totalLeaves > 2 ? summary.totalLeaves - 2 : summary.totalLeaves}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <RoleIcon role="Leave" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Total Leave Taken:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary.totalLeaves}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <RoleIcon role="Deduction" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Deductions:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary.deductions.toFixed(2)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <RoleIcon role="Total Salary" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Final Salary:</Text>
                        <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{summary.finalSalary}</Text>
                    </View>
                </>)
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