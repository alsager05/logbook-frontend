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

const { width } = Dimensions.get("window");

export default function ResidentSubmissionsScreen({ navigation }) {
  const [showFormModal, setShowFormModal] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

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
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading submissions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>
          Error loading submissions: {error.message}
        </Text>
      </View>
    );
  }

  const submissions = Array.isArray(data) ? data : [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFA500"; // Orange
      case "approved":
        return "#4CAF50"; // Green
      case "rejected":
        return "#FF0000"; // Red
      default:
        return "#808080"; // Gray
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]}
            tintColor="#4F46E5"
          />
        }>
        <View style={styles.submissionsContainer}>
          {/* New Form Button */}
          <TouchableOpacity
            style={styles.newFormButton}
            onPress={() => setShowFormModal(true)}>
            <View style={styles.newFormButtonContent}>
              <View style={styles.newFormIcon}>
                <Ionicons name="add" size={24} color="#fff" />
              </View>
              <View style={styles.newFormText}>
                <Text style={styles.newFormTitle}>New Form Submission</Text>
                <Text style={styles.newFormSubtitle}>
                  Submit a new evaluation form
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
            </View>
          </TouchableOpacity>

          {/* Submissions List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Submissions</Text>
          </View>

          {submissions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No submissions yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Your submitted forms will appear here
              </Text>
            </View>
          ) : (
            submissions.map((submission) => (
              <TouchableOpacity
                key={submission._id}
                style={styles.submissionCard}
                onPress={() =>
                  navigation.navigate("FormReview", {
                    formName: submission.formTemplate?.formName || "Form",
                    formId: submission.formTemplate?._id,
                    submissionId: submission._id,
                    readOnly: true,
                  })
                }>
                <Text style={styles.formName}>
                  {submission.formTemplate?.formName || "Unnamed Form"}
                </Text>
                <View style={styles.detailsContainer}>
                  <Text style={styles.submissionDetails}>
                    Submitted:{" "}
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.submissionDetails}>
                    Tutor: {submission.tutor?.username || "Not assigned"}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(submission.status) },
                      ]}
                    />
                    <Text style={styles.statusText}>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Form Type</Text>
            <TouchableOpacity onPress={() => setShowFormModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {templatesLoading ? (
              <Text style={styles.loadingText}>Loading forms...</Text>
            ) : (
              (formTemplates || []).map((template) => (
                <TouchableOpacity
                  key={template._id}
                  style={styles.formOption}
                  onPress={() => handleFormSelect(template)}>
                  <View style={styles.formOptionContent}>
                    <View style={styles.formOptionLeft}>
                      <Text style={styles.formOptionTitle}>
                        {template.formName}
                      </Text>
                      <Text style={styles.formOptionSubtitle}>
                        {getFormSubtitle(template.formName)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  submissionsContainer: {
    padding: 16,
  },
  // New Form Button Styles
  newFormButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "#4F46E5",
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
    color: "#1e293b",
    marginBottom: 4,
  },
  newFormSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  // Section Header
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
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
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  // Submission Card Styles
  submissionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 4,
  },
  submissionDetails: {
    fontSize: 14,
    color: "#64748b",
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
    color: "#64748b",
    fontWeight: "500",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 40,
  },
  formOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#1e293b",
    marginBottom: 4,
  },
  formOptionSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  messageText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 20,
  },
});
