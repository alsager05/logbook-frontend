import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TutorHomeScreen({ navigation }) {
  // Example notifications data - replace with your actual data
  const [pendingForms, setPendingForms] = useState([
    {
      id: 1,
      residentName: 'Dr. John Smith',
      type: 'OBS',
      date: '2024-03-20',
      status: 'pending',
      details: 'Requesting evaluation for Normal Vaginal Delivery'
    },
    {
      id: 2,
      residentName: 'Dr. Sarah Johnson',
      type: 'OBS',
      date: '2024-03-19',
      status: 'pending',
      details: 'Requesting evaluation for Cesarean Section'
    },
    {
      id: 3,
      residentName: 'Dr. Michael Brown',
      type: 'OBS',
      date: '2024-03-18',
      status: 'pending',
      details: 'Requesting evaluation for Forceps Delivery'
    },
  ]);

  const handleAccept = (formId) => {
    Alert.alert(
      "Accept Request",
      "Are you sure you want to evaluate this procedure?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Accept",
          onPress: () => {
            // Remove from pending list
            setPendingForms(forms => forms.filter(f => f.id !== formId));
            // Navigate to form screen
            navigation.navigate('FormScreen', { 
              name: 'SCORE',
              formId: formId
            });
          }
        }
      ]
    );
  };

  const handleReject = (formId) => {
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this evaluation request?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reject",
          onPress: () => {
            setPendingForms(forms => forms.filter(f => f.id !== formId));
            // Add your API call here to update the rejection status
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Tutor!</Text>
        <View style={styles.notificationCount}>
          <Text style={styles.countText}>{pendingForms.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pending Evaluations</Text>

      <ScrollView style={styles.formList}>
        {pendingForms.length > 0 ? (
          pendingForms.map((form) => (
            <View key={form.id} style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.residentName}>{form.residentName}</Text>
                <Text style={styles.dateText}>{form.date}</Text>
              </View>
              
              <View style={styles.typeContainer}>
                <Ionicons name="medical" size={20} color="#666" />
                <Text style={styles.typeText}>{form.type}</Text>
              </View>
              
              <Text style={styles.detailsText}>{form.details}</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(form.id)}
                >
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleAccept(form.id)}
                >
                  <Text style={styles.buttonText}>Evaluate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noForms}>No pending evaluations</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationCount: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  formList: {
    flex: 1,
  },
  formCard: {
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
  approveButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectText: {
    color: '#FF3B30',
  },
  noForms: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 