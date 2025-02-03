import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { formSubmissionsService } from '../api/formSubmissions';
import { authService } from '../api/auth';

export default function TutorHomeScreen({ navigation }) {
  // Get tutor's pending forms
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tutorPendingForms'],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading forms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Error loading forms: {error.message}</Text>
      </View>
    );
  }
  // Ensure data is an array
  const pendingForms = Array.isArray(data) ? data : [];

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
      <View style={styles.iconsContainer}>
        {pendingForms.length === 0 ? (
          <Text style={styles.messageText}>No pending forms</Text>
        ) : (
          pendingForms.map((form) => {
            const dateField = form.fieldRecord.find(field => field.fieldName === 'Date');
            const formattedDate = dateField?.value 
              ? new Date(dateField.value).toLocaleDateString() 
              : 'No date available';

            return (
              <TouchableOpacity 
                key={form._id}
                style={styles.formCard}
                onPress={() => navigation.navigate('FormReview', {
                  formName: form.formTemplate?.formName || 'Form',
                  formId: form.formTemplate?._id,
                  submissionId: form._id
                })}
              >
                <Text style={styles.formName}>{form.formTemplate?.formName || 'Unnamed Form'}</Text>
                <Text style={styles.formDetails}>
                  Submitted by: {form.resident?.username || 'Unknown Resident'}
                </Text>
                <Text style={styles.formDetails}>
                  Date: {formattedDate}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  iconsContainer: {
    gap: 15,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  formDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  }
});