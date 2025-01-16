import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { formsService } from '../api/forms';

// Helper function to check numeric fields
const isNumericField = (fieldName) => {
  if (!fieldName || typeof fieldName !== 'string') return false;
  return /^\d+\./.test(fieldName);
};


export default function FormScreen({ route, navigation, role }) {
  const { formId, formName } = route.params || {};
  const [formData, setFormData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const currentRole = role?.toUpperCase();

  // Fetch form template using useQuery
  const { 
    data: template, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['formTemplate', formId],
    queryFn: () => formsService.getFormById(formId),
    enabled: !!formId,
    onSuccess: (data) => {
      console.log('Form template fetched:', data);
    },
    onError: (error) => {
      console.error('Error fetching form template:', error);
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading form...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading form: {error.message}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && dateField) {
      handleInputChange(dateField, selectedDate.toISOString().split('T')[0]);
    }
  };

  const renderField = (field) => {
    const isReadOnly = currentRole === 'RESIDENT' && field.section === "2";

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
              <View style={styles.dateButtonContent}>
                <Ionicons name="calendar-outline" size={24} color="#666" />
                <Text style={styles.dateButtonText}>
                  {formData[field.name] || 'Select Date'}
                </Text>
              </View>
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

      case 'select':
        if (field.name.includes('safely perform')) {
          return (
            <View style={styles.yesNoContainer}>
              {['Yes', 'No'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.yesNoButton,
                    formData[field.name] === option && styles.yesNoButtonSelected,
                    isReadOnly && styles.yesNoButtonDisabled
                  ]}
                  onPress={() => !isReadOnly && handleInputChange(field.name, option)}
                  disabled={isReadOnly}
                >
                  <Text style={[
                    styles.yesNoButtonText,
                    formData[field.name] === option && styles.yesNoButtonTextSelected,
                    isReadOnly && styles.yesNoButtonTextDisabled
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }
        return (
          <View style={[styles.pickerContainer, isReadOnly && styles.inputDisabled]}>
            <Picker
              enabled={!isReadOnly}
              selectedValue={formData[field.name]}
              onValueChange={(value) => handleInputChange(field.name, value)}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${field.name}`} value="" />
              {field.options?.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            {field.scaleOptions?.map(option => (
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

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = template.fieldTemplates.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.name]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.map(f => f.name).join(', ')}`);
        return;
      }

      // Submit form data
      console.log('Submitting form data:', formData);
      // Add your API call here
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {template && (
        <>
          <Text style={styles.title}>{template.name}</Text>

            {/* Scale Description */}
            {template?.scaleDescription && (
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
          
          {template.fieldTemplates?.map((field, index) => {
            console.log('Field:', field);
            return (
              <View key={index} style={styles.fieldContainer}>
                <Text style={styles.label}>
                  {field.name}
                  {field.required && <Text style={styles.required}> *</Text>}
                </Text>
                {field.description && (
                  <Text style={styles.details}>{field.description}</Text>
                )}
                {renderField(field)}
              </View>
            );
          })}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
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
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  scaleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: '#000',
  },
  scaleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  scaleButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'normal',
    lineHeight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  picker: {
    height: 50,
  },
  textareaInput: {
    height: 100,
    paddingTop: 10,
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  yesNoButton: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
  },
  yesNoButtonSelected: {
    backgroundColor: '#000',
  },
  yesNoButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  yesNoButtonTextSelected: {
    color: '#fff',
  },
  scaleButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    opacity: 0.7,
  },
  scaleButtonTextDisabled: {
    color: '#999',
  },
  yesNoButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    opacity: 0.7,
  },
  yesNoButtonTextDisabled: {
    color: '#999',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
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
    padding: 20,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scaleDescriptionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  scaleDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scaleDescriptionScroll: {
    maxHeight: 150, // Adjust this value to control the height of the scrollable area
    padding: 15,
  },
  scaleDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  textareaInput: {
    height: 100,
    paddingTop: 10,
  },
});// use querry to get tutotr list 
// API user will call the tutro list users/tutotlist
// drop down feil to chose the tutrs list to send tutor id with the form submission