// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Ionicons } from '@expo/vector-icons';
// import { useQuery } from '@tanstack/react-query';
// import { formsService } from '../api/forms';

// // Helper function to check numeric fields
// const isNumericField = (fieldName) => {
//   if (!fieldName || typeof fieldName !== 'string') return false;
//   return /^\d+\./.test(fieldName);
// };

// export default function FormScreen({ route, navigation, role }) {
//   const { formId, formName } = route.params || {};
//   const [formData, setFormData] = useState({});
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [dateField, setDateField] = useState(null);
//   const currentRole = role?.toUpperCase();

//   // Fetch form template using useQuery
//   const { 
//     data: template, 
//     isLoading, 
//     error 
//   } = useQuery({
//     queryKey: ['formTemplate', formId],
//     queryFn: () => formsService.getFormById(formId),
//     enabled: !!formId,
//     onSuccess: (data) => {
//       console.log('Form template fetched:', data);
//     },
//     onError: (error) => {
//       console.error('Error fetching form template:', error);
//     }
//   });

//   // Show loading state
//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading form...</Text>
//       </View>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text>Error loading form: {error.message}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.retryButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Filter fields based on role
//   const visibleFields = template?.fieldTemplates?.filter(field => 
//     field.response === currentRole || field.response === 'RESIDENT'
//   );

//   const handleInputChange = (fieldName, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldName]: value
//     }));
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate && dateField) {
//       handleInputChange(dateField, formatDate(selectedDate));
//     }
//   };

//   const renderField = (field) => {
//     // Only render if field is meant for current role
//     if (field.response !== currentRole && field.response !== 'RESIDENT') {
//       return null;
//     }

//     // Make fields read-only for residents if they're in section 2
//     const isReadOnly = currentRole === 'RESIDENT' && field.section === "2";


//     // it should be a switch statement that renders the field based on the type
//     // you will use the formData to get the value of the field
//     // you will use the handleInputChange to update the value of the field
  
//     switch (field.type) {
//       case 'text':
//         return (
//           <TextInput
//             style={styles.input}
//             value={formData[field.formName] || ''}
//             onChangeText={(value) => handleInputChange(field.formName, value)}
//             placeholder={`Enter ${field.formName}`}
//           />
//         );

//       case 'date':
//         return (
//           <View>
//             <TouchableOpacity 
//               style={styles.dateButton}
//               onPress={() => {
//                 setDateField(field.formName);
//                 setShowDatePicker(true);
//               }}
//             >
//               <View style={styles.dateButtonContent}>
//                 <Ionicons name="calendar-outline" size={24} color="#666" />
//                 <Text style={styles.dateButtonText}>
//                   {formData[field.formName] || 'Select Date'}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//             {showDatePicker && dateField === field.formName && (
//               <DateTimePicker
//                 value={formData[field.formName] ? new Date(formData[field.formName]) : new Date()}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onChange={handleDateChange}
//               />
//             )}
//           </View>
//         );

//       case 'scale':
//         return (
//           <View style={styles.scaleContainer}>
//             {field.scaleOptions.map(option => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.scaleButton,
//                   formData[field.formName] === option && styles.scaleButtonSelected,
//                   isReadOnly && styles.scaleButtonDisabled
//                 ]}
//                 onPress={() => !isReadOnly && handleInputChange(field.formName, option)}
//                 disabled={isReadOnly}
//               >
//                 <Text style={[
//                   styles.scaleButtonText,
//                   formData[field.formName] === option && styles.scaleButtonTextSelected,
//                   isReadOnly && styles.scaleButtonTextDisabled
//                 ]}>
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         );

//       case 'select':
//         if (field.formName.includes('safely perform')) {
//           return (
//             <View style={styles.yesNoContainer}>
//               {['Yes', 'No'].map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.yesNoButton,
//                     formData[field.formName] === option && styles.yesNoButtonSelected,
//                     isReadOnly && styles.yesNoButtonDisabled
//                   ]}
//                   onPress={() => !isReadOnly && handleInputChange(field.formName, option)}
//                   disabled={isReadOnly}
//                 >
//                   <Text style={[
//                     styles.yesNoButtonText,
//                     formData[field.formName] === option && styles.yesNoButtonTextSelected,
//                     isReadOnly && styles.yesNoButtonTextDisabled
//                   ]}>
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           );
//         }
//         return (
//           <View>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={formData[field.formName]}
//                 onValueChange={(value) => handleInputChange(field.formName, value)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label={`Select ${field.formName}`} value="" />
//                 {field.options?.map(option => (
//                   <Picker.Item key={option} label={option} value={option} />
//                 ))}
//               </Picker>
//             </View>
//             {field.formName === "Obstetrical Procedure" && 
//              formData[field.formName] === "Other" && (
//               <TextInput
//                 style={[styles.input, styles.otherInput]}
//                 value={formData[`${field.formName}_other`] || ''}
//                 onChangeText={(value) => handleInputChange(`${field.formName}_other`, value)}
//                 placeholder="Please specify the procedure"
//                 multiline={true}
//                 numberOfLines={3}
//               />
//             )}
//           </View>
//         );

