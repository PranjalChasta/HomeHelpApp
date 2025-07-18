import { default as couchdb } from '@/services/couchdb';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Helper = {
  _id: string;
  [key: string]: any;
};

export default function HomeScreen() {
  const [helpers, setHelpers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    const result = await couchdb.getAllDocs();
    setHelpers(result);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginVertical: 30 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Home Help List</Text>

        {helpers.filter((item) => item.role).map((helper) => (
          <View key={helper._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{helper.name} <Text style={styles.role}>({helper.role})</Text></Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push({ pathname: `/attendance`, params: { id: helper._id, name: helper.name, role: helper.role } })}
              >
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push({ pathname: `/salary`, params: { id: helper._id, name: helper.name } })}
              >
                <Ionicons name="cash-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Salary</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push({ pathname: `/add-helper` })}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Helper</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  role: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

