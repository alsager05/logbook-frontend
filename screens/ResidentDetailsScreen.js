import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentDetailsScreen({ route, navigation }) {
  const { resident } = route.params;

  // Example form submissions data
  const formSubmissions = [
    {
      id: 1,
      type: 'OBS',
      date: '2024-03-20',
      status: 'pending',
      details: 'Case: Normal Delivery',
    },
    {
      id: 2,
      type: 'GYN',
      date: '2024-03-18',
      status: 'pending',
      details: 'Procedure: Laparoscopy',
    },
    {
      id: 3,
      type: 'EPA',
      date: '2024-03-15',
      status: 'pending',
      details: 'Assessment: Patient Care',
    },
  ];

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
        <Text style={styles.name}>{resident.name}</Text>
        <Text style={styles.id}>{resident.id}</Text>
      </View>

      <View style={styles.infoSection}>
        <InfoRow icon="school" label="Level" value={resident.level} />
        <InfoRow icon="mail" label="Email" value={resident.email} />
        <InfoRow icon="call" label="Phone" value={resident.phone} />
        <InfoRow icon="calendar" label="Start Date" value={resident.startDate} />
        <InfoRow icon="flag" label="Expected Completion" value={resident.expectedCompletion} />
      </View>

      <View style={styles.submissionsSection}>
        <Text style={styles.sectionTitle}>Form Submissions</Text>
        {formSubmissions.map((submission) => (
          <TouchableOpacity
            key={submission.id}
            style={styles.submissionCard}
            onPress={() => navigation.navigate('FormReview', { submission, resident })}
          >
            <View style={styles.submissionHeader}>
              <View style={styles.typeContainer}>
                <Ionicons 
                  name={
                    submission.type === 'EPA' ? 'document-text' :
                    submission.type === 'OBS' ? 'medical' : 'woman'
                  } 
                  size={20} 
                  color="#666" 
                />
                <Text style={styles.submissionType}>{submission.type}</Text>
              </View>
              <Text style={styles.submissionDate}>{submission.date}</Text>
            </View>
            <Text style={styles.submissionDetails}>{submission.details}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Status: </Text>
              <Text style={[
                styles.statusValue,
                { color: submission.status === 'pending' ? '#FFA500' : '#4CAF50' }
              ]}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  submissionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  submissionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submissionType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submissionDate: {
    color: '#666',
    fontSize: 14,
  },
  submissionDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 