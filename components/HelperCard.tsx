import { Button, StyleSheet, Text, View } from 'react-native';

export default function HelperCard({ helper, onAttendance, onSalary }: any) {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>{helper.name}</Text>
            <Text>{helper.role}</Text>
            <Text>Salary: ₹{helper.monthly_salary}</Text>
            <View style={styles.actions}>
                <Button title="Attendance" onPress={onAttendance} />
                <Button title="Salary" onPress={onSalary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: 12, marginVertical: 8, backgroundColor: '#e1f5fe', borderRadius: 8 },
    name: { fontSize: 18, fontWeight: 'bold' },
    actions: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
});
