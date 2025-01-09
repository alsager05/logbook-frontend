import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// Updated form templates structure
const formTemplates = [{
  "_id": "678002cae9f2a62ff142d8f0",
  "name": "test111",
  "fieldTemplates": [
    {
      "_id": "678002cae9f2a62ff142d8f2",
      "name": "Resident Name",
      "type": "text",
      "role": ["tutor", "resident"],
      "required": true
    },
    {
      "_id": "678002cae9f2a62ff142d8f3",
      "name": "Level of Training",
      "type": "select",
      "options": ["R1", "R2", "R3", "R4", "R5"],
      "role": ["tutor", "resident"],
      "required": true
    },
    {
      "_id": "678002cae9f2a62ff142d8f4",
      "name": "Date",
      "type": "date",
      "role": ["tutor", "resident"],
      "required": true
    },
    {
      "_id": "678002cae9f2a62ff142d8f5",
      "name": "Technical Skills",
      "type": "scale",
      "scaleOptions": ["1", "2", "3", "4", "5"],
      "role": ["tutor"],
      "required": true
    },
    {
      "_id": "678002cae9f2a62ff142d8f6",
      "name": "Comments",
      "type": "textarea",
      "role": ["tutor", "resident"],
      "required": false
    }
  ],
  "v": 0
}];

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export default function FormScreen({ route, navigation }) {
  const { name } = route.params || { name: 'test111' };
  const [formData, setFormData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const currentRole = 'resident'; // This should come from your auth context or props

  // Find the correct template
  const template = formTemplates[0]; // Since we only have one template now

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', formatDate(selectedDate));
    }
  };

  const renderField = (field) => {
    // Only render fields that are applicable to the current role
    if (!field.role.includes(currentRole)) {
      return null;
    }

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={formData[field._id] || ''}
            onChangeText={(value) => handleInputChange(field._id, value)}
            placeholder={field.name}
          />
        );
      case 'select':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData[field._id]}
              onValueChange={(value) => handleInputChange(field._id, value)}
              style={styles.picker}
            >
              <Picker.Item label="Select..." value="" />
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
                  formData[field._id] === option && styles.scaleButtonSelected
                ]}
                onPress={() => handleInputChange(field._id, option)}
              >
                <Text style={styles.scaleButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'date':
        return (
          <View>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData[field._id] || 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData[field._id] ? new Date(formData[field._id]) : new Date()}
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
            style={styles.textarea}
            value={formData[field._id] || ''}
            onChangeText={(value) => handleInputChange(field._id, value)}
            placeholder={field.name}
            multiline
            numberOfLines={4}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Add your submission logic here
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{template.name}</Text>
      {template.fieldTemplates.map(field => (
        <View key={field._id} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.name}{field.required ? ' *' : ''}</Text>
          {renderField(field)}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  textarea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
}); 