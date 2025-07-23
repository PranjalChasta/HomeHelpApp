import db from '@/services/couchdb';
import { RoleIcon } from '@/utils/roleIcons';
import { getCurrentMonth, months } from '@/utils/salaryCalculator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import SalaryManagement from '../Calculations/SalaryManagementComponent';
import { AddTransactionModal } from '../Modals/AddTransactionModal';
import { EditHelperModal } from '../Modals/EditHelperModal';
import { SideOptionModal } from '../Modals/SideOptionModal';

type HelperDoc = {
    _id: string;
    helper_id: string;
    type: string;
    monthly_salary?: [];
};

export default function HelperDetailPage({ params }: any) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<number>(0);
    const [salary, setSalary] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedName, setEditedName] = useState(params.name);
    const [editedRole, setEditedRole] = useState(params.role);
    const [editedSalary, setEditedSalary] = useState(String(salary));
    const [dotsPosition, setDotsPosition] = useState({ x: 0, y: 0 });
    const dotsRef = useRef<any>({});

    const [transactions, setTransactions] = useState<any[]>([]);
    const [netAmount, setNetAmount] = useState(0);
    const [netDirection, setNetDirection] = useState<'give' | 'take' | null>(null);
    const [txnModalVisible, setTxnModalVisible] = useState(false);
    const [isEditingTxn, setIsEditingTxn] = useState(false);
    const [txnForm, setTxnForm] = useState({
        _id: '',
        amount: '',
        direction: 'give', // or 'take'
        note: '',
    });

    const monthItems = months.map(month => ({ label: month, value: month }));
    const currentMonth = getCurrentMonth();

    const [monthValue, setMonthValue] = useState(currentMonth);
    const [monthItemsState] = useState(monthItems);

    const handleMonthChange = (month: any) => {
        setMonthValue(month);
    };

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch attendance count
            const attRes = await db.getAllDocs() as HelperDoc[];
            const attCount = attRes.filter(
                (doc) => doc.helper_id === params.id && doc.type === 'attendance'
            ).length;
            setAttendance(attCount);

            // Fetch salary (assuming monthly_salary is in params or fetch from db)
            const helperDoc = attRes.find((doc) => doc._id === params.id);
            setSalary(
                (helperDoc?.monthly_salary as { month: string; salary: number }[] | undefined)
                    ?.find(item => item.month === currentMonth)?.salary || 0
            );
        } catch (err) {
            setAttendance(0);
            setSalary(0);
        }
        setLoading(false);
    }, [params?.id, netAmount, netDirection]);

    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            // Fetch attendance count
            const attRes = await db.getAllDocs() as any[];
            // const attCount = attRes.filter(
            //     (doc) => doc.helper_id === params.id && doc.type === 'attendance'
            // ).length;
            const txnDocs = attRes.filter((doc) => doc.helper_id === params.id && doc.type === 'transaction');
            setTransactions(txnDocs);
            let totalGive = 0;
            let totalTake = 0;
            txnDocs?.forEach((txn) => {
                if (txn?.direction === 'give') {
                    totalGive += txn.amount;
                } else if (txn.direction === 'take') {
                    totalTake += txn.amount;
                }
            });

            const net = totalGive - totalTake;

            setNetAmount(Math.abs(net));
            setNetDirection(net > 0 ? 'give' : net < 0 ? 'take' : null);
        } catch (err) {
            // setAttendance(0);
            // setSalary(0);
            setTransactions([]);
        }
        setLoading(false);
    }

    const saveTransactionAmt = async () => {
        try {
            Keyboard.dismiss();
            const isFormValid = txnForm.amount.trim() !== '' && txnForm.direction.trim() !== '' && txnForm.note.trim() !== '';
            if (!isFormValid) {
                Toast.show({
                    type: 'error',
                    text1: 'Incomplete Form',
                    text2: 'Please fill all transaction fields',
                });
                return;
            }
            const date = new Date().toISOString().split('T')[0];
            const doc = {
                _id: txnForm._id || `txn_${date}_${params.id}_${Date.now()}`,
                type: 'transaction',
                helper_id: params.id,
                date,
                amount: parseFloat(txnForm.amount),
                direction: txnForm.direction,
                note: txnForm.note,
            };
            if (isEditingTxn) {
                const oldDoc = await db.getDoc(doc._id);
                await db.updateDoc(doc._id, { ...oldDoc, ...doc });
            } else {
                await db.createDoc(doc);
            }
            setTxnModalVisible(false);
            setTxnForm({ _id: '', amount: '', direction: 'give', note: '' });
            // router.replace(router.asPath); // Refresh screen
        } catch (err) {
            Alert.alert('Error', 'Failed to save transaction');
        }
    }

    const updateHelper = async () => {
        try {
            const doc = await db.getDoc(params.id);
            const updatedDoc = {
                ...doc,
                name: editedName,
                role: editedRole,
                monthly_salary: [
                    ...doc.monthly_salary,
                    {
                        month: monthValue, // from state
                        salary: parseFloat(editedSalary),
                        updated_at: new Date().toISOString()
                    }
                ],
            };
            await db.updateDoc(params.id, updatedDoc);
            params.name = editedName;
            params.role = editedRole;
            setSalary(parseInt(editedSalary));
            setEditModalVisible(false);
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Successfully updated!'
                });
            }, 0);
        } catch (err) {
            Alert.alert('Error', 'Failed to update');
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchDetails();
        }, [fetchDetails])
    );

    useEffect(() => {
        fetchTransactionDetails();
    }, [params.id, txnForm]);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#f3f4f6',
            marginTop: StatusBar.currentHeight
        }}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View style={[
                    styles.card,
                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : '#fff', shadowColor: isDark ? 'transparent' : '#6366f1' }
                ]}>
                    <TouchableOpacity
                        ref={dotsRef}
                        onPress={() => {
                            router.back();
                        }}
                        style={{ position: 'absolute', left: 20, top: 40 }}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#d1d5db' : '#4b5563'} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', marginBottom: 18 }}>
                        <RoleIcon role={params.role} size={48} color={isDark ? '#818cf8' : '#6366f1'} />
                        <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{params.name}</Text>
                        <Text style={[styles.role, { color: isDark ? '#d1d5db' : '#4b5563' }]}>{params.role}</Text>
                    </View>
                    <TouchableOpacity
                        ref={dotsRef}
                        onPress={() => {
                            dotsRef.current?.measure((fx: any, fy: any, width: any, height: any, px: any, py: any) => {
                                setDotsPosition({ x: px, y: py });
                                setModalVisible(true);
                            });
                        }}
                        style={{ position: 'absolute', right: 20, top: 40 }}
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={isDark ? '#d1d5db' : '#4b5563'} />
                    </TouchableOpacity>
                    {loading ? (
                        <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#6366f1'} />
                    ) : (
                        <>
                            <View style={styles.detailRow}>
                                <Ionicons name="card-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                                <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Monthly Salary:</Text>
                                <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>₹ {salary}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="person-outline" size={22} color={isDark ? '#818cf8' : '#6366f1'} />
                                <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#374151' }]}>Role:</Text>
                                <Text style={[styles.detailValue, { color: isDark ? '#f9fafb' : '#1f2937' }]}>{params.role}</Text>
                            </View>
                            {/* Add more details as needed */}
                        </>
                    )}
                </View>
                {
                    transactions && transactions?.length > 0 && (
                        <View style={[
                            styles.card,
                            { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : '#fff', shadowColor: isDark ? 'transparent' : '#6366f1', marginTop: 20 }
                        ]}>
                            {loading ? (
                                <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#6366f1'} />
                            ) : (
                                <View>
                                    <View style={{ alignItems: 'center', marginBottom: 18 }}>
                                        <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                                            Transaction Details
                                        </Text>
                                    </View>

                                    {transactions?.map((txn) => (
                                        <View key={txn._id} style={[styles.detailRow, { justifyContent: 'space-between' }]}>
                                            <View>
                                                <Text style={[styles.detailLabel, { color: isDark ? '#e5e7eb' : '#111827' }]}>
                                                    <Text style={[
                                                        {
                                                            color:
                                                                txn.direction === 'give'
                                                                    ? '#dc2626' // red
                                                                    : txn.direction === 'take'
                                                                        ? '#16a34a' // green
                                                                        : isDark
                                                                            ? '#e5e7eb'
                                                                            : '#111827',
                                                        },
                                                    ]}>₹ {txn.amount}</Text> - {txn.direction}
                                                </Text>
                                                <Text style={{ color: '#6b7280', fontSize: 12 }}>{txn.note}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setTxnForm({
                                                        _id: txn._id,
                                                        amount: String(txn.amount),
                                                        direction: txn.direction,
                                                        note: txn.note || '',
                                                    });
                                                    setIsEditingTxn(true);
                                                    setTxnModalVisible(true);
                                                }}
                                            >
                                                <MaterialCommunityIcons name="pencil-outline" size={20} color={isDark ? '#818cf8' : '#4f46e5'} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    {netDirection !== null && (
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '600',
                                                    color: (isDark ? '#f9fafb' : '#1f2937'),
                                                }}
                                            >
                                                Net: <Text style={{ color: netDirection === 'give' ? '#dc2626' : '#16a34a', }}>₹ {netAmount}</Text> {netDirection === 'give' ? 'to give' : 'to take'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>)
                }
                <View style={[
                    styles.card,
                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : '#fff', shadowColor: isDark ? 'transparent' : '#6366f1', marginTop: 20 }
                ]}>
                    {loading ? (
                        <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#6366f1'} />
                    ) : (
                        <SalaryManagement netAmount={netAmount} netDirection={netDirection} />
                    )}
                </View>

            </ScrollView>

            {/* side Modal */}
            <SideOptionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                dotsPosition={dotsPosition}
                isDark={isDark}
                styles={styles}
                salary={salary}
                setEditedSalary={setEditedSalary}
                setEditModalVisible={setEditModalVisible}
                params={params}
                setTxnForm={setTxnForm}
                setIsEditingTxn={setIsEditingTxn}
                setTxnModalVisible={setTxnModalVisible}
            />

            {/* Edit Modal */}
            <EditHelperModal
                editModalVisible={editModalVisible}
                setEditModalVisible={setEditModalVisible}
                styles={styles}
                isDark={isDark}
                editedName={editedName}
                setEditedName={setEditedName}
                editedRole={editedRole}
                setEditedRole={setEditedRole}
                editedSalary={editedSalary}
                setEditedSalary={setEditedSalary}
                monthValue={monthValue}
                handleMonthChange={handleMonthChange}
                monthItemsState={monthItemsState}
                updateHelper={updateHelper}
            />

            {/* Add/Edit Transaction */}
            <AddTransactionModal
                txnModalVisible={txnModalVisible}
                setTxnModalVisible={setTxnModalVisible}
                styles={styles}
                isEditingTxn={isEditingTxn}
                txnForm={txnForm}
                isDark={isDark}
                setTxnForm={setTxnForm}
                saveTransactionAmt={saveTransactionAmt}
            />

            {/* <Toast /> */}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 22,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 24,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 8,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 'auto',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        elevation: 4,
    },
    modalBtn: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 12,
    },
    modalBtnText: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111827',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 10,
        borderRadius: 8,
        marginBottom: 14,
        fontSize: 16,
        backgroundColor: '#f9fafb',
        color: '#111827',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});