import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formsService } from '../api/forms';
import { authService } from '../api/auth';
import { formSubmissionsService } from '../api/formSubmissions';

export default function FormScreen({ route, navigation }) {
  const queryClient = useQueryClient();
  const { formId, formName } = route.params || {};
  const [formData, setFormData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const userData = await authService.getUser();
        console.log('Raw user data:', userData);
        
        if (!userData) {
          Alert.alert(
            'Session Expired',
            'Please log in again',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
          return;
        }

        // Normalize the role data
        let normalizedRole = '';
        if (Array.isArray(userData.role)) {
          normalizedRole = userData.role[0]?.toString() || 'UNKNOWN';
        } else {
          normalizedRole = userData.role?.toString() || 'UNKNOWN';
        }

        const userWithRole = {
          ...userData,
          role: normalizedRole
        };
        
        console.log('Processed user data:', userWithRole);
        setUser(userWithRole);
      } catch (error) {
        console.error('Error getting user:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [navigation]);

  // Update the role check function
  const isResident = useCallback((userRole) => {
    if (!userRole) return false;
    const role = userRole.toString().toUpperCase();
    return role === 'RESIDENT';
  }, []);

  // Get tutors list
  const { data: tutors, isLoading: isLoadingTutors, error: tutorError } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      console.log('Fetching tutors for role:', user?.role);
      const response = await authService.getTutorList();
      console.log('Tutor query response:', response);
      return response;
    },
    enabled: !!user && isResident(user.role)
  });

  // Add this query for the form template
  const { data: template, isLoading: isLoadingTemplate, error: templateError } = useQuery({
    queryKey: ['formTemplate', formId],
    queryFn: async () => {
      console.log('Fetching template for id:', formId);
      const response = await formsService.getFormById(formId);
      console.log('Template response:', response);
      return response;
    },
    enabled: !!formId
  });

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (user?.role?.toUpperCase() === 'RESIDENT' && !selectedTutor) {
        Alert.alert('Error', 'Please select a tutor');
        return;
      }

      const submissionData = {
        formtemplate: formId,
        resident: user._id,
        tutor: selectedTutor,
        submissionDate: new Date().toISOString(),
        fieldRecords: Object.entries(formData).map(([fieldName, value]) => ({
          fieldName,
          value: value?.toString() || ''
        }))
      };

      await formSubmissionsService.submitForm(submissionData);
      
      Alert.alert(
        'Success',
        'Form submitted successfully to the selected tutor',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit form');
    }
  };

  // Render tutor selection for residents
  const renderTutorSelection = () => {
    if (user?.role !== 'RESIDENT') return null;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Select Tutor <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTutor}
            onValueChange={setSelectedTutor}
            style={styles.picker}
          >
            <Picker.Item label="Select a tutor..." value="" />
            {tutors?.map(tutor => (
              <Picker.Item
                key={tutor._id}
                label={tutor.username}
                value={tutor._id}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  // Add this console log to debug user role
  useEffect(() => {
    if (user) {
      console.log('Current user:', {
        role: user.role,
        id: user._id,
        roleUpperCase: user.role?.toUpperCase()
      });
    }
  }, [user]);

  // Add this function to render individual fields
  const handleInputChange = (fieldName, value) => {
    console.log('Handling input change:', { fieldName, value });
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Add this for date handling
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && dateField) {
      handleInputChange(dateField, selectedDate.toISOString().split('T')[0]);
    }
  };

  // Update the renderField function to use these handlers
  const renderField = (field) => {
    const isReadOnly = isResident(user?.role) && field.section === "2";
    console.log('Rendering field:', { name: field.name, section: field.section, isReadOnly });

    switch (field.type?.toLowerCase()) {
      case 'text':
        return (
          <TextInput
            style={[styles.input, isReadOnly && styles.inputDisabled]}
            value={formData[field.name] || ''}
            onChangeText={(value) => !isReadOnly && handleInputChange(field.name, value)}
            placeholder={`Enter ${field.name}`}
            editable={!isReadOnly}
          />
        );

      case 'textarea':
        return (
          <TextInput
            style={[styles.input, styles.textareaInput, isReadOnly && styles.inputDisabled]}
            value={formData[field.name] || ''}
            onChangeText={(value) => !isReadOnly && handleInputChange(field.name, value)}
            placeholder={`Enter ${field.name}`}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isReadOnly}
          />
        );

      case 'date':
        return (
          <View>
            <TouchableOpacity 
              style={[styles.dateButton, isReadOnly && styles.inputDisabled]}
              onPress={() => {
                if (!isReadOnly) {
                  setDateField(field.name);
                  setShowDatePicker(true);
                }
              }}
              disabled={isReadOnly}
            >
              <Text style={styles.dateButtonText}>
                {formData[field.name] || 'Select Date'}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#666" />
            </TouchableOpacity>
            {showDatePicker && dateField === field.name && (
              <DateTimePicker
                value={formData[field.name] ? new Date(formData[field.name]) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            {field.scaleOptions?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.scaleButton,
                  formData[field.name] === option && styles.scaleButtonSelected,
                  isReadOnly && styles.scaleButtonDisabled
                ]}
                onPress={() => !isReadOnly && handleInputChange(field.name, option)}
                disabled={isReadOnly}
              >
                <Text style={[
                  styles.scaleButtonText,
                  formData[field.name] === option && styles.scaleButtonTextSelected,
                  isReadOnly && styles.scaleButtonTextDisabled
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading || isLoadingTemplate || (user?.role?.toUpperCase() === 'RESIDENT' && isLoadingTutors)) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Please log in to continue</Text>
      </View>
    );
  }

  if (templateError || tutorError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {templateError?.message || tutorError?.message}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            if (templateError) {
              queryClient.invalidateQueries(['formTemplate', formId]);
            }
            if (tutorError && user?.role?.toUpperCase() === 'RESIDENT') {
              queryClient.invalidateQueries(['tutors']);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {template && (
        <>
          <Text style={styles.title}>{template.name}</Text>
          
          {isResident(user?.role) && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Select Tutor <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTutor}
                  onValueChange={(value) => setSelectedTutor(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a tutor..." value="" />
                  {tutors?.map((tutor) => (
                    <Picker.Item
                      key={tutor._id}
                      label={tutor.username}
                      value={tutor._id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {template.scaleDescription && (
            <View style={styles.scaleDescriptionContainer}>
              <Text style={styles.scaleDescriptionTitle}>Evaluation Scale Guide</Text>
              <ScrollView 
                style={styles.scaleDescriptionScroll}
                nestedScrollEnabled={true}
              >
                <Text style={styles.scaleDescription}>{template.scaleDescription}</Text>
              </ScrollView>
            </View>
          )}

          {template.fieldTemplates?.map((field, index) => (
            <View key={index} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {field.name}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              {field.details && (
                <Text style={styles.details}>{field.details}</Text>
              )}
              {renderField(field)}
            </View>
          ))}

          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!selectedTutor && isResident(user?.role)) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedTutor && isResident(user?.role)}
          >
            <Text style={styles.submitButtonText}>Submit Form</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  scaleDescriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    maxHeight: 200,
  },
  scaleDescriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  scaleDescriptionScroll: {
    padding: 12,
    maxHeight: 150,
  },
  scaleDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  tutorContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerPlaceholder: {
    color: '#999',
  },
  pickerOption: {
    color: '#000',
  },
  formFieldsContainer: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textareaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    gap: 10,
  },
  scaleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#fff',
    minWidth: 40,
    alignItems: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: '#000',
  },
  scaleButtonText: {
    color: '#000',
  },
  scaleButtonTextSelected: {
    color: '#fff',
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#000',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scaleButtonDisabled: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    minWidth: 40,
    alignItems: 'center',
  },
  scaleButtonTextDisabled: {
    color: '#666',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff0000',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
    opacity: 0.7,
  },
  scaleButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    opacity: 0.7,
  },
  scaleButtonTextDisabled: {
    color: '#999',
  },
});