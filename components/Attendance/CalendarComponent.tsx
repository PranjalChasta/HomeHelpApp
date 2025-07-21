import { StyleSheet, useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CustomCalendar({
    setSelectedDate,
    markedDates,
    selectedDate
}: any) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const backgroundColor = isDark ? '#111827' : '#fff';
    const dayTextColor = isDark ? '#f9fafb' : '#1f2937';
    const todayColor = '#00adf5';
    const selectedBgColor = '#00adf5';
    const textSecondary = isDark ? '#9ca3af' : '#6b7280';

    return (
        <View style={[styles.calendarCard, { backgroundColor }]}>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                        ...(markedDates[selectedDate] || {}),
                        selected: true,
                        selectedColor: selectedBgColor,
                    }
                }}
                style={[styles.calendar, { backgroundColor }]}
                theme={{
                    backgroundColor,
                    calendarBackground: backgroundColor,
                    todayTextColor: todayColor,
                    selectedDayBackgroundColor: selectedBgColor,
                    arrowColor: todayColor,
                    textDayFontWeight: '500',
                    textSectionTitleColor: textSecondary,
                    dayTextColor,
                    monthTextColor: dayTextColor,
                    textDisabledColor: isDark ? '#4b5563' : '#d1d5db',
                    textDayHeaderFontWeight: '600',
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    calendarCard: {
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
