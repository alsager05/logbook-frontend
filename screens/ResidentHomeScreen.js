import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentHomeScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'OBS',
      status: 'needs_modification',
      feedback: 'Please add more details about the procedure',
      date: '2024-03-20',
      details: 'Modifications needed for OBS submission: Case: Normal Delivery'
    },
    // Add more example notifications as needed
  ]);

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.map(notification => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <View style={styles.typeContainer}>
                  <Ionicons 
                    name={
                      notification.type === 'EPA' ? 'document-text' :
                      notification.type === 'OBS' ? 'medical' : 'woman'
                    } 
                    size={20} 
                    color="#FF9500" 
                  />
                  <Text style={styles.notificationType}>{notification.type}</Text>
                </View>
                <Text style={styles.notificationDate}>{notification.date}</Text>
              </View>
              <Text style={styles.notificationDetails}>{notification.details}</Text>
              <Text style={styles.feedbackText}>Feedback: {notification.feedback}</Text>
              <TouchableOpacity 
                style={styles.modifyButton}
                onPress={() => navigation.navigate(notification.type)}
              >
                <Text style={styles.modifyButtonText}>Modify Submission</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('OBS')}
        >
          <Text style={styles.iconText}>OBS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('GYN')}
        >
          <Text style={styles.iconText}>GYN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('EPA')}
        >
          <Text style={styles.iconText}>EPA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  iconsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    gap: 30,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '80%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  notificationCard: {
    backgroundColor: '#fff8f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
    marginLeft: 8,
  },
  notificationDate: {
    color: '#666',
    fontSize: 14,
  },
  notificationDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  modifyButton: {
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 