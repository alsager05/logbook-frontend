import React, { useState, useEffect } from "react";
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
import { authService } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function InstitutionFormsScreen({ navigation, route }) {
  const { institutionId, institutionName, institutionLogo } = route.params;
  const [activeTab, setActiveTab] = useState("forms");
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { theme } = useTheme();

  // Get user role
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const user = await authService.getUser();
        const role =
          user?.role?.[0]?.toUpperCase() ||
          user?.role?.toUpperCase() ||
          "UNKNOWN";
        setUserRole(role);
      } catch (error) {
        console.error("Error getting user role:", error);
      }
    };
    getUserRole();
  }, []);

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

  // Fetch institution submissions (for residents)
  const {
    data: submissions = [],
    isLoading: isLoadingSubmissions,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = useQuery({
    queryKey: ["institutionSubmissions", institutionId],
    queryFn: () => institutionsService.getInstitutionSubmissions(institutionId),
    enabled: activeTab === "submissions" && userRole === "RESIDENT",
  });

  // Fetch my residents (for tutors)
  const {
    data: residentsData,
    isLoading: isLoadingResidents,
    error: residentsError,
    refetch: refetchResidents,
  } = useQuery({
    queryKey: ["myResidents", institutionId],
    queryFn: () => institutionsService.getMyResidents(institutionId),
    enabled: activeTab === "residents" && userRole === "TUTOR",
  });

  // Extract residents array from response
  const residents = residentsData?.residents || [];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (activeTab === "forms") {
      await refetchForms();
    } else if (activeTab === "submissions") {
      await refetchSubmissions();
    } else if (activeTab === "residents") {
      await refetchResidents();
    }
    setRefreshing(false);
  }, [activeTab, refetchForms, refetchSubmissions, refetchResidents]);

  const handleFormPress = (form) => {
    if (userRole === "TUTOR") {
      // Tutors can only view forms, not submit
      // You can navigate to a read-only view or show a message
      return;
    }

    // Residents can submit
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

  const handleResidentPress = (resident) => {
    navigation.navigate("ResidentDetails", {
      residentId: resident._id,
      residentName: resident.username,
      institutionId: institutionId,
      institutionName: institutionName,
    });
  };

  const themedStyles = createThemedStyles(theme);

  const isLoading =
    activeTab === "forms"
      ? isLoadingForms
      : activeTab === "submissions"
      ? isLoadingSubmissions
      : isLoadingResidents;

  const error =
    activeTab === "forms"
      ? formsError
      : activeTab === "submissions"
      ? submissionsError
      : residentsError;

  if (!userRole) {
    return (
      <View style={themedStyles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

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

        {userRole === "TUTOR" ? (
          <TouchableOpacity
            style={[
              themedStyles.tab,
              activeTab === "residents" && themedStyles.activeTab,
            ]}
            onPress={() => setActiveTab("residents")}>
            <Text
              style={[
                themedStyles.tabText,
                activeTab === "residents" && themedStyles.activeTabText,
              ]}>
              My Residents
            </Text>
          </TouchableOpacity>
        ) : (
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
        )}
      </View>

      {/* Content */}
      {isLoading && !refreshing ? (
        <View style={themedStyles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={themedStyles.messageText}>
            Loading{" "}
            {activeTab === "forms"
              ? "forms"
              : activeTab === "submissions"
              ? "submissions"
              : "residents"}
            ...
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
          {/* Forms Tab */}
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
                  onPress={() => handleFormPress(form)}
                  disabled={userRole === "TUTOR"}>
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
                    {userRole === "TUTOR" && (
                      <View style={themedStyles.viewOnlyBadge}>
                        <Ionicons
                          name="eye-outline"
                          size={12}
                          color={theme.primary}
                        />
                        <Text style={themedStyles.viewOnlyText}>View Only</Text>
                      </View>
                    )}
                  </View>
                  {userRole === "RESIDENT" && (
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={theme.textSecondary}
                    />
                  )}
                </TouchableOpacity>
              ))
            )
          ) : /* My Submissions Tab (Residents) */
          activeTab === "submissions" ? (
            submissions.length === 0 ? (
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
            )
          ) : /* My Residents Tab (Tutors) */
          activeTab === "residents" ? (
            residents.length === 0 ? (
              <View style={themedStyles.emptyState}>
                <Ionicons name="people" size={64} color={theme.textSecondary} />
                <Text style={themedStyles.emptyStateTitle}>No Residents</Text>
                <Text style={themedStyles.emptyStateSubtitle}>
                  You have no residents in this institution yet
                </Text>
              </View>
            ) : (
              residents.map((resident) => (
                <TouchableOpacity
                  key={resident._id}
                  style={themedStyles.residentCard}
                  onPress={() => handleResidentPress(resident)}>
                  <View style={themedStyles.residentAvatar}>
                    {resident.image ? (
                      <Image
                        source={{ uri: resident.image }}
                        style={themedStyles.residentImage}
                      />
                    ) : (
                      <View style={themedStyles.residentImagePlaceholder}>
                        <Ionicons
                          name="person"
                          size={24}
                          color={theme.textSecondary}
                        />
                      </View>
                    )}
                  </View>
                  <View style={themedStyles.residentInfo}>
                    <Text style={themedStyles.residentName}>
                      {resident.username}
                    </Text>
                    {resident.email && (
                      <Text style={themedStyles.residentEmail}>
                        {resident.email}
                      </Text>
                    )}
                    <View style={themedStyles.residentMeta}>
                      {resident.level && (
                        <View style={themedStyles.metaItem}>
                          <Ionicons
                            name="school-outline"
                            size={14}
                            color={theme.textSecondary}
                          />
                          <Text style={themedStyles.metaText}>
                            Level {resident.level}
                          </Text>
                        </View>
                      )}
                      {resident.stats?.totalSubmissions !== undefined && (
                        <View style={themedStyles.metaItem}>
                          <Ionicons
                            name="document-text-outline"
                            size={14}
                            color={theme.textSecondary}
                          />
                          <Text style={themedStyles.metaText}>
                            {resident.stats.totalSubmissions} submissions
                          </Text>
                        </View>
                      )}
                      {resident.stats?.pendingSubmissions !== undefined &&
                        resident.stats.pendingSubmissions > 0 && (
                          <View style={themedStyles.metaItem}>
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={theme.warning}
                            />
                            <Text
                              style={[
                                themedStyles.metaText,
                                { color: theme.warning },
                              ]}>
                              {resident.stats.pendingSubmissions} pending
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
          ) : null}
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
    viewOnlyBadge: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 6,
      alignSelf: "flex-start",
      gap: 4,
    },
    viewOnlyText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: "600",
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
    residentCard: {
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
    residentAvatar: {
      marginRight: 12,
    },
    residentImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    residentImagePlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    residentInfo: {
      flex: 1,
    },
    residentName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    residentEmail: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    residentMeta: {
      flexDirection: "row",
      gap: 12,
    },
  });
