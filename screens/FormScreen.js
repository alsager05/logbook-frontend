import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const formTemplates = [{
  "_id": "677ee74806967f14b093719c",
  "name": "SCORE",
  "fieldTemplates": [
    {
      "name": "Name",
      "type": "text",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "RESIDENT",
      "section": "1"
    },
    {
      "name": "Level of Training",
      "type": "select",
      "options": ["PGY-1", "PGY-2", "PGY-3", "PGY-4", "PGY-5"],
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "RESIDENT",
      "section": "1"
    },
    {
      "name": "Date",
      "type": "date",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "RESIDENT",
      "section": "1"
    },
    {
      "name": "Obstetrical Procedure",
      "type": "select",
      "options": [
        "Normal Vaginal Delivery",
        "Episiotomy and repair",
        "Cesarean Section",
        "Vacuum Assisted Delivery",
        "Forceps Delivery",
        "Breech Delivery",
        "Multiple Gestation Delivery",
        "External Cephalic Version",
        "Cervical Cerclage",
        "Postpartum Hemorrhage Management",
        "Repair of Obstetric Lacerations",
        "3rd degree perineal laceration repair",
        "4th degree perineal laceration repair",
        "cervical tear repair",	
        "B-Lynch suture placement",
        "Cesarean hysterectomy ",
        "Uterine artery ligation",
        "Manual removal of retained placenta",
        "Dilation and curettage",
        "Dilation and evacuation in second trimester",
        "Hematoma evacuation",
        "Repair of uterine rupture",
        "Shoulder dystocia maneuvers",
        "Suction evacuation of molar pregnancy",
        "Uterine tamponade",
        "Wound care- incision and drainage of hematoma/abcess",
        "Wound care - Debridemnt",
        "Wound care - secondary repair",
        "Repair of uterine rupture",
        "Other"
      ],
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "RESIDENT",
      "section": "1"
    },
    {
      "name": "1. Pre-procedure plan",
      "details": "Gathers/assesses required information to reach diagnosis and determine correct procedure required",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "2. Case preparation",
      "details": "Patient correctly prepared and positioned, understands approach and required instruments, prepared to deal with probable complications",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "3. Knowledge of specific procedural steps",
      "details": "Understands steps of procedure, potential risks, and means to avoid/overcome them",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "4. Technical performance",
      "details": "Efficiently performs steps, avoiding pitfalls and respecting soft tissues",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "5. Visuospatial skills",
      "details": "3D spatial orientation and able to position instruments/hardware where intended",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "6. Post-procedure plan",
      "details": "Appropriate complete post procedure plan",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "7. Efficiency and flow",
      "details": "Obvious planned course of procedure with economy of movement and flow",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "8. Communication",
      "details": "Professional and effective communication/utilization of staff",
      "type": "scale",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2",
      "scaleOptions": ["1", "2", "3", "4", "5"]
    },
    {
      "name": "9. Resident is able to safely perform this procedure independently ",
      "type": "select",
      "options": ["Yes", "No"],
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2"
    },
    {
      "name": "10. Give at least 1 specific aspect of procedure done well",
      "type": "textarea",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2"
    },
    {
      "name": "11. Give at least 1 specific suggestion for improvement",
      "type": "textarea",
      "formTemplate": "677ee74806967f14b093719c",
      "position": "LEFT",
      "response": "TUTOR",
      "section": "2"
    }
  ]
}];

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const scaleDescription = `The purpose of this scale is to evaluate the trainee's ability to perform this procedure safely and independently. With that in mind please use the scale below to evaluate each item, irrespective of the resident's level of training in regards to this case.

Scale:
1 - "I had to do" - Requires complete hands on guidance, did not do, or was not given the opportunity to do
2 - "I had to talk them through" - Able to perform tasks but requires constant direction
3 - "I had to prompt them from time to time" - Demonstrates some independence, but requires intermittent direction
4 - "I needed to be in the room just in case" - Independence but unaware of risks and still requires supervision for safe practice
5 - "I did not need to be there" - Complete independence, understands risks and performs safely, practice ready`;

