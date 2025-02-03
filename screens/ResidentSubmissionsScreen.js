import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { formSubmissionsService } from '../api/formSubmissions';

export default function ResidentSubmissionsScreen({ navigation }) {
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['residentSubmissions'],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading submissions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Error loading submissions: {error.message}</Text>
      </View>
    );
  }

  const submissions = Array.isArray(data) ? data : [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'approved':
        return '#4CAF50'; // Green
      case 'rejected':
        return '#FF0000'; // Red
      default:
        return '#808080'; // Gray
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4F46E5']}
          tintColor="#4F46E5"
        />
      }
    >
      <View style={styles.submissionsContainer}>
        {submissions.length === 0 ? (
          <Text style={styles.messageText}>No submissions found</Text>
        ) : (
          submissions.map((submission) => (
            <TouchableOpacity 
              key={submission._id}
              style={styles.submissionCard}
              onPress={() => navigation.navigate('FormReview', {
                formName: submission.formTemplate?.formName || 'Form',
                formId: submission.formTemplate?._id,
                submissionId: submission._id,
                readOnly: true
              })}
            >
              <Text style={styles.formName}>
                {submission.formTemplate?.formName || 'Unnamed Form'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.submissionDetails}>
                  Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                </Text>
                <Text style={styles.submissionDetails}>
                  Tutor: {submission.tutor?.username || 'Not assigned'}
                </Text>
                <View style={styles.statusContainer}>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(submission.status) }
                    ]} 
                  />
                  <Text style={styles.statusText}>
                    {submission.status || 'Pending'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  submissionsContainer: {
    padding: 16,
    gap: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  submissionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 4,
  },
  submissionDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  }
}); 