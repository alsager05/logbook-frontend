import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { formsService } from '../api/forms';

export default function TutorHomeScreen({ navigation }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pendingForms'],
    queryFn: formsService.getPendingForms,
    onSuccess: (data) => {
      console.log('Pending forms:', data);
    },
    onError: (error) => {
      console.error('Pending forms error:', error);
    }
  });

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
    <ScrollView style={styles.container}>
      <View style={styles.iconsContainer}>
        {pendingForms.length === 0 ? (
          <Text style={styles.messageText}>No pending forms</Text>
        ) : (
          pendingForms.map((form) => (
            <TouchableOpacity 
              key={form._id}
              style={styles.iconButton}
              onPress={() => navigation.navigate('Form', {
                formName: form.name,
                formId: form._id
              })}
            >
              <Text style={styles.iconText}>{form.name}</Text>
              <Text style={styles.submittedBy}>
                Submitted by: {form.residentName || 'Unknown'}
              </Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noForms: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  formsContainer: {
    gap: 15,
  },
  formCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  }
}); 