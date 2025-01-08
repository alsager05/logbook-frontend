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

export default function TutorHomeScreen() {
  // Example notifications data - replace with your actual data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      residentName: 'Dr. John Smith',
      type: 'EPA',
      date: '2024-03-20',
      status: 'pending',
      details: 'Requesting approval for EPA assessment completion'
    },
    {
      id: 2,
      residentName: 'Dr. Sarah Johnson',
      type: 'OBS',
      date: '2024-03-19',
      status: 'pending',
      details: 'New OBS case requires review'
    },
    {
      id: 3,
      residentName: 'Dr. Michael Brown',
      type: 'GYN',
      date: '2024-03-18',
      status: 'pending',
      details: 'GYN procedure approval needed'
    },
  ]);

  const handleApprove = (notificationId) => {
    Alert.alert(
      "Approve Request",
      "Are you sure you want to approve this request?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Approve",
          onPress: () => {
            setNotifications(notifications.filter(n => n.id !== notificationId));
            // Add your API call here to update the approval status
          }
        }
      ]
    );
  };

  const handleReject = (notificationId) => {
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this request?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reject",
          onPress: () => {
            setNotifications(notifications.filter(n => n.id !== notificationId));
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
          <Text style={styles.countText}>{notifications.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pending Approvals</Text>

      <ScrollView style={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Text style={styles.residentName}>{notification.residentName}</Text>
                <Text style={styles.dateText}>{notification.date}</Text>
              </View>
              
              <View style={styles.typeContainer}>
                <Ionicons 
                  name={
                    notification.type === 'EPA' ? 'document-text' :
                    notification.type === 'OBS' ? 'medical' : 'woman'
                  } 
                  size={20} 
                  color="#666" 
                />
                <Text style={styles.typeText}>{notification.type}</Text>
              </View>
              
              <Text style={styles.detailsText}>{notification.details}</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(notification.id)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(notification.id)}
                >
                  <Text style={[styles.buttonText, styles.rejectText]}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noNotifications}>No pending approvals</Text>
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
  notificationList: {
    flex: 1,
  },
  notificationCard: {
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
  notificationHeader: {
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
  noNotifications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 