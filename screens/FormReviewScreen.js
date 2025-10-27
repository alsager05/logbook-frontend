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
import { useTheme } from "../contexts/ThemeContext";

export default function FormReviewScreen({ route, navigation }) {
  const { formId, submissionId, formName, readOnly } = route.params;
  const [fieldRecords, setFieldRecords] = useState({});
  const [newValues, setNewValues] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const queryClient = useQueryClient();

  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

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
      <View style={themedStyles.labelContainer}>
        <Text style={themedStyles.label}>{field.name}</Text>
        {field.hasDetails && (
          <Text style={themedStyles.details}>{field.details}</Text>
        )}
      </View>
    );

    if (!isEditable) {
      return (
        <View style={themedStyles.fieldContainer}>
          {renderLabel()}
          <Text style={themedStyles.value}>
            {existingValue || "Not submitted"}
          </Text>
        </View>
      );
    }

    switch (field.type?.toLowerCase()) {
      case "text":
        return (
          <View style={themedStyles.fieldContainer}>
            {renderLabel()}
            <TextInput
              style={themedStyles.input}
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
          <View style={themedStyles.fieldContainer}>
            {renderLabel()}
            <TextInput
              style={[themedStyles.input, themedStyles.textareaInput]}
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
          <View style={themedStyles.fieldContainer}>
            {renderLabel()}
            <View style={themedStyles.pickerContainer}>
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
          <View style={themedStyles.fieldContainer}>
            {renderLabel()}
            <View style={themedStyles.scaleContainer}>
              {field.scaleOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    themedStyles.scaleButton,
                    currentValue === option && themedStyles.scaleButtonSelected,
                  ]}
                  onPress={() =>
                    setNewValues({ ...newValues, [field.name]: option })
                  }>
                  <Text
                    style={[
                      themedStyles.scaleButtonText,
                      currentValue === option &&
                        themedStyles.scaleButtonTextSelected,
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
      <View style={themedStyles.container}>
        <Text style={themedStyles.messageText}>Loading form ...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>{template?.formName}</Text>
        <Text style={themedStyles.subtitle}>
          Submitted by: {submission?.resident?.username}
        </Text>
        <Text style={themedStyles.subtitle}>
          Reviewed by: {submission?.tutor?.username}
        </Text>
      </View>

      {template?.scaleDescription && (
        <View style={themedStyles.scaleDescriptionContainer}>
          <Text style={themedStyles.scaleDescriptionTitle}>
            Evaluation Scale Guide
          </Text>
          <ScrollView
            style={themedStyles.scaleDescriptionScroll}
            nestedScrollEnabled={true}>
            <Text style={themedStyles.scaleDescription}>
              {template?.scaleDescription}
            </Text>
          </ScrollView>
        </View>
      )}

      <View style={themedStyles.formContainer}>
        {template?.fieldTemplates
          ?.sort((a, b) => parseInt(a.section) - parseInt(b.section))
          .map((field, index) => (
            <View key={field._id || index}>{renderField(field)}</View>
          ))}
      </View>

      {!readOnly && Object.keys(newValues).length > 0 && (
        <TouchableOpacity
          style={themedStyles.submitButton}
          onPress={handleSubmit}>
          <Text style={themedStyles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      padding: 20,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    formContainer: {
      padding: 20,
    },
    fieldContainer: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.text,
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
      color: theme.text,
      marginBottom: 4,
    },
    details: {
      fontSize: 14,
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    value: {
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.card,
      padding: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    scaleContainer: {
      gap: 8,
    },
    scaleDescriptionContainer: {
      backgroundColor: theme.card,
      borderRadius: 8,
      margin: 16,
      marginTop: 8,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.text,
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      maxHeight: 200,
    },
    scaleDescriptionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    scaleDescriptionScroll: {
      padding: 12,
      maxHeight: 150,
    },
    scaleDescription: {
      fontSize: 14,
      color: theme.text,
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
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.card,
    },
    textareaInput: {
      height: 100,
      textAlignVertical: "top",
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      backgroundColor: theme.card,
    },
    scaleButton: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      alignItems: "center",
      backgroundColor: theme.card,
    },
    scaleButtonSelected: {
      backgroundColor: theme.text,
    },
    scaleButtonText: {
      fontSize: 16,
      color: theme.text,
    },
    scaleButtonTextSelected: {
      color: theme.card,
    },
    submitButton: {
      backgroundColor: theme.text,
      padding: 16,
      borderRadius: 8,
      margin: 16,
      alignItems: "center",
    },
    submitButtonText: {
      color: theme.card,
      fontSize: 18,
      fontWeight: "600",
    },
  });