export default function FormScreen({ route, navigation, role }) {
  const { name } = route.params || { name: 'SCORE' };
  const [formData, setFormData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const currentRole = role?.toUpperCase(); // Convert to uppercase to match our constants

  // Find the correct template
  const template = formTemplates.find(t => t.name === name) || formTemplates[0];

  // Filter fields based on role
  const visibleFields = template.fieldTemplates.filter(field => 
    field.response === currentRole || field.response === 'RESIDENT'
  );

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && dateField) {
      handleInputChange(dateField, formatDate(selectedDate));
    }
  };

  const renderField = (field) => {
    // Only render if field is meant for current role
    if (field.response !== currentRole && field.response !== 'RESIDENT') {
      return null;
    }

    // Make fields read-only for residents if they're in section 2
    const isReadOnly = currentRole === 'RESIDENT' && field.section === "2";

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={formData[field.name] || ''}
            onChangeText={(value) => handleInputChange(field.name, value)}
            placeholder={`Enter ${field.name}`}
          />
        );

      case 'date':
        return (
          <View>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                setDateField(field.name);
                setShowDatePicker(true);
              }}
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

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            {field.scaleOptions.map(option => (
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
          <View>
            <View style={styles.pickerContainer}>
              <Picker
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
            {field.name === "Obstetrical Procedure" && 
             formData[field.name] === "Other" && (
              <TextInput
                style={[styles.input, styles.otherInput]}
                value={formData[`${field.name}_other`] || ''}
                onChangeText={(value) => handleInputChange(`${field.name}_other`, value)}
                placeholder="Please specify the procedure"
                multiline={true}
                numberOfLines={3}
              />
            )}
          </View>
        );

      case 'textarea':
        return (
          <TextInput
            style={[
              styles.input, 
              styles.textareaInput,
              isReadOnly && styles.inputDisabled
            ]}
            value={formData[field.name] || ''}
            onChangeText={(value) => !isReadOnly && handleInputChange(field.name, value)}
            placeholder={field.name.includes('specific aspect') ? 'Enter comments about what was done well...' :
                        field.name.includes('suggestion') ? 'Enter suggestions for improvement...' :
                        `Enter ${field.name}`}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isReadOnly}
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
      
      {/* Render basic info fields (name, level, date, procedure) */}
      {template.fieldTemplates
        .filter(field => !field.name.startsWith('1.') && !field.name.startsWith('2.') && 
                        !field.name.startsWith('3.') && !field.name.startsWith('4.') && 
                        !field.name.startsWith('5.') && !field.name.startsWith('6.') && 
                        !field.name.startsWith('7.') && !field.name.startsWith('8.') && 
                        !field.name.startsWith('9.') && !field.name.startsWith('10.') && 
                        !field.name.startsWith('11.'))
        .map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.name}</Text>
            {field.details && (
              <Text style={styles.details}>{field.details}</Text>
            )}
            {renderField(field)}
          </View>
        ))}

      {/* Scale Description Section */}
      <View style={styles.scaleDescriptionContainer}>
        <Text style={styles.scaleDescriptionTitle}>Evaluation Scale Guide</Text>
        <ScrollView 
          style={styles.scaleDescriptionScroll}
          nestedScrollEnabled={true}
        >
          <Text style={styles.scaleDescription}>{scaleDescription}</Text>
        </ScrollView>
      </View>

      {/* Render all numbered questions in sequence */}
      {template.fieldTemplates
        .filter(field => field.name.match(/^\d+\./))
        .sort((a, b) => {
          const aNum = parseInt(a.name.split('.')[0]);
          const bNum = parseInt(b.name.split('.')[0]);
          return aNum - bNum;
        })
        .map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.name}</Text>
            {field.details && (
              <Text style={styles.details}>{field.details}</Text>
            )}
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
  otherInput: {
    marginTop: 10,
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
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
}); 