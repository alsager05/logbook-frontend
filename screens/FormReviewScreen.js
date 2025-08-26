import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formsService } from "../api/forms";
import { formSubmissionsService } from "../api/formSubmissions";
import CustomDropdown from "../components/CustomDropdown";

export default function FormReviewScreen({ route, navigation }) {
  const { formId, submissionId, formName, readOnly } = route.params;
  const [fieldRecords, setFieldRecords] = useState({});
  const [newValues, setNewValues] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const queryClient = useQueryClient();

  // Fetch form template and submission
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ["formTemplate", formId],
    queryFn: () => formsService.getFormById(formId),
  });

  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: ["formSubmission", submissionId],
    queryFn: () => formSubmissionsService.getSubmissionById(submissionId),
  });

  // Map existing records
  useEffect(() => {
    if (submission?.fieldRecord) {
      const recordsMap = {};
      submission.fieldRecord.forEach((record, index) => {
        // Find matching field template and map value to field name
        const fieldTemplate = template?.fieldTemplates.find(
          (f) => f._id === record.fieldTemplate
        );
        if (fieldTemplate) {
          recordsMap[fieldTemplate.name] = record.value;
        }
      });
      setFieldRecords(recordsMap);
    }
  }, [submission, template]);
  // Submit new values mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      return await formSubmissionsService.updateSubmission(submissionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["formSubmission", submissionId]);
      Alert.alert("Success", "Form updated successfully");
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to update form");
    },
  });

  const handleSubmit = () => {
    const updatedFields = Object.entries(newValues).map(
      ([fieldName, value]) => {
        const field = template?.fieldTemplates.find(
          (f) => f.name === fieldName
        );
        return {
          fieldName,
          value: value.toString(),
          fieldTemplate: field?._id,
        };
      }
    );

    if (updatedFields.length === 0) {
      Alert.alert("No Changes", "No new values to submit");
      return;
    }

    submitMutation.mutate({ fieldRecords: updatedFields });
  };

  const renderField = (field) => {
    const existingValue = fieldRecords[field.name];
    const isEditable =
      !readOnly && !existingValue && field.response === "tutor";
    const currentValue = existingValue || newValues[field.name] || "";

    const renderLabel = () => (
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{field.name}</Text>
        {field.hasDetails && (
          <Text style={styles.details}>{field.details}</Text>
        )}
      </View>
    );

    if (!isEditable) {
      return (
        <View style={styles.fieldContainer}>
          {renderLabel()}
          <Text style={styles.value}>{existingValue || "Not submitted"}</Text>
        </View>
      );
    }

    switch (field.type?.toLowerCase()) {
      case "text":
        return (
          <View style={styles.fieldContainer}>
            {renderLabel()}
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={(text) =>
                setNewValues({ ...newValues, [field.name]: text })
              }
              placeholder="Enter value"
            />
          </View>
        );

      case "textarea":
        return (
          <View style={styles.fieldContainer}>
            {renderLabel()}
            <TextInput
              style={[styles.input, styles.textareaInput]}
              value={currentValue}
              onChangeText={(text) =>
                setNewValues({ ...newValues, [field.name]: text })
              }
              multiline
              numberOfLines={4}
              placeholder="Enter value"
            />
          </View>
        );

      case "select":
        return (
          <View style={styles.fieldContainer}>
            {renderLabel()}
            <View style={styles.pickerContainer}>
              <CustomDropdown
                options={field.options || []}
                selectedValue={currentValue}
                onValueChange={(value) =>
                  setNewValues({ ...newValues, [field.name]: value })
                }
                // placeholder={`Select ${field.name}`}
                placeholder={`Select`}
                disabled={false}
              />
            </View>
          </View>
        );

      case "scale":
        return (
          <View style={styles.fieldContainer}>
            {renderLabel()}
            <View style={styles.scaleContainer}>
              {field.scaleOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.scaleButton,
                    currentValue === option && styles.scaleButtonSelected,
                  ]}
                  onPress={() =>
                    setNewValues({ ...newValues, [field.name]: option })
                  }>
                  <Text
                    style={[
                      styles.scaleButtonText,
                      currentValue === option && styles.scaleButtonTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (templateLoading || submissionLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading form ...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{template?.formName}</Text>
        <Text style={styles.subtitle}>
          Submitted by: {submission?.resident?.username}
        </Text>
        <Text style={styles.subtitle}>
          Reviewed by: {submission?.tutor?.username}
        </Text>
      </View>

      {template?.scaleDescription && (
        <View style={styles.scaleDescriptionContainer}>
          <Text style={styles.scaleDescriptionTitle}>
            Evaluation Scale Guide
          </Text>
          <ScrollView
            style={styles.scaleDescriptionScroll}
            nestedScrollEnabled={true}>
            <Text style={styles.scaleDescription}>
              {template?.scaleDescription}
            </Text>
          </ScrollView>
        </View>
      )}

      <View style={styles.formContainer}>
        {template?.fieldTemplates
          ?.sort((a, b) => parseInt(a.section) - parseInt(b.section))
          .map((field, index) => (
            <View key={field._id || index}>{renderField(field)}</View>
          ))}
      </View>

      {!readOnly && Object.keys(newValues).length > 0 && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  formContainer: {
    padding: 20,
  },
  fieldContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  value: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  scaleContainer: {
    gap: 8,
  },
  scaleDescriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#000",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    maxHeight: 200,
  },
  scaleDescriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f8f8",
  },
  scaleDescriptionScroll: {
    padding: 12,
    maxHeight: 150,
  },
  scaleDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  // scaleDescription: {
  //   fontSize: 14,
  //   color: "#666",
  //   fontStyle: "italic",
  //   marginTop: 4,
  // },
  messageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textareaInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  scaleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scaleButtonSelected: {
    backgroundColor: "#000",
  },
  scaleButtonText: {
    fontSize: 16,
    color: "#000",
  },
  scaleButtonTextSelected: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
