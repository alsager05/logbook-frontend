import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionsService } from "../api/formSubmissions";
import { formsService } from "../api/forms";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

export default function ResidentSubmissionsScreen({ navigation }) {
  const [showFormModal, setShowFormModal] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Get resident submissions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["residentSubmissions"],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  // Get form templates for new submission
  const {
    data: formTemplates,
    isLoading: templatesLoading,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ["formTemplates"],
    queryFn: async () => {
      const response = await formsService.getAllForms();
      return Array.isArray(response) ? response : [];
    },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchTemplates()]);
    setRefreshing(false);
  }, [refetch, refetchTemplates]);

  // Helper function to get subtitle based on form name
  const getFormSubtitle = (formName) => {
    switch (formName.toUpperCase()) {
      case "OBS":
        return "Obstetrics";
      case "GYN":
        return "Gynecology";
      case "EPA":
        return "Entrustable Professional Activities";
      default:
        return formName;
    }
  };

  const handleFormSelect = (template) => {
    setShowFormModal(false);
    navigation.navigate("Form", {
      formId: template._id,
      formName: template.formName,
      formData: {
        ...template,
        fieldTemplates: template.fieldTemplates || [],
      },
    });
  };

  if (isLoading && !refreshing) {
    return (
      <View style={themedStyles.container}>
        <Text style={themedStyles.messageText}>Loading submissions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themedStyles.container}>
        <Text style={themedStyles.messageText}>
          Error loading submissions: {error.message}
        </Text>
      </View>
    );
  }

  const submissions = Array.isArray(data) ? data : [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return theme.warning;
      case "approved":
        return theme.success;
      case "rejected":
        return theme.error;
      default:
        return theme.textLight;
    }
  };

  return (
    <View style={themedStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }>
        <View style={themedStyles.submissionsContainer}>
          {/* New Form Button */}
          {/* <TouchableOpacity
            style={themedStyles.newFormButton}
            onPress={() => setShowFormModal(true)}>
            <View style={themedStyles.newFormButtonContent}>
              <View style={themedStyles.newFormIcon}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
              <View style={themedStyles.newFormText}>
                <Text style={themedStyles.newFormTitle}>
                  New Form Submission
                </Text>
                <Text style={themedStyles.newFormSubtitle}>
                  Submit a new evaluation form
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.primary}
              />
            </View>
          </TouchableOpacity> */}

          {/* Submissions List */}
          <View style={themedStyles.sectionHeader}>
            <Text style={themedStyles.sectionTitle}>My Submissions</Text>
          </View>

          {submissions.length === 0 ? (
            <View style={themedStyles.emptyState}>
              <Ionicons
                name="document-outline"
                size={48}
                color={theme.textLight}
              />
              <Text style={themedStyles.emptyStateTitle}>
                No submissions yet
              </Text>
              <Text style={themedStyles.emptyStateSubtitle}>
                Your submitted forms will appear here
              </Text>
            </View>
          ) : (
            submissions.map((submission) => (
              <TouchableOpacity
                key={submission._id}
                style={themedStyles.submissionCard}
                onPress={() =>
                  navigation.navigate("FormReview", {
                    formName: submission.formTemplate?.formName || "Form",
                    formId: submission.formTemplate?._id,
                    submissionId: submission._id,
                    readOnly: true,
                  })
                }>
                <View style={themedStyles.cardHeader}>
                  <Text style={themedStyles.formName}>
                    {submission.formTemplate?.formName || "Unnamed Form"}
                  </Text>
                  {submission.institution && (
                    <View style={themedStyles.institutionBadge}>
                      <Ionicons name="business" size={12} color="#fff" />
                      <Text style={themedStyles.institutionBadgeText}>
                        {submission.institution.name}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={themedStyles.detailsContainer}>
                  <Text style={themedStyles.submissionDetails}>
                    Submitted:{" "}
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </Text>
                  <Text style={themedStyles.submissionDetails}>
                    Tutor: {submission.tutor?.username || "Not assigned"}
                  </Text>
                  <View style={themedStyles.statusContainer}>
                    <View
                      style={[
                        themedStyles.statusDot,
                        { backgroundColor: getStatusColor(submission.status) },
                      ]}
                    />
                    <Text style={themedStyles.statusText}>
                      {submission.status || "Pending"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Form Selection Modal */}
      <Modal
        visible={showFormModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFormModal(false)}>
        <View style={themedStyles.modalContainer}>
          <View style={themedStyles.modalHeader}>
            <Text style={themedStyles.modalTitle}>Select Form Type</Text>
            <TouchableOpacity onPress={() => setShowFormModal(false)}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={themedStyles.modalContent}>
            {templatesLoading ? (
              <Text style={themedStyles.loadingText}>Loading forms...</Text>
            ) : (
              (formTemplates || []).map((template) => (
                <TouchableOpacity
                  key={template._id}
                  style={themedStyles.formOption}
                  onPress={() => handleFormSelect(template)}>
                  <View style={themedStyles.formOptionContent}>
                    <View style={themedStyles.formOptionLeft}>
                      <Text style={themedStyles.formOptionTitle}>
                        {template.formName}
                      </Text>
                      <Text style={themedStyles.formOptionSubtitle}>
                        {getFormSubtitle(template.formName)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.textLight}
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    submissionsContainer: {
      padding: 16,
    },
    // New Form Button Styles
    newFormButton: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    newFormButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    newFormIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    newFormText: {
      flex: 1,
    },
    newFormTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },
    newFormSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    // Section Header
    sectionHeader: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    // Empty State
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    // Submission Card Styles
    submissionCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
      gap: 8,
    },
    formName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      flex: 1,
    },
    institutionBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    institutionBadgeText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#fff",
    },
    detailsContainer: {
      gap: 4,
    },
    submissionDetails: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: theme.modalBackground,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    modalContent: {
      flex: 1,
      padding: 20,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 40,
    },
    formOption: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    formOptionContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
    },
    formOptionLeft: {
      flex: 1,
    },
    formOptionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },
    formOptionSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    messageText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 20,
    },
  });
