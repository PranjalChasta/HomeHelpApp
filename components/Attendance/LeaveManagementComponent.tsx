import db from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import CustomCalendar from './CalendarComponent';

export default function LeaveManagement() {
    const { id, name, role } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceDoc, setAttendanceDoc] = useState<any>();
    const [selectedText, setSelectedText] = useState('MARK LEAVE');
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

    useEffect(() => {
        const getDocument = async () => {
            if (selectedDate && id) {
                const docId = `attend_${selectedDate}_${id}`;
                const existing = await db.getDoc(docId);
                if (existing?._id) {
                    setSelectedText('Remove Leave');
                    setAttendanceDoc(existing);
                } else {
                    setSelectedText('Mark Leave');
                    setAttendanceDoc(null);
                }
            }
        }
        getDocument();
    }, [selectedDate]);

    useEffect(() => {
        if (id) {
            loadLeaves();
        }
    }, [id]);

    const loadLeaves = async () => {
        try {
            const result = await db.find({
                selector: {
                    type: 'attendance',
                    helper_id: id,
                    status: 'leave'
                }
            });

            const marks: Record<string, any> = {};
            result.docs.forEach((doc: any) => {
                marks[doc.date] = {
                    marked: true,
                    dotColor: 'red',
                    selectedColor: '#fdecea',
                    dayTextColor: 'red',
                    selected: true,
                };
            });
            setSelectedDate(new Date().toISOString());
            setMarkedDates(marks);
        } catch (err) {
            console.error("Failed to load leaves", err);
        }
    };

    const removeLeave = async () => {
        if (attendanceDoc?._id) {
            Alert.alert(
                "Leave already marked",
                "Do you want to remove it?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                await db.deleteDoc(attendanceDoc._id, attendanceDoc._rev);
                                loadLeaves();
                            } catch (deleteErr) {
                                console.error("Error deleting leave:", deleteErr);
                                alert("Failed to delete leave.");
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        }
    }

    const markLeave = async () => {
        if (!selectedDate) {
            alert("Please select a date first.");
            return;
        }

        const docId = `attend_${selectedDate}_${id}`;

        try {
            const doc = {
                _id: docId,
                type: 'attendance',
                helper_id: id,
                date: selectedDate,
                status: 'leave',
            };
            await db.createDoc(doc);
            alert("Leave marked!");
            loadLeaves();
        } catch (err: any) {
            console.error("Error checking existing leave:", err);
            alert("Something went wrong.");
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#111827' : '#ffffff' }]}>
            <View style={styles.container}>
                <View style={{ position: 'relative', marginBottom: 20, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', left: 0, top: 5 }}
                    >
                        <Ionicons name="arrow-back" size={28} color={isDark ? '#9ca3af' : '#4b5563'} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', color: isDark ? '#fff' : '#4b5563' }}>
                        Leave Calendar
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#111827' }]}>{name} <Text style={[styles.role, { color: isDark ? '#9ca3af' : '#4b5563' }]}>({role})</Text></Text>
                </View>

                <CustomCalendar
                    setSelectedDate={setSelectedDate}
                    markedDates={markedDates}
                    selectedDate={selectedDate}
                />

                <Button title={selectedText} onPress={attendanceDoc?._id ? removeLeave : markLeave} color="#007AFF" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        marginVertical: 30
    },
    container: {
        padding: 16,
    },
    calendar: {
        borderRadius: 10,
    },
    cardHeader: {
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 2
    },
    role: {
        fontSize: 14,
        paddingLeft: 10,
        letterSpacing: 0
    },
});

