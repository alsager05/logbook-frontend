import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentDetailsScreen({ route }) {
  const { resident } = route.params;

  // Example expanded resident data - replace with your actual data structure
  const residentDetails = {
    ...resident,
    id: "R-2024-001",
    level: "R3",
    email: "john.smith@hospital.com",
    phone: "+1 (555) 123-4567",
    startDate: "July 1, 2021",
    expectedCompletion: "June 30, 2024",
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color="#666" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color="#666" />
        </View>
        <Text style={styles.name}>{residentDetails.name}</Text>
        <Text style={styles.id}>{residentDetails.id}</Text>
      </View>

      <View style={styles.infoSection}>
        <InfoRow icon="school" label="Level" value={residentDetails.level} />
        <InfoRow icon="mail" label="Email" value={residentDetails.email} />
        <InfoRow icon="call" label="Phone" value={residentDetails.phone} />
        <InfoRow icon="calendar" label="Start Date" value={residentDetails.startDate} />
        <InfoRow icon="flag" label="Expected Completion" value={residentDetails.expectedCompletion} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  id: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 