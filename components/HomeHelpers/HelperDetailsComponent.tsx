import db from '@/services/couchdb';
import { getCurrentMonth, months } from '@/utils/commonFunction';
import { RoleIcon } from '@/utils/roleIcons';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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
import { SkeletonBlock } from '../common/CustomAnimated';

type HelperDoc = {
    _id: string;
    helper_id: string;
    type: string;
    monthly_salary?: [];
    dates?: [];
};

export default function HelperDetailPage({ params }: any) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [loading, setLoading] = useState(true);
    const [salary, setSalary] = useState<number>(0);
    const [paidLeave, setPaidLeave] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedName, setEditedName] = useState(params.name);
    const [editedRole, setEditedRole] = useState(params.role);
    const [editedPaidLeave, setEditedPaidLeave] = useState(String(2));
    const [editedSalary, setEditedSalary] = useState(String(salary));
    const [dotsPosition, setDotsPosition] = useState({ x: 0, y: 0 });
    const dotsRef = useRef<any>({});

    const [transactions, setTransactions] = useState<any[]>([]);
    const [netAmount, setNetAmount] = useState(0);
    const [netDirection, setNetDirection] = useState<'give' | 'take' | null>(null);
    const [txnModalVisible, setTxnModalVisible] = useState(false);
    const [isEditingTxn, setIsEditingTxn] = useState(false);
    const [txnForm, setTxnForm] = useState({
        trans_id: '',
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
            const attCount = attRes?.find(
                (doc) => doc.helper_id === params.id && doc.type === 'attendance'
            )?.dates?.length || 0;

            const helperDoc = attRes.find((doc) => doc._id === params.id);
            setSalary(
                (helperDoc?.monthly_salary as { month: string; salary: number }[] | undefined)
                    ?.find(item => item.month === currentMonth)?.salary || 0
            );
            setPaidLeave(
                (helperDoc?.monthly_salary as { month: string; salary: number; paid_leave: number }[] | undefined)
                    ?.find(item => item.month === currentMonth)?.paid_leave || 2
            );
        } catch (err) {
            setSalary(0);
        }
        setLoading(false);
    }, [params?.id, netAmount, netDirection, editModalVisible]);

    const handleTransDelete = async (transId: string) => {
        const docId = `txn_${params.id}`;

        try {
            const res = await db.getDoc(docId);

            if (!res || !res.trans_detail || !Array.isArray(res.trans_detail)) {
                alert("No transaction data found.");
                return;
            }

            const updatedDetails = res.trans_detail.filter(
                (txn: any) => txn.trans_id !== transId
            );

            if (updatedDetails.length === 0) {
                // If no transactions remain, delete the entire document
                await db.deleteDoc(res._id, res._rev);
            } else {
                // Update doc with filtered transaction list
                await db.updateDoc(docId, {
                    ...res,
                    trans_detail: updatedDetails,
                });
            }
            setTxnModalVisible(false);
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Transaction Deleted',
                });


                // Optional: refresh data or UI
                fetchTransactionDetails();

            }, 100);
        } catch (err) {
            console.error("❌ Error deleting transaction:", err);
            alert("Failed to delete transaction.");
        }
    };

    const fetchTransactionDetails = async () => {
        setLoading(true);
        try {
            const attRes = await db.getAllDocs() as any[];

            const txnDoc = attRes.find(
                (doc) => doc.helper_id === params.id && doc.type === 'transaction'
            );

            let allTransactions = txnDoc?.trans_detail || [];

            setTransactions(allTransactions); // Store full array for display

            let totalGive = 0;
            let totalTake = 0;

            allTransactions.forEach((txn: any) => {
                if (txn.direction === 'give') {
                    totalGive += parseFloat(txn.amount || 0);
                } else if (txn.direction === 'take') {
                    totalTake += parseFloat(txn.amount || 0);
                }
            });

            const net = totalGive - totalTake;

            setNetAmount(Math.abs(net));
            setNetDirection(net > 0 ? 'give' : net < 0 ? 'take' : null);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setTransactions([]);
            setNetAmount(0);
            setNetDirection(null);
        }
        setLoading(false);
    };

    const saveTransactionAmt = async (transId: any) => {
        Keyboard.dismiss();

        const isFormValid =
            txnForm.amount.trim() !== '' &&
            txnForm.direction.trim() !== '' &&
            txnForm.note.trim() !== '';

        if (!isFormValid) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete Form',
                text2: 'Please fill all transaction fields',
            });
            return;
        }

        const docId = `txn_${params.id}`;
        const date = new Date().toISOString().split('T')[0];

        const transEntry = {
            trans_id: txnForm.trans_id || `txn_${Date.now()}`,
            date,
            amount: parseFloat(txnForm.amount),
            direction: txnForm.direction,
            note: txnForm.note,
        };

        try {
            const res = await db.getDoc(docId);

            let updatedDetails = [];

            if (res) {
                const existing = res.trans_detail || [];

                if (txnForm.trans_id) {
                    // Update existing entry by trans_id
                    updatedDetails = existing.map((txn: any) =>
                        txn.trans_id === txnForm.trans_id ? transEntry : txn
                    );
                } else {
                    // Append new entry
                    updatedDetails = [...existing, transEntry];
                }

                const updatedDoc = {
                    ...res,
                    trans_detail: updatedDetails,
                };

                await db.updateDoc(docId, updatedDoc);
            } else {
                // New document
                const newDoc = {
                    _id: docId,
                    type: 'transaction',
                    helper_id: params.id,
                    trans_detail: [transEntry],
                };

                await db.createDoc(newDoc);
            }

            setTxnModalVisible(false);
            setTxnForm({ trans_id: '', amount: '', direction: 'give', note: '' });

            Toast.show({
                type: 'success',
                text1: 'Transaction',
                text2: txnForm.trans_id ? 'Transaction updated!' : 'Transaction added!',
            });
        } catch (err) {
            console.error("❌ Error saving transaction:", err);
            alert("Failed to save transaction.");
        }
    };

    const updateHelper = async () => {
        try {
            const doc = await db.getDoc(params.id);

            const updatedSalaryEntry = {
                month: monthValue,
                salary: parseFloat(editedSalary),
                paid_leave: parseInt(editedPaidLeave, 10) || 0,
                updated_at: new Date().toISOString(),
            };

            // Clone and update monthly_salary array
            let updatedMonthlySalary = [...(doc.monthly_salary || [])];
            const existingIndex = updatedMonthlySalary.findIndex((item: any) => item.month === monthValue);

            if (existingIndex !== -1) {
                // Update the existing month entry
                updatedMonthlySalary[existingIndex] = updatedSalaryEntry;
            } else {
                // Add new entry if not found
                updatedMonthlySalary.push(updatedSalaryEntry);
            }

            const updatedDoc = {
                ...doc,
                name: editedName,
                role: editedRole,
                monthly_salary: updatedMonthlySalary,
            };

            await db.updateDoc(params.id, updatedDoc);

            // Local state updates
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
    };

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
                        <View style={{ flexDirection: 'row', display: 'flex', gap: 50 }}>
                            <View style={{ flexDirection: 'column', display: 'flex' }}>
                                <SkeletonBlock style={styles.header} />
                                <SkeletonBlock style={styles.header} />
                            </View>
                            <View style={{ flexDirection: 'column', display: 'flex' }}>
                                <SkeletonBlock style={styles.subHeader} />
                                <SkeletonBlock style={styles.subHeader} />
                            </View>
                        </View>
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
                                        <View key={txn.trans_id} style={[styles.detailRow, { justifyContent: 'space-between' }]}>
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
                                                        trans_id: txn.trans_id,
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
                paidLeave={paidLeave}
                setEditedSalary={setEditedSalary}
                setEditedPaidLeave={setEditedPaidLeave}
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
                setEditedPaidLeave={setEditedPaidLeave}
                editedPaidLeave={editedPaidLeave}
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
                handleTransDelete={handleTransDelete}
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
    header: {
        height: 20,
        width: Dimensions.get('screen').width * 0.4,
        marginVertical: 10,
        alignSelf: 'center'
    },
    subHeader: {
        height: 20,
        width: Dimensions.get('screen').width * 0.2,
        marginVertical: 10,
        alignSelf: 'center'
    },
    role: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
        marginBottom: 12,
    },
    container: {
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20
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