//       case 'textarea':
//         return (
//           <TextInput
//             style={[
//               styles.input, 
//               styles.textareaInput,
//               isReadOnly && styles.inputDisabled
//             ]}
//             value={formData[field.formName] || ''}
//             onChangeText={(value) => !isReadOnly && handleInputChange(field.formName, value)}
//             placeholder={field.formName.includes('specific aspect') ? 'Enter comments about what was done well...' :
//                         field.formName.includes('suggestion') ? 'Enter suggestions for improvement...' :
//                         `Enter ${field.formName}`}
//             multiline={true}
//             numberOfLines={4}
//             textAlignVertical="top"
//             editable={!isReadOnly}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Form Data:', formData);
//     // Add your submission logic here
//   };

//   const renderFields = () => {
//     if (!template?.fieldTemplates) return null;

//     return (
//       <>
//         <Text style={styles.title}>{template.name}</Text>
        
//         {/* Basic Fields */}
//         {template.fieldTemplates
//           .filter(field => field?.name && !isNumericField(field.formName))
//           .map((field, index) => (
//             <View key={`basic-${index}`} style={styles.fieldContainer}>
//               <Text style={styles.label}>{field.formName}</Text>
//               {field.details && (
//                 <Text style={styles.details}>{field.details}</Text>
//               )}
//               {renderField(field)}
//             </View>
//           ))}

//         {/* Scale Description */}
//         {template?.scaleDescription && (
//           <View style={styles.scaleDescriptionContainer}>
//             <Text style={styles.scaleDescriptionTitle}>Evaluation Scale Guide</Text>
//             <ScrollView 
//               style={styles.scaleDescriptionScroll}
//               nestedScrollEnabled={true}
//             >
//               <Text style={styles.scaleDescription}>{template.scaleDescription}</Text>
//             </ScrollView>
//           </View>
//         )}

//         {/* Numeric Fields */}
//         {template.fieldTemplates
//           .filter(field => field?.name && isNumericField(field.formName))
//           .sort((a, b) => {
//             const aNum = parseInt(a.name);
//             const bNum = parseInt(b.name);
//             return aNum - bNum;
//           })
//           .map((field, index) => (
//             <View key={`numeric-${index}`} style={styles.fieldContainer}>
//               <Text style={styles.label}>{field.formName}</Text>
//               {field.details && (
//                 <Text style={styles.details}>{field.details}</Text>
//               )}
//               {renderField(field)}
//             </View>
//           ))}

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>Submit</Text>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {renderFields()}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 10,
//     borderRadius: 5,
//     fontSize: 16,
//   },
//   dateButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 15,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   dateButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   dateButtonText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   scaleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   scaleButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 5,
//     minWidth: 50,
//     alignItems: 'center',
//   },
//   scaleButtonSelected: {
//     backgroundColor: '#000',
//   },
//   scaleButtonText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   scaleButtonTextSelected: {
//     color: '#fff',
//   },
//   submitButton: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   details: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//     fontStyle: 'normal',
//     lineHeight: 20,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     marginTop: 5,
//   },
//   picker: {
//     height: 50,
//   },
//   otherInput: {
//     marginTop: 10,
//     height: 80,
//     textAlignVertical: 'top',
//     paddingTop: 10,
//   },
//   scaleDescriptionContainer: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 5,
//     marginBottom: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#000',
//   },
//   scaleDescriptionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   scaleDescriptionScroll: {
//     maxHeight: 150, // Adjust this value to control the height of the scrollable area
//     padding: 15,
//   },
//   scaleDescription: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//   },
//   textareaInput: {
//     height: 100,
//     paddingTop: 10,
//   },
//   yesNoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   yesNoButton: {
//     flex: 1,
//     padding: 15,
//     margin: 5,
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   yesNoButtonSelected: {
//     backgroundColor: '#000',
//   },
//   yesNoButtonText: {
//     fontSize: 16,
//     color: '#000',
//     fontWeight: '500',
//   },
//   yesNoButtonTextSelected: {
//     color: '#fff',
//   },
//   scaleButtonDisabled: {
//     backgroundColor: '#f5f5f5',
//     borderColor: '#ddd',
//     opacity: 0.7,
//   },
//   scaleButtonTextDisabled: {
//     color: '#999',
//   },
//   yesNoButtonDisabled: {
//     backgroundColor: '#f5f5f5',
//     borderColor: '#ddd',
//     opacity: 0.7,
//   },
//   yesNoButtonTextDisabled: {
//     color: '#999',
//   },
//   inputDisabled: {
//     backgroundColor: '#f5f5f5',
//     color: '#999',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   retryButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#000',
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// }); 