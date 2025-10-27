import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formsService } from "../api/forms";
import { authService } from "../api/auth";
import { formSubmissionsService } from "../api/formSubmissions";
import CustomDropdown from "../components/CustomDropdown";
import { useTheme } from "../contexts/ThemeContext";

export default function FormScreen({ route, navigation }) {
  const queryClient = useQueryClient();
  const { formId, formName, isReview } = route.params || {};
  const [formData, setFormData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Get user data
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const userData = await authService.getUser();

        if (!userData) {
          Alert.alert("Session Expired", "Please log in again", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
          return;
        }

        // Normalize the role data
        let normalizedRole = "";
        if (Array.isArray(userData.role)) {
          normalizedRole = userData.role[0]?.toString() || "UNKNOWN";
        } else {
          normalizedRole = userData.role?.toString() || "UNKNOWN";
        }

        const userWithRole = {
          ...userData,
          role: normalizedRole,
        };

        setUser(userWithRole);
      } catch (error) {
        console.error("Error getting user:", error);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [navigation]);

  // Update the role check function
  const isResident = useCallback((userRole, fieldResponse) => {
    if (!userRole) return false;
    const role = userRole.toString().toUpperCase();
    const response = fieldResponse?.toString().toUpperCase();
    return role !== response;
  }, []);

  // Get tutors list
  const {
    data: tutors,
    isLoading: isLoadingTutors,
    error: tutorError,
  } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const response = await authService.getTutorList();
      return response;
    },
    enabled: !!user && isResident(user.role),
  });

  // Add this query for the form template
  const {
    data: template,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useQuery({
    queryKey: ["formTemplate", formId],
    queryFn: async () => {
      const response = await formsService.getFormById(formId);
      return response;
    },
    enabled: !!formId,
  });
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (user?.role?.toUpperCase() === "RESIDENT" && !selectedTutor) {
        Alert.alert("Error", "Please select a tutor");
        return;
      }

      const submissionData = {
        formtemplate: formId,
        resident: user.id,
        tutor: selectedTutor,
        submissionDate: new Date().toISOString(),
        fieldRecords: Object.entries(formData).map(([fieldName, value]) => {
          const field = template?.fieldTemplates.find(
            (f) => f.name === fieldName
          );
          return {
            fieldName,
            value: value?.toString() || "",
            fieldTemplate: field?._id,
          };
        }),
      };

      await formSubmissionsService.submitForm(submissionData);

      Alert.alert(
        "Success",
        "Form submitted successfully to the selected tutor",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to submit form");
    }
  };

  // Render tutor selection for residents
  const renderTutorSelection = () => {
    if (user?.role !== "RESIDENT") return null;

    return (
      <View style={themedStyles.fieldContainer}>
        <Text style={themedStyles.label}>
          Select Tutor <Text style={themedStyles.required}>*</Text>
        </Text>
        <View style={themedStyles.pickerContainer}>
          <CustomDropdown
            options={tutors?.map((tutor) => tutor.username) || []}
            selectedValue={
              selectedTutor
                ? tutors?.find((t) => t._id === selectedTutor)?.username
                : ""
            }
            onValueChange={(username) => {
              const tutor = tutors?.find((t) => t.username === username);
              setSelectedTutor(tutor?._id);
            }}
            placeholder="Select a tutor..."
          />
        </View>
      </View>
    );
  };

  // Add this console log to debug user role
  useEffect(() => {
    if (user) {
      console.log("Current user:", {
        role: user.role,
        id: user._id,
        roleUpperCase: user.role?.toUpperCase(),
      });
    }
  }, [user]);

  // Add this function to render individual fields
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Add this for date handling
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && dateField) {
      handleInputChange(dateField, selectedDate.toISOString().split("T")[0]);
    }
  };

  // Update the renderField function to use these handlers
  const renderField = (field) => {
    const isReadOnly = isResident(user?.role, field.response);
    switch (field.type?.toLowerCase()) {
      case "text":
        return (
          <TextInput
            style={[
              themedStyles.input,
              isReadOnly && themedStyles.inputDisabled,
            ]}
            value={formData[field.name] || ""}
            onChangeText={(value) =>
              !isReadOnly && handleInputChange(field.name, value)
            }
            placeholder={`Enter ${field.name}`}
            editable={!isReadOnly}
          />
        );
      case "select":
        return (
          <View
            style={[
              themedStyles.selectContainer,
              isReadOnly && themedStyles.inputDisabled,
            ]}>
            <CustomDropdown
              options={field.options || []}
              selectedValue={formData[field.name] || ""}
              onValueChange={(value) =>
                !isReadOnly && handleInputChange(field.name, value)
              }
              placeholder={`Select ${field.name}`}
              disabled={isReadOnly}
            />
          </View>
        );

      case "textarea":
        return (
          <TextInput
            style={[
              themedStyles.input,
              themedStyles.textareaInput,
              isReadOnly && themedStyles.inputDisabled,
            ]}
            value={formData[field.name] || ""}
            onChangeText={(value) =>
              !isReadOnly && handleInputChange(field.name, value)
            }
            placeholder={`Enter ${field.name}`}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isReadOnly}
          />
        );

      case "date":
        return (
          <View>
            <TouchableOpacity
              style={[
                themedStyles.dateButton,
                isReadOnly && themedStyles.inputDisabled,
              ]}
              onPress={() => {
                if (!isReadOnly) {
                  setDateField(field.name);
                  setShowDatePicker(true);
                }
              }}
              disabled={isReadOnly}>
              <Text style={themedStyles.dateButtonText}>
                {formData[field.name] || "Select Date"}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#666" />
            </TouchableOpacity>
            {showDatePicker && dateField === field.name && (
              <DateTimePicker
                value={
                  formData[field.name]
                    ? new Date(formData[field.name])
                    : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}
          </View>
        );

      case "scale":
        return (
          <View style={themedStyles.scaleContainer}>
            {field.scaleOptions?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  themedStyles.scaleButton,
                  formData[field.name] === option &&
                    themedStyles.scaleButtonSelected,
                  isReadOnly && themedStyles.scaleButtonDisabled,
                ]}
                onPress={() =>
                  !isReadOnly && handleInputChange(field.name, option)
                }
                disabled={isReadOnly}>
                <Text
                  style={[
                    themedStyles.scaleButtonText,
                    formData[field.name] === option &&
                      themedStyles.scaleButtonTextSelected,
                    isReadOnly && themedStyles.scaleButtonTextDisabled,
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

  if (
    isLoading ||
    isLoadingTemplate ||
    (user?.role?.toUpperCase() === "RESIDENT" && isLoadingTutors)
  ) {
    return (
      <View style={themedStyles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={themedStyles.errorContainer}>
        <Text>Please log in to continue</Text>
      </View>
    );
  }

  if (templateError || tutorError) {
    return (
      <View style={themedStyles.errorContainer}>
        <Text>Error: {templateError?.message || tutorError?.message}</Text>
        <TouchableOpacity
          style={themedStyles.retryButton}
          onPress={() => {
            if (templateError) {
              queryClient.invalidateQueries(["formTemplate", formId]);
            }
            if (tutorError && user?.role?.toUpperCase() === "RESIDENT") {
              queryClient.invalidateQueries(["tutors"]);
            }
          }}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={themedStyles.container}>
      {template && (
        <>
          {/* <Text style={themedStyles.title}>{template?.name}</Text> */}

          {isResident(user?.role) && (
            <View style={themedStyles.fieldContainer}>
              <Text style={themedStyles.label}>
                Select Tutor <Text style={themedStyles.required}>*</Text>
              </Text>
              <View style={themedStyles.pickerContainer}>
                <CustomDropdown
                  options={tutors?.map((tutor) => tutor.username) || []}
                  selectedValue={
                    selectedTutor
                      ? tutors?.find((t) => t._id === selectedTutor)?.username
                      : ""
                  }
                  onValueChange={(username) => {
                    const tutor = tutors?.find((t) => t.username === username);
                    setSelectedTutor(tutor?._id);
                  }}
                  placeholder="Select a tutor..."
                />
              </View>
            </View>
          )}

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

          {(template?.fieldTemplates || [])
            .sort((a, b) => parseInt(a.section) - parseInt(b.section))
            .map((field, index) => (
              <View key={index} style={themedStyles.fieldContainer}>
                <Text style={themedStyles.label}>
                  {field.name}
                  {field.required && (
                    <Text style={themedStyles.required}> *</Text>
                  )}
                </Text>
                {field.details && (
                  <Text style={themedStyles.details}>{field.details}</Text>
                )}
                {renderField(field)}
              </View>
            ))}

          <TouchableOpacity
            style={[
              themedStyles.submitButton,
              !selectedTutor &&
                isResident(user?.role) &&
                themedStyles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedTutor && isResident(user?.role)}>
            <Text style={themedStyles.submitButtonText}>Submit Form</Text>
          </TouchableOpacity>
        </>
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
    headerContainer: {
      padding: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
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
      shadowColor: theme.shadow,
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
    tutorContainer: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.card,
      marginTop: 8,
      overflow: "hidden",
    },
    picker: {
      height: 50,
      width: "100%",
    },
    pickerPlaceholder: {
      color: theme.textSecondary,
    },
    pickerOption: {
      color: theme.text,
    },
    formFieldsContainer: {
      padding: 16,
    },
    fieldContainer: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    required: {
      color: theme.error,
    },
    details: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
      fontStyle: "italic",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      padding: 10,
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
      borderRadius: 5,
      backgroundColor: theme.card,
    },
    scaleContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 10,
      gap: 10,
    },
    scaleButton: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      backgroundColor: theme.card,
      minWidth: 40,
      alignItems: "center",
    },
    scaleButtonSelected: {
      backgroundColor: theme.text,
    },
    scaleButtonText: {
      color: theme.text,
    },
    scaleButtonTextSelected: {
      color: theme.card,
    },
    dateButton: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      backgroundColor: theme.card,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateButtonText: {
      color: theme.text,
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: theme.text,
      padding: 16,
      borderRadius: 8,
      margin: 16,
      alignItems: "center",
      elevation: 3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    submitButtonText: {
      color: theme.card,
      fontSize: 18,
      fontWeight: "600",
    },
    scaleButtonDisabled: {
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
      backgroundColor: theme.card,
      minWidth: 40,
      alignItems: "center",
    },
    scaleButtonTextDisabled: {
      color: theme.textSecondary,
      fontSize: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    retryButton: {
      backgroundColor: theme.text,
      padding: 16,
      borderRadius: 8,
      margin: 16,
      alignItems: "center",
      elevation: 3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    retryButtonText: {
      color: theme.card,
      fontSize: 18,
      fontWeight: "600",
    },
    errorText: {
      color: theme.error,
      marginTop: 8,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    inputDisabled: {
      backgroundColor: theme.card,
      color: theme.textSecondary,
      opacity: 0.7,
    },
    scaleButtonDisabled: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      opacity: 0.7,
    },
    scaleButtonTextDisabled: {
      color: theme.textSecondary,
    },
  });
