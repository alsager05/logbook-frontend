import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formSubmissionsService } from "../api/formSubmissions";
import { authService } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function FormsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = React.useState("pending");
  const [showDeleteButton, setShowDeleteButton] = React.useState({});
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Get forms data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["formsSubmissions"],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: formSubmissionsService.deleteSubmission,
    onSuccess: async () => {
      // Clear delete button state
      setShowDeleteButton({});
      // Invalidate and refetch the query
      await queryClient.invalidateQueries([
        "formsSubmissions",
        "dashboardSubmissions",
      ]);
      // Force a refetch to ensure UI updates
      await refetch();
      Alert.alert("Success", "Form submission deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      Alert.alert("Error", error.message || "Failed to delete submission");
    },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDeleteSubmission = (submissionId, formName) => {
    Alert.alert(
      "Delete Submission",
      `Are you sure you want to delete the submission for "${formName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Attempting to delete submission:", submissionId);
            deleteMutation.mutate(submissionId);
          },
        },
      ]
    );
  };

  const toggleDeleteButton = (formId) => {
    setShowDeleteButton((prev) => ({
      ...prev,
      [formId]: !prev[formId],
    }));
  };

  const themedStyles = createThemedStyles(theme);

  if (isLoading && !refreshing) {
    return (
      <View style={themedStyles.container}>
        <Text style={themedStyles.messageText}>Loading forms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themedStyles.container}>
        <Text style={themedStyles.messageText}>
          Error loading forms: {error.message}
        </Text>
      </View>
    );
  }

  const forms = Array.isArray(data) ? data : [];
  const pendingForms = forms.filter((form) => form.status === "pending");
  const completedForms = forms.filter((form) => form.status === "completed");

  return (
    <ScrollView
      style={themedStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }>
      <View style={themedStyles.content}>
        {/* Tab Navigation */}
        <View style={themedStyles.tabContainer}>
          <TouchableOpacity
            style={[
              themedStyles.tab,
              selectedTab === "pending" && themedStyles.activeTab,
            ]}
            onPress={() => setSelectedTab("pending")}>
            <Text
              style={[
                themedStyles.tabText,
                selectedTab === "pending" && themedStyles.activeTabText,
              ]}>
              Pending ({pendingForms.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              themedStyles.tab,
              selectedTab === "completed" && themedStyles.activeTab,
            ]}
            onPress={() => setSelectedTab("completed")}>
            <Text
              style={[
                themedStyles.tabText,
                selectedTab === "completed" && themedStyles.activeTabText,
              ]}>
              Completed ({completedForms.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms List */}
        {selectedTab === "pending" ? (
          pendingForms.length === 0 ? (
            <View style={themedStyles.emptyState}>
              <Text style={themedStyles.emptyStateTitle}>No pending forms</Text>
              <Text style={themedStyles.emptyStateSubtitle}>
                All forms have been reviewed
              </Text>
            </View>
          ) : (
            pendingForms.map((form) => {
              const dateField = form.fieldRecord.find(
                (field) => field.fieldName === "Date"
              );
              const formattedDate = dateField?.value
                ? new Date(dateField.value).toLocaleDateString()
                : "No date available";

              return (
                <View key={form._id} style={themedStyles.formCardContainer}>
                  <TouchableOpacity
                    style={themedStyles.formCard}
                    onPress={() =>
                      navigation.navigate("FormReview", {
                        formName: form.formTemplate?.formName || "Form",
                        formId: form.formTemplate?._id,
                        submissionId: form._id,
                      })
                    }
                    onLongPress={() => toggleDeleteButton(form._id)}>
                    <View style={themedStyles.formCardHeader}>
                      <Text style={themedStyles.formName}>
                        {form.formTemplate?.formName || "Unnamed Form"}
                      </Text>
                      <View style={themedStyles.formCardHeaderRight}>
                        <View
                          style={[
                            themedStyles.statusBadge,
                            themedStyles.pendingBadge,
                          ]}>
                          <Text style={themedStyles.statusText}>Pending</Text>
                        </View>
                        {showDeleteButton[form._id] && (
                          <TouchableOpacity
                            style={[
                              themedStyles.deleteButton,
                              deleteMutation.isLoading &&
                                themedStyles.deleteButtonLoading,
                            ]}
                            disabled={deleteMutation.isLoading}
                            onPress={() =>
                              handleDeleteSubmission(
                                form._id,
                                form.formTemplate?.formName || "Form"
                              )
                            }>
                            <Ionicons
                              name={
                                deleteMutation.isLoading ? "hourglass" : "trash"
                              }
                              size={16}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <Text style={themedStyles.formDetails}>
                      Submitted by:{" "}
                      {form.resident?.username || "Unknown Resident"}
                    </Text>
                    <Text style={themedStyles.formDetails}>
                      Date: {formattedDate}
                    </Text>
                    <Text style={themedStyles.formId}>ID: {form._id}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )
        ) : completedForms.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Text style={themedStyles.emptyStateTitle}>No completed forms</Text>
            <Text style={themedStyles.emptyStateSubtitle}>
              Completed forms will appear here
            </Text>
          </View>
        ) : (
          completedForms.map((form) => {
            const dateField = form.fieldRecord.find(
              (field) => field.fieldName === "Date"
            );
            const formattedDate = dateField?.value
              ? new Date(dateField.value).toLocaleDateString()
              : "No date available";

            return (
              <View key={form._id} style={themedStyles.formCardContainer}>
                <TouchableOpacity
                  style={themedStyles.formCard}
                  onPress={() =>
                    navigation.navigate("FormReview", {
                      formName: form.formTemplate?.formName || "Form",
                      formId: form.formTemplate?._id,
                      submissionId: form._id,
                    })
                  }
                  onLongPress={() => toggleDeleteButton(form._id)}>
                  <View style={themedStyles.formCardHeader}>
                    <Text style={themedStyles.formName}>
                      {form.formTemplate?.formName || "Unnamed Form"}
                    </Text>
                    <View style={themedStyles.formCardHeaderRight}>
                      <View
                        style={[
                          themedStyles.statusBadge,
                          themedStyles.completedBadge,
                        ]}>
                        <Text style={themedStyles.statusText}>Completed</Text>
                      </View>
                      {showDeleteButton[form._id] && (
                        <TouchableOpacity
                          style={[
                            themedStyles.deleteButton,
                            deleteMutation.isLoading &&
                              themedStyles.deleteButtonLoading,
                          ]}
                          disabled={deleteMutation.isLoading}
                          onPress={() =>
                            handleDeleteSubmission(
                              form._id,
                              form.formTemplate?.formName || "Form"
                            )
                          }>
                          <Ionicons
                            name={
                              deleteMutation.isLoading ? "hourglass" : "trash"
                            }
                            size={16}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Text style={themedStyles.formDetails}>
                    Submitted by:{" "}
                    {form.resident?.username || "Unknown Resident"}
                  </Text>
                  <Text style={themedStyles.formDetails}>
                    Date: {formattedDate}
                  </Text>
                  <Text style={themedStyles.formId}>ID: {form._id}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      padding: 20,
    },
    tabContainer: {
      flexDirection: "row",
      marginBottom: 20,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 4,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.primary,
    },
    tabText: {
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
      color: theme.textSecondary,
    },
    activeTabText: {
      color: "#fff",
    },
    messageText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 50,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    formCardContainer: {
      marginBottom: 12,
    },
    formCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    formCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    formCardHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    deleteButton: {
      backgroundColor: theme.error,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 32,
      minHeight: 32,
    },
    deleteButtonLoading: {
      opacity: 0.6,
    },
    formName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    pendingBadge: {
      backgroundColor: theme.warning,
    },
    completedBadge: {
      backgroundColor: theme.success,
    },
    statusText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "500",
    },
    formDetails: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    formId: {
      fontSize: 12,
      color: theme.textLight,
      marginTop: 8,
    },
  });
