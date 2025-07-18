import db from '@/services/couchdb';
import { calculateSalary } from '@/utils/salaryCalculator';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Salary() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    type Summary = { present: number; totalLeaves: number; deductions: number; finalSalary: number };
    const [summary, setSummary] = useState<Summary | null>(null);
    type Helper = { name: string; monthly_salary: number;[key: string]: any };
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
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // "07"

            const firstDayOfMonth = `${year}-${month}-01`;

            // Get last day of the current month
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
            // Count leaves
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
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <View style={{ position: 'relative', marginBottom: 20, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', left: 0, top: 5 }}
                    >
                        <Ionicons name="arrow-back" size={28} color="#333" />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>
                        Salary Summary
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={styles.name}>{helper?.name} <Text style={styles.role}>({helper?.role})</Text></Text>
                </View>

                {summary && (
                    <View style={styles.summaryBox}>
                        <Text style={styles.label}>
                            Present Days: <Text style={styles.value}>{summary.present}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Paid Leaves: <Text style={styles.valueGreen}>2</Text>
                        </Text>
                        <Text style={styles.label}>
                            Unpaid Leaves:{' '}
                            <Text style={styles.valueRed}>{summary.totalLeaves > 2 ? summary.totalLeaves - 2 : summary.totalLeaves}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Total Leaves Taken: <Text style={styles.value}>{summary.totalLeaves}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Deductions: ₹<Text style={styles.valueRed}>{summary.deductions.toFixed(2)}</Text>
                        </Text>
                        <Text style={styles.label}>
                            Final Salary: ₹<Text style={styles.valueGreen}>{summary.finalSalary.toFixed(2)}</Text>
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        paddingHorizontal: 16,
        paddingTop: 24,
        marginVertical: 30
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subheader: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
    },
    cardHeader: {
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
        letterSpacing: 2
    },
    role: {
        fontSize: 14,
        color: '#666',
        paddingLeft: 10,
        letterSpacing: 0
    },
    summaryBox: {
        gap: 10,
    },
    label: {
        fontSize: 16,
        color: '#444',
    },
    value: {
        fontWeight: 'bold',
        color: '#222',
    },
    valueGreen: {
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    valueRed: {
        fontWeight: 'bold',
        color: '#c62828',
    },
});
