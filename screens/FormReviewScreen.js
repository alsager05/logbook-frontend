import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FormReviewScreen({ route, navigation }) {
  const { submission, resident } = route.params;
  const [feedback, setFeedback] = useState('');

  const handleApprove = () => {
    Alert.alert(
      "Approve Submission",
      "Are you sure you want to approve this submission?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: () => {
            // Add API call to approve submission
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please provide feedback before rejecting");
      return;
    }

    Alert.alert(
      "Reject Submission",
      "Are you sure you want to reject this submission?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject", 
          style: "destructive",
          onPress: () => {
            // Add API call to reject submission
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleRequestModification = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please provide feedback for modifications needed");
      return;
    }

    Alert.alert(
      "Request Modifications",
      "Send modification request to resident?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send", 
          onPress: () => {
            // Add notification for the resident
            const notification = {
              id: Date.now(),
              type: submission.type,
              residentId: resident.id,
              residentName: resident.name,
              submissionId: submission.id,
              status: 'needs_modification',
              feedback: feedback,
              date: new Date().toISOString().split('T')[0],
              details: `Modifications needed for ${submission.type} submission: ${submission.details}`
            };

            // Here you would typically send this to your backend
            console.log('Sending modification request:', notification);
            
            Alert.alert(
              "Success",
              "Modification request sent to resident",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.residentName}>{resident.name}</Text>
        <Text style={styles.submissionType}>{submission.type} Submission</Text>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Submission Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{submission.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{submission.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Details:</Text>
          <Text style={styles.value}>{submission.details}</Text>
        </View>
      </View>

      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Enter your feedback here..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.approveButton]}
          onPress={handleApprove}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.modifyButton]}
          onPress={handleRequestModification}
        >
          <Text style={[styles.buttonText, styles.modifyText]}>Request Modifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
        >
          <Text style={[styles.buttonText, styles.rejectText]}>Reject</Text>
        </TouchableOpacity>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  residentName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  submissionType: {
    fontSize: 16,
    color: '#666',
  },
  detailsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 16,
  },
  feedbackSection: {
    padding: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
  },
  rejectText: {
    color: '#FF3B30',
  },
  modifyButton: {
    backgroundColor: '#fff',
    borderColor: '#FF9500',
  },
  modifyText: {
    color: '#FF9500',
  },
}); 