import db from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { CalendarSkeleton } from '../common/CustomAnimated';
import CustomCalendar from './CalendarComponent';

export default function LeaveManagement() {
    const { id, name, role } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [leaveMarkedDates, setLeaveMarkedDates] = useState<string[]>([]);
    const [extraWorkDates, setExtraWorkDates] = useState<string[]>([]);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const [markedExtraDates, setMarkedExtraDates] = useState<Record<string, any>>({});

    const toggleDateSelection = (date: string) => {
        setSelectedDates((prev) =>
            prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
        );
    };
    const getLeaves = async () => {
        if (id) {
            setCalendarLoading(true);
            await loadLeaves();
        }
    };

    useEffect(() => {
        getLeaves();
    }, [id]);

    const loadLeaves = async () => {
        try {
            const docId = `attend_${id}`;
            const result = await db.find({
                selector: {
                    type: 'attendance',
                    helper_id: id,
                    status: 'leave'
                },
            });
            const attdDoc = result?.docs?.find((item: any) => item._id === docId);
            const marks: Record<string, any> = {};
            if (attdDoc?.dates?.length) {
                setLeaveMarkedDates(attdDoc.dates);
                attdDoc?.dates.forEach((date: string) => {
                    marks[date] = {
                        marked: true,
                        dotColor: 'red',
                        selectedColor: '#f5a6a6ff',
                        dayTextColor: 'red',
                        selected: true,
                    };
                });
            }
            setMarkedDates(marks);

            const extraDocId = `attend_extra_${id}`;
            const res = await db.find({
                selector: {
                    type: 'attendance',
                    helper_id: id,
                    status: 'extra-work'
                },
            });
            const attdExtraWorkDoc = res?.docs?.find((item: any) => item._id === extraDocId);
            const extraWorkMarks: Record<string, any> = {};
            if (attdExtraWorkDoc?.dates?.length) {
                setExtraWorkDates(attdExtraWorkDoc.dates);
                attdExtraWorkDoc?.dates.forEach((date: string) => {
                    extraWorkMarks[date] = {
                        marked: true,
                        dotColor: '#02803bff',
                        selectedColor: '#3dda84ff',
                        dayTextColor: '#01c057ff',
                        selected: true,
                    };
                });
            }
            setMarkedExtraDates(extraWorkMarks);

            setSelectedDates([]);
            setCalendarLoading(false);
        } catch (err) {
            console.error("Failed to load leaves", err);
            setCalendarLoading(false);
        }
    };

    const updateLeave = async () => {
        const conflictDates = selectedDates?.filter(date => extraWorkDates.includes(date));
        if (conflictDates.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Conflict Detected',
                text2: 'Please remove Extra-work before marking Leave.',
            });
            return;
        }

        try {
            setIsLoading(true);
            setCalendarLoading(true);
            const docId = `attend_${id}`;
            const attRes = await db.getAllDocs() as any[];
            const attdDoc = attRes?.find(
                (doc) => doc.helper_id === id && doc.type === 'attendance' && doc.status === 'leave'
            );

            if (!attdDoc) {
                setIsLoading(false);
                const newDoc = {
                    _id: docId,
                    type: 'attendance',
                    helper_id: id,
                    status: 'leave',
                    dates: selectedDates,
                };
                await db.createDoc(newDoc);
                setSelectedDates([]);
                await loadLeaves();
                setCalendarLoading(false);
                Toast.show({
                    type: 'success',
                    text1: 'Leave added successfully!'
                });
                return;
            }
            const existingDates = attdDoc.dates || [];
            const dateSet = new Set(existingDates);
            selectedDates.forEach((date) => {
                if (dateSet.has(date)) {
                    dateSet.delete(date); // remove
                } else {
                    dateSet.add(date); // add
                }
            });

            const updatedDates = Array.from(dateSet);

            // Save updated document or delete if empty
            if (updatedDates.length === 0) {
                await db.deleteDoc(attdDoc._id, attdDoc._rev);
                setSelectedDates([]);
                await loadLeaves();

            } else {
                await db.updateDoc(docId, {
                    ...attdDoc,
                    dates: updatedDates,
                });
                setSelectedDates([]);
                await loadLeaves();
            }
            setCalendarLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Leave updated successfully!'
            });
        } catch (err) {
            setCalendarLoading(false);
            setIsLoading(false);
            console.error("Error removing leave:", err);
            alert("Something went wrong.");
        } finally {
            setCalendarLoading(false);
            setIsLoading(false);
        }
    };

    const updateExtraWork = async () => {
        const conflictDates = selectedDates?.filter(date => leaveMarkedDates.includes(date));
        if (conflictDates.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Conflict Detected',
                text2: 'Please remove Leave before marking Extra-work.',
            });
            return;
        }

        try {
            setIsLoading(true);
            setCalendarLoading(true);
            const docId = `attend_extra_${id}`;
            const attRes = await db.getAllDocs() as any[];
            const attdDoc = attRes?.find(
                (doc) => doc.helper_id === id && doc.type === 'attendance' && doc.status === 'extra-work'
            );

            if (!attdDoc) {
                setIsLoading(false);
                const newDoc = {
                    _id: docId,
                    type: 'attendance',
                    helper_id: id,
                    status: 'extra-work',
                    dates: selectedDates,
                };
                await db.createDoc(newDoc);
                setSelectedDates([]);
                await loadLeaves();
                setCalendarLoading(false);
                Toast.show({
                    type: 'success',
                    text1: 'Extra-work added successfully!'
                });
                return;
            }
            const existingDates = attdDoc.dates || [];
            const dateSet = new Set(existingDates);
            selectedDates.forEach((date) => {
                if (dateSet.has(date)) {
                    dateSet.delete(date); // remove
                } else {
                    dateSet.add(date); // add
                }
            });

            const updatedDates = Array.from(dateSet);

            // Save updated document or delete if empty
            if (updatedDates.length === 0) {
                await db.deleteDoc(attdDoc._id, attdDoc._rev);
                setSelectedDates([]);
                await loadLeaves();

            } else {
                await db.updateDoc(docId, {
                    ...attdDoc,
                    dates: updatedDates,
                });
                setSelectedDates([]);
                await loadLeaves();
            }
            setCalendarLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Extra-work updated successfully!'
            });
        } catch (err) {
            setCalendarLoading(false);
            setIsLoading(false);
            console.error("Error removing extra-work:", err);
            alert("Something went wrong.");
        } finally {
            setCalendarLoading(false);
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1f2a42ff' : '#ffffff' }]}>
            <View style={{ flex: 1, position: 'relative' }}>
                <View style={styles.container}>
                    <View style={{ position: 'relative', marginBottom: 20, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ position: 'absolute', left: 0, top: 5 }}
                        >
                            <Ionicons name="arrow-back" size={28} color={isDark ? '#9ca3af' : '#4b5563'} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', color: isDark ? '#fff' : '#4b5563' }}>
                            Calendar
                        </Text>
                    </View>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.name, { color: isDark ? '#f9fafb' : '#111827' }]}>{name} <Text style={[styles.role, { color: isDark ? '#9ca3af' : '#4b5563' }]}>({role})</Text></Text>
                    </View>

                    {calendarLoading ? (
                        <CalendarSkeleton isDark={isDark} />
                    ) : (
                        <CustomCalendar
                            setSelectedDate={toggleDateSelection}
                            markedDates={{
                                ...markedDates,
                                ...markedExtraDates,
                                ...Object.fromEntries(
                                    selectedDates.map((date) => {
                                        const leaveDate = leaveMarkedDates.includes(date);
                                        const extraWorkDate = extraWorkDates.includes(date);
                                        return [
                                            date,
                                            {
                                                selected: true,
                                                selectedColor: leaveDate ? '#f8d6d6ff' : extraWorkDate ? '#b1f5cfff' : '#70bbf8ff',
                                                marked: true,
                                                dotColor: leaveDate ? 'red' : extraWorkDate ? '#02803bff' : '#058cfaff',
                                            },
                                        ];
                                    })
                                ),
                            }}
                            selectedDates={selectedDates}
                        />
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={updateLeave}
                            disabled={isLoading || selectedDates.length === 0}
                            style={[styles.button, { opacity: isLoading || selectedDates.length === 0 ? 0.5 : 1, }]}>
                            <Text style={styles.buttonText}>Mark/Remove Leave(s)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={updateExtraWork}
                            disabled={isLoading || selectedDates.length === 0}
                            style={[styles.button, { backgroundColor: '#34C759', opacity: isLoading || selectedDates.length === 0 ? 0.5 : 1, }]}>
                            <Text style={styles.buttonText}>Mark/Remove Extra Work(s)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast />
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
    button: {
        backgroundColor: '#f56e6eff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,

    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },

});

