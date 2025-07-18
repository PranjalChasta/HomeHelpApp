import db from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
const { width } = Dimensions.get('window');

export default function Attendance() {
    const { id, name, role } = useLocalSearchParams();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

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

    const markLeave = async () => {
        if (!selectedDate) {
            alert("Please select a date first.");
            return;
        }

        const docId = `attend_${selectedDate}_${id}`;

        try {
            const existing = await db.getDoc(docId);
            if (existing?._id) {
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
                                    await db.deleteDoc(existing._id, existing._rev);
                                    alert("Leave removed!");
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
        } catch (err: any) {
            if (err.response?.status === 404) {
                // No leave exists, create one
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
            } else {
                console.error("Error checking existing leave:", err);
                alert("Something went wrong.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={{ position: 'relative', marginBottom: 20, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', left: 0, top: 5 }}
                    >
                        <Ionicons name="arrow-back" size={28} color="#333" />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>
                        Leave Calendar
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <Text style={styles.name}>{name} <Text style={styles.role}>({role})</Text></Text>
                </View>

                <View style={styles.calendarCard}>
                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            ...markedDates,
                            [selectedDate]: {
                                ...(markedDates[selectedDate] || {}),
                                selected: true,
                                selectedColor: '#00adf5',
                            }
                        }}
                        style={styles.calendar}
                        theme={{
                            todayTextColor: '#00adf5',
                            selectedDayBackgroundColor: '#00adf5',
                            arrowColor: '#00adf5',
                            textSectionTitleColor: '#333333',
                            dayTextColor: '#444444',
                        }}
                    />
                </View>

                <Button title="Mark Leave" onPress={markLeave} color="#007AFF" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
        marginVertical: 30
    },
    container: {
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 6,
        color: '#222',
    },
    subHeader: {
        fontSize: 20,
        marginBottom: 10,
        color: '#000',
        textAlign: 'center'
    },
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20,
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
});
