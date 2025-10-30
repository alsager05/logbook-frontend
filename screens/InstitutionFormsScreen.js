import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { institutionsService } from "../api/institutions";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function InstitutionFormsScreen({ navigation, route }) {
  const { institutionId, institutionName, institutionLogo } = route.params;
  const [activeTab, setActiveTab] = useState("forms");
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  // Fetch institution forms
  const {
    data: forms = [],
    isLoading: isLoadingForms,
    error: formsError,
    refetch: refetchForms,
  } = useQuery({
    queryKey: ["institutionForms", institutionId],
    queryFn: () => institutionsService.getInstitutionForms(institutionId),
    enabled: activeTab === "forms",
  });

  // Fetch institution submissions
  const {
    data: submissions = [],
    isLoading: isLoadingSubmissions,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = useQuery({
    queryKey: ["institutionSubmissions", institutionId],
    queryFn: () => institutionsService.getInstitutionSubmissions(institutionId),
    enabled: activeTab === "submissions",
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (activeTab === "forms") {
      await refetchForms();
    } else {
      await refetchSubmissions();
    }
    setRefreshing(false);
  }, [activeTab, refetchForms, refetchSubmissions]);

  const handleFormPress = (form) => {
    navigation.navigate("Form", {
      formId: form._id,
      formName: form.formName,
      institutionId: institutionId,
      institutionName: institutionName,
      formData: {
        ...form,
        fieldTemplates: form.fieldTemplates || [],
      },
    });
  };

  const handleSubmissionPress = (submission) => {
    navigation.navigate("FormReview", {
      formName: submission.formTemplate?.formName || "Form",
      formId: submission.formTemplate?._id,
      submissionId: submission._id,
    });
  };

  const themedStyles = createThemedStyles(theme);

  const isLoading =
    activeTab === "forms" ? isLoadingForms : isLoadingSubmissions;
  const error = activeTab === "forms" ? formsError : submissionsError;

  return (
    <View style={themedStyles.container}>
      {/* Institution Header */}
      <View style={themedStyles.institutionHeader}>
        {institutionLogo ? (
          <Image
            source={{ uri: institutionLogo }}
            style={themedStyles.headerLogo}
            resizeMode="cover"
          />
        ) : (
          <View style={[themedStyles.headerLogo, themedStyles.logoPlaceholder]}>
            <Ionicons name="business" size={24} color={theme.textSecondary} />
          </View>
        )}
        <Text style={themedStyles.institutionName}>{institutionName}</Text>
      </View>

      {/* Tabs */}
      <View style={themedStyles.tabContainer}>
        <TouchableOpacity
          style={[
            themedStyles.tab,
            activeTab === "forms" && themedStyles.activeTab,
          ]}
          onPress={() => setActiveTab("forms")}>
          <Text
            style={[
              themedStyles.tabText,
              activeTab === "forms" && themedStyles.activeTabText,
            ]}>
            Available Forms
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            themedStyles.tab,
            activeTab === "submissions" && themedStyles.activeTab,
          ]}
          onPress={() => setActiveTab("submissions")}>
          <Text
            style={[
              themedStyles.tabText,
              activeTab === "submissions" && themedStyles.activeTabText,
            ]}>
            My Submissions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading && !refreshing ? (
        <View style={themedStyles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={themedStyles.messageText}>
            Loading {activeTab === "forms" ? "forms" : "submissions"}...
          </Text>
        </View>
      ) : error ? (
        <View style={themedStyles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.error} />
          <Text style={themedStyles.errorText}>Error loading {activeTab}</Text>
          <Text style={themedStyles.messageText}>{error.message}</Text>
          <TouchableOpacity
            style={themedStyles.retryButton}
            onPress={onRefresh}>
            <Text style={themedStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={themedStyles.scrollView}
          contentContainerStyle={themedStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }>
          {activeTab === "forms" ? (
            forms.length === 0 ? (
              <View style={themedStyles.emptyState}>
                <Ionicons
                  name="document-text"
                  size={64}
                  color={theme.textSecondary}
                />
                <Text style={themedStyles.emptyStateTitle}>
                  No Forms Available
                </Text>
                <Text style={themedStyles.emptyStateSubtitle}>
                  This institution has no forms yet
                </Text>
              </View>
            ) : (
              forms.map((form) => (
                <TouchableOpacity
                  key={form._id}
                  style={themedStyles.formCard}
                  onPress={() => handleFormPress(form)}>
                  <View style={themedStyles.formCardContent}>
                    <Text style={themedStyles.formName}>{form.formName}</Text>
                    {form.scaleDescription && (
                      <Text style={themedStyles.formDescription}>
                        {form.scaleDescription}
                      </Text>
                    )}
                    <View style={themedStyles.formMeta}>
                      <View style={themedStyles.metaItem}>
                        <Ionicons
                          name="list"
                          size={14}
                          color={theme.textSecondary}
                        />
                        <Text style={themedStyles.metaText}>
                          {form.fieldTemplates?.length || 0} fields
                        </Text>
                      </View>
                      {form.score && (
                        <View style={themedStyles.metaItem}>
                          <Ionicons
                            name="star"
                            size={14}
                            color={theme.textSecondary}
                          />
                          <Text style={themedStyles.metaText}>
                            {form.score}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              ))
            )
          ) : submissions.length === 0 ? (
            <View style={themedStyles.emptyState}>
              <Ionicons
                name="checkmark-done"
                size={64}
                color={theme.textSecondary}
              />
              <Text style={themedStyles.emptyStateTitle}>No Submissions</Text>
              <Text style={themedStyles.emptyStateSubtitle}>
                You haven't submitted any forms yet
              </Text>
            </View>
          ) : (
            submissions.map((submission) => {
              const dateField = submission.fieldRecord?.find(
                (field) => field.fieldName === "Date"
              );
              const formattedDate = dateField?.value
                ? new Date(dateField.value).toLocaleDateString()
                : submission.submissionDate
                ? new Date(submission.submissionDate).toLocaleDateString()
                : "No date";

              return (
                <TouchableOpacity
                  key={submission._id}
                  style={themedStyles.submissionCard}
                  onPress={() => handleSubmissionPress(submission)}>
                  <View style={themedStyles.submissionHeader}>
                    <Text style={themedStyles.submissionFormName}>
                      {submission.formTemplate?.formName || "Unnamed Form"}
                    </Text>
                    <View
                      style={[
                        themedStyles.statusBadge,
                        submission.status === "reviewed" ||
                        submission.status === "completed"
                          ? themedStyles.completedBadge
                          : themedStyles.pendingBadge,
                      ]}>
                      <Text style={themedStyles.statusText}>
                        {submission.status === "reviewed" ||
                        submission.status === "completed"
                          ? "Reviewed"
                          : "Pending"}
                      </Text>
                    </View>
                  </View>
                  <Text style={themedStyles.submissionDate}>
                    Date: {formattedDate}
                  </Text>
                  {submission.tutor && (
                    <Text style={themedStyles.submissionTutor}>
                      Tutor: {submission.tutor.username || "Unknown"}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    institutionHeader: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    headerLogo: {
      width: 48,
      height: 48,
      borderRadius: 8,
      marginRight: 12,
    },
    logoPlaceholder: {
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    institutionName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      flex: 1,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.card,
      padding: 4,
      margin: 16,
      borderRadius: 12,
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
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    messageText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 12,
      textAlign: "center",
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.error,
      marginTop: 12,
      textAlign: "center",
    },
    retryButton: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
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
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    formCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    formCardContent: {
      flex: 1,
    },
    formName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 6,
    },
    formDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    formMeta: {
      flexDirection: "row",
      gap: 16,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    metaText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    submissionCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    submissionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    submissionFormName: {
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
    submissionDate: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    submissionTutor: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
