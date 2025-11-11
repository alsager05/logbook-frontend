import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionsService } from "../api/formSubmissions";
import { authService } from "../api/auth";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useInstitution } from "../contexts/InstitutionContext";
import { institutionsService } from "../api/institutions";
import { DashboardSkeleton } from "../loading-skeletons";

const { width } = Dimensions.get("window");

export default function DashboardScreen({ navigation, role }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

  // Use institution-specific role (role prop is set from selectedInstitution.userRole)
  const userRole = role || selectedInstitution?.userRole || "Unknown";
  // Get user info
  const {
    data: userInfo,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: authService.getUser,
    // enabled: !!selectedInstitution?._id,
  });

  // Get submissions data
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useQuery({
    queryKey: ["dashboardSubmissions", selectedInstitution?._id],
    queryFn: () =>
      institutionsService.getInstitutionSubmissions(selectedInstitution?._id),
    enabled: !!selectedInstitution?._id,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchUser(), refetchSubmissions()]);
    setRefreshing(false);
  }, [refetchUser, refetchSubmissions]);

  // Calculate stats
  const forms = Array.isArray(submissionsData) ? submissionsData : [];
  const stats = {
    totalSubmissions: forms.length,
    pendingForms: forms.filter((form) => form.status === "pending").length,
    completedForms: forms.filter((form) => form.status === "completed").length,
    thisWeekSubmissions: forms.filter((form) => {
      const submissionDate = new Date(form.createdAt || form.submissionDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return submissionDate >= weekAgo;
    }).length,
  };

  const user = userInfo || {};

  const userName = user.username || "User";
  const userLevel = user.level || user.year || "N/A";
  const userSupervisor = user.supervisor || "N/A";

  const themedStyles = createThemedStyles(theme);

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={[themedStyles.statCard, { borderLeftColor: color }]}
      onPress={onPress}>
      <View style={themedStyles.statCardContent}>
        <View style={themedStyles.statCardLeft}>
          <Text style={themedStyles.statValue}>{value}</Text>
          <Text style={themedStyles.statTitle}>{title}</Text>
        </View>
        <View
          style={[themedStyles.statIcon, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={themedStyles.actionCard} onPress={onPress}>
      <View
        style={[themedStyles.actionIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={themedStyles.actionTitle}>{title}</Text>
      <Text style={themedStyles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  // Show skeleton while initial loading (not refreshing)
  if ((userLoading || submissionsLoading) && !refreshing) {
    return <DashboardSkeleton />;
  }

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
      {/* Welcome Section */}
      <View style={themedStyles.welcomeSection}>
        <View style={themedStyles.welcomeContent}>
          <Text style={themedStyles.welcomeText}>Welcome back,</Text>
          <Text style={themedStyles.userName}>{userName}</Text>
          <View style={themedStyles.userInfo}>
            <View style={themedStyles.userInfoItem}>
              <Ionicons
                name="person-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={themedStyles.userInfoText}>{userRole}</Text>
            </View>
            {userLevel !== "N/A" && (
              <View style={themedStyles.userInfoItem}>
                <Ionicons
                  name="school-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={themedStyles.userInfoText}>Level {userLevel}</Text>
              </View>
            )}
          </View>
          {userSupervisor !== "N/A" && (
            <View style={[themedStyles.userInfoItem, { marginTop: 10 }]}>
              <Ionicons
                name="person-outline"
                size={16}
                color={theme.textSecondary}
              />
              <Text style={themedStyles.userInfoText}>
                Supervisor: {userSupervisor}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Section */}
      <View style={themedStyles.statsSection}>
        <Text style={themedStyles.sectionTitle}>Overview</Text>
        <View style={themedStyles.statsGrid}>
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon="document-text-outline"
            color="#4F46E5"
            onPress={() =>
              navigation.navigate(
                userRole.toUpperCase() === "RESIDENT"
                  ? "MySubmissions"
                  : "Forms"
              )
            }
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingForms}
            icon="time-outline"
            color="#F59E0B"
            onPress={() =>
              navigation.navigate(
                userRole.toUpperCase() === "RESIDENT"
                  ? "MySubmissions"
                  : "Forms"
              )
            }
          />
          <StatCard
            title="Completed"
            value={stats.completedForms}
            icon="checkmark-circle-outline"
            color="#10B981"
            onPress={() =>
              navigation.navigate(
                userRole.toUpperCase() === "RESIDENT"
                  ? "MySubmissions"
                  : "Forms"
              )
            }
          />
          <StatCard
            title="This Week"
            value={stats.thisWeekSubmissions}
            icon="calendar-outline"
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={themedStyles.actionsSection}>
        <Text style={themedStyles.sectionTitle}>Quick Actions</Text>
        <View style={themedStyles.actionsGrid}>
          {userRole.toUpperCase() === "RESIDENT" ? (
            <>
              <QuickActionCard
                title="New Form"
                subtitle="Submit a form"
                icon="add-circle-outline"
                color="#4F46E5"
                onPress={() => navigation.navigate("Forms")}
              />
              <QuickActionCard
                title="My Submissions"
                subtitle="View your forms"
                icon="folder-outline"
                color="#10B981"
                onPress={() => navigation.navigate("MySubmissions")}
              />
            </>
          ) : (
            <>
              <QuickActionCard
                title="Review Forms"
                subtitle="Pending reviews"
                icon="eye-outline"
                color="#4F46E5"
                onPress={() => navigation.navigate("Forms")}
              />
              <QuickActionCard
                title="My Residents"
                subtitle="View residents"
                icon="people-outline"
                color="#10B981"
                onPress={() => navigation.navigate("Residents")}
              />
            </>
          )}
          <QuickActionCard
            title="Announcements"
            subtitle="Latest updates"
            icon="megaphone-outline"
            color="#F59E0B"
            onPress={() => navigation.navigate("Announcements")}
          />
          <QuickActionCard
            title="Profile"
            subtitle="Account & settings"
            icon="person-outline"
            color="#6B7280"
            onPress={() => navigation.getParent()?.navigate("Profile")}
          />
        </View>
      </View>

      {/* Recent Activity */}
      {forms.length > 0 && (
        <View style={themedStyles.recentSection}>
          <View style={themedStyles.sectionHeader}>
            <Text style={themedStyles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  userRole.toUpperCase() === "RESIDENT"
                    ? "MySubmissions"
                    : "Forms"
                )
              }>
              <Text style={themedStyles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {forms.slice(0, 3).map((form) => {
            const dateField = form.fieldRecord?.find(
              (field) => field.fieldName === "Date"
            );
            const formattedDate = dateField?.value
              ? new Date(dateField.value).toLocaleDateString()
              : new Date(
                  form.createdAt || form.submissionDate
                ).toLocaleDateString();

            return (
              <TouchableOpacity
                key={form._id}
                style={themedStyles.recentItem}
                onPress={() => {
                  // Navigate to the appropriate tab first, then to FormReview
                  if (userRole.toUpperCase() === "RESIDENT") {
                    navigation.navigate("MySubmissions", {
                      screen: "FormReview",
                      params: {
                        formName: form.formTemplate?.formName || "Form",
                        formId: form.formTemplate?._id,
                        submissionId: form._id,
                      },
                    });
                  } else {
                    navigation.navigate("Forms", {
                      screen: "FormReview",
                      params: {
                        formName: form.formTemplate?.formName || "Form",
                        formId: form.formTemplate?._id,
                        submissionId: form._id,
                      },
                    });
                  }
                }}>
                <View style={themedStyles.recentItemContent}>
                  <View style={themedStyles.recentItemLeft}>
                    <Text style={themedStyles.recentItemTitle}>
                      {form.formTemplate?.formName || "Unnamed Form"}
                    </Text>
                    <Text style={themedStyles.recentItemSubtitle}>
                      {userRole.toUpperCase() === "TUTOR"
                        ? `By: ${form.resident?.username || "Unknown"}`
                        : formattedDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      themedStyles.statusBadge,
                      {
                        backgroundColor:
                          form.status === "completed"
                            ? theme.success
                            : theme.warning,
                      },
                    ]}>
                    <Text style={themedStyles.statusText}>
                      {form.status === "completed" ? "Completed" : "Pending"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    welcomeSection: {
      backgroundColor: theme.surface,
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    welcomeContent: {
      paddingTop: 10,
    },
    welcomeText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: "row",
      gap: 16,
    },
    userInfoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    userInfoText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    statsSection: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    statsGrid: {
      gap: 12,
    },
    statCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderColor: theme.cardBorder,
      borderWidth: 1,
    },
    statCardContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statCardLeft: {
      flex: 1,
    },
    statValue: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    actionsSection: {
      padding: 20,
      paddingTop: 0,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      width: (width - 52) / 2,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderColor: theme.cardBorder,
      borderWidth: 1,
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      textAlign: "center",
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
    },
    recentSection: {
      padding: 20,
      paddingTop: 0,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    viewAllText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "500",
    },
    recentItem: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      borderColor: theme.cardBorder,
      borderWidth: 1,
    },
    recentItemContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recentItemLeft: {
      flex: 1,
    },
    recentItemTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },
    recentItemSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "500",
    },
  });
