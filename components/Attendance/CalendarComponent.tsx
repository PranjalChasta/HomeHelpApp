import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CustomCalendar({
    setSelectedDate,
    markedDates,
    selectedDate
}: any) {
    // const { id, name, role } = useLocalSearchParams();
    // const router = useRouter();
    // const [selectedDate, setSelectedDate] = useState('');
    // const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

    // useEffect(() => {
    //     if (id) {
    //         loadLeaves();
    //     }
    // }, [id]);

    // const loadLeaves = async () => {
    //     try {
    //         const result = await db.find({
    //             selector: {
    //                 type: 'attendance',
    //                 helper_id: id,
    //                 status: 'leave'
    //             }
    //         });

    //         const marks: Record<string, any> = {};
    //         result.docs.forEach((doc: any) => {
    //             marks[doc.date] = {
    //                 marked: true,
    //                 dotColor: 'red',
    //                 selectedColor: '#fdecea',
    //                 dayTextColor: 'red',
    //                 selected: true,
    //             };
    //         });
    //         setSelectedDate(new Date().toISOString());
    //         setMarkedDates(marks);
    //     } catch (err) {
    //         console.error("Failed to load leaves", err);
    //     }
    // };

    // const markLeave = async () => {
    //     if (!selectedDate) {
    //         alert("Please select a date first.");
    //         return;
    //     }

    //     const docId = `attend_${selectedDate}_${id}`;

    //     try {
    //         const existing = await db.getDoc(docId);
    //         if (existing?._id) {
    //             Alert.alert(
    //                 "Leave already marked",
    //                 "Do you want to remove it?",
    //                 [
    //                     { text: "Cancel", style: "cancel" },
    //                     {
    //                         text: "Delete",
    //                         style: "destructive",
    //                         onPress: async () => {
    //                             try {
    //                                 await db.deleteDoc(existing._id, existing._rev);
    //                                 alert("Leave removed!");
    //                                 loadLeaves();
    //                             } catch (deleteErr) {
    //                                 console.error("Error deleting leave:", deleteErr);
    //                                 alert("Failed to delete leave.");
    //                             }
    //                         },
    //                     },
    //                 ],
    //                 { cancelable: true }
    //             );
    //         }
    //     } catch (err: any) {
    //         if (err.response?.status === 404) {
    //             // No leave exists, create one
    //             const doc = {
    //                 _id: docId,
    //                 type: 'attendance',
    //                 helper_id: id,
    //                 date: selectedDate,
    //                 status: 'leave',
    //             };
    //             await db.createDoc(doc);
    //             alert("Leave marked!");
    //             loadLeaves();
    //         } else {
    //             console.error("Error checking existing leave:", err);
    //             alert("Something went wrong.");
    //         }
    //     }
    // };

    return (
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
    );
}

const styles = StyleSheet.create({
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
});
