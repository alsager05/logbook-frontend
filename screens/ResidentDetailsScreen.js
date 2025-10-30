import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { institutionsService } from "../api/institutions";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function ResidentDetailsScreen({ route, navigation }) {
  const { residentId, residentName, institutionId, institutionName } =
    route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const { theme } = useTheme();

  // Fetch resident details with submissions
  const {
    data: residentData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["residentDetails", residentId, institutionId],
    queryFn: () =>
      institutionsService.getResidentDetails(residentId, institutionId),
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleSubmissionPress = (submission) => {
    navigation.navigate("FormReview", {
      formName:
        submission.formtemplate?.formName ||
        submission.formTemplate?.formName ||
        "Form",
      formId: submission.formtemplate?._id || submission.formTemplate?._id,
      submissionId: submission._id,
    });
  };

  const themedStyles = createThemedStyles(theme);

  if (isLoading && !refreshing) {
    return (
      <View style={themedStyles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={themedStyles.loadingText}>
          Loading resident details...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.error} />
        <Text style={themedStyles.errorText}>Error loading details</Text>
        <Text style={themedStyles.messageText}>{error.message}</Text>
        <TouchableOpacity style={themedStyles.retryButton} onPress={refetch}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const resident = residentData?.resident || residentData;
  const submissions = residentData?.submissions || [];
  const stats = residentData?.stats || {
    totalSubmissions: 0,
    reviewedSubmissions: 0,
    pendingSubmissions: 0,
  };

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
      {/* Resident Header */}
      <View style={themedStyles.headerSection}>
        <View style={themedStyles.avatarContainer}>
          {resident?.image ? (
            <Image
              source={{ uri: resident.image }}
              style={themedStyles.avatar}
            />
          ) : (
            <View style={themedStyles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={theme.textSecondary} />
            </View>
          )}
        </View>
        <Text style={themedStyles.residentName}>
          {resident?.username || residentName}
        </Text>
        <View style={themedStyles.roleBadge}>
          <Text style={themedStyles.roleBadgeText}>RESIDENT</Text>
        </View>
      </View>

      {/* Resident Information */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.sectionTitle}>Resident Information</Text>

        {resident?.email && (
          <View style={themedStyles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={themedStyles.infoContent}>
              <Text style={themedStyles.infoLabel}>Email</Text>
              <Text style={themedStyles.infoValue}>{resident.email}</Text>
            </View>
          </View>
        )}

        {resident?.phone && (
          <View style={themedStyles.infoRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={themedStyles.infoContent}>
              <Text style={themedStyles.infoLabel}>Phone</Text>
              <Text style={themedStyles.infoValue}>{resident.phone}</Text>
            </View>
          </View>
        )}

        {resident?.level && (
          <View style={themedStyles.infoRow}>
            <Ionicons
              name="school-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={themedStyles.infoContent}>
              <Text style={themedStyles.infoLabel}>Level</Text>
              <Text style={themedStyles.infoValue}>Level {resident.level}</Text>
            </View>
          </View>
        )}

        <View style={themedStyles.infoRow}>
          <Ionicons
            name="business-outline"
            size={20}
            color={theme.textSecondary}
          />
          <View style={themedStyles.infoContent}>
            <Text style={themedStyles.infoLabel}>Institution</Text>
            <Text style={themedStyles.infoValue}>{institutionName}</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={themedStyles.statsSection}>
        <View style={themedStyles.statCard}>
          <Ionicons name="document-text" size={32} color={theme.primary} />
          <Text style={themedStyles.statValue}>
            {stats.totalSubmissions || 0}
          </Text>
          <Text style={themedStyles.statLabel}>Total Submissions</Text>
        </View>
        <View style={themedStyles.statCard}>
          <Ionicons name="time" size={32} color={theme.warning} />
          <Text style={themedStyles.statValue}>
            {stats.pendingSubmissions || 0}
          </Text>
          <Text style={themedStyles.statLabel}>Pending</Text>
        </View>
        <View style={themedStyles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color={theme.success} />
          <Text style={themedStyles.statValue}>
            {stats.reviewedSubmissions || 0}
          </Text>
          <Text style={themedStyles.statLabel}>Reviewed</Text>
        </View>
      </View>

      {/* Submissions List */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.sectionTitle}>Submissions</Text>

        {submissions.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={theme.textSecondary}
            />
            <Text style={themedStyles.emptyStateTitle}>No Submissions</Text>
            <Text style={themedStyles.emptyStateText}>
              This resident hasn't submitted any forms yet
            </Text>
          </View>
        ) : (
          submissions.map((submission) => {
            const formattedDate = new Date(
              submission.fieldRecord?.find(
                (field) => field.fieldName === "Date"
              )?.value
            ).toLocaleDateString();

            return (
              <TouchableOpacity
                key={submission._id}
                style={themedStyles.submissionCard}
                onPress={() => handleSubmissionPress(submission)}>
                <View style={themedStyles.submissionHeader}>
                  <Text style={themedStyles.submissionTitle}>
                    {submission.formtemplate?.formName ||
                      submission.formTemplate?.formName ||
                      "Unnamed Form"}
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
                <View style={themedStyles.submissionMeta}>
                  <View style={themedStyles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={themedStyles.metaText}>{formattedDate}</Text>
                  </View>
                  {(submission.formtemplate?.score || submission.score) && (
                    <View style={themedStyles.metaItem}>
                      <Ionicons
                        name="star-outline"
                        size={14}
                        color={theme.textSecondary}
                      />
                      <Text style={themedStyles.metaText}>
                        Max Score:{" "}
                        {submission.formtemplate?.score || submission.score}
                      </Text>
                    </View>
                  )}
                  {submission.tutor && (
                    <View style={themedStyles.metaItem}>
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color={theme.textSecondary}
                      />
                      <Text style={themedStyles.metaText}>
                        Tutor: {submission.tutor.username}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
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
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.surfaceVariant,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 12,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.error,
      marginTop: 12,
      textAlign: "center",
    },
    messageText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 8,
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
    headerSection: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 20,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.primary,
    },
    residentName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    roleBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    roleBadgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    section: {
      backgroundColor: theme.card,
      marginTop: 16,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    infoContent: {
      marginLeft: 12,
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
    },
    statsSection: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginTop: 16,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: "center",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginTop: 12,
      marginBottom: 6,
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    submissionCard: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    submissionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    submissionTitle: {
      fontSize: 16,
      fontWeight: "600",
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
      fontSize: 11,
      color: "#fff",
      fontWeight: "600",
    },
    submissionMeta: {
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
  });
