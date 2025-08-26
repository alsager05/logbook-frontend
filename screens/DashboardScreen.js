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

const { width } = Dimensions.get("window");

export default function DashboardScreen({ navigation, role }) {
  const [refreshing, setRefreshing] = React.useState(false);

  // Get user info
  const { data: userInfo, refetch: refetchUser } = useQuery({
    queryKey: ["userInfo"],
    queryFn: authService.getUser,
  });

  // Get submissions data
  const { data: submissionsData, refetch: refetchSubmissions } = useQuery({
    queryKey: ["dashboardSubmissions"],
    queryFn: formSubmissionsService.getResidentSubmissions,
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
  const userRole = role || user.role?.[0] || "Unknown";
  const userSupervisor = user.supervisor || "N/A";

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4F46E5"]}
          tintColor="#4F46E5"
        />
      }>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.userInfo}>
            <View style={styles.userInfoItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.userInfoText}>{userRole}</Text>
            </View>
            {userLevel !== "N/A" && (
              <View style={styles.userInfoItem}>
                <Ionicons name="school-outline" size={16} color="#666" />
                <Text style={styles.userInfoText}>Level {userLevel}</Text>
              </View>
            )}
          </View>
          {userSupervisor !== "N/A" && (
            <View style={[styles.userInfoItem, { marginTop: 10 }]}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.userInfoText}>
                Supervisor: {userSupervisor}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon="document-text-outline"
            color="#4F46E5"
            onPress={() => navigation.navigate("Forms")}
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingForms}
            icon="time-outline"
            color="#F59E0B"
            onPress={() => navigation.navigate("Forms")}
          />
          <StatCard
            title="Completed"
            value={stats.completedForms}
            icon="checkmark-circle-outline"
            color="#10B981"
            onPress={() => navigation.navigate("Forms")}
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
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {userRole.toUpperCase() === "RESIDENT" ? (
            <>
              <QuickActionCard
                title="New Form"
                subtitle="Submit a form"
                icon="add-circle-outline"
                color="#4F46E5"
                onPress={() => navigation.navigate("My Submissions")}
              />
              <QuickActionCard
                title="My Submissions"
                subtitle="View your forms"
                icon="folder-outline"
                color="#10B981"
                onPress={() => navigation.navigate("My Submissions")}
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
                title="All Submissions"
                subtitle="View all forms"
                icon="folder-outline"
                color="#10B981"
                onPress={() => navigation.navigate("Forms")}
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
            title="Settings"
            subtitle="Account settings"
            icon="settings-outline"
            color="#6B7280"
            onPress={() => navigation.navigate("Settings")}
          />
        </View>
      </View>

      {/* Recent Activity */}
      {forms.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Forms")}>
              <Text style={styles.viewAllText}>View All</Text>
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
                style={styles.recentItem}
                onPress={() =>
                  navigation.navigate("FormReview", {
                    formName: form.formTemplate?.formName || "Form",
                    formId: form.formTemplate?._id,
                    submissionId: form._id,
                  })
                }>
                <View style={styles.recentItemContent}>
                  <View style={styles.recentItemLeft}>
                    <Text style={styles.recentItemTitle}>
                      {form.formTemplate?.formName || "Unnamed Form"}
                    </Text>
                    <Text style={styles.recentItemSubtitle}>
                      {userRole.toUpperCase() === "TUTOR"
                        ? `By: ${form.resident?.username || "Unknown"}`
                        : formattedDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          form.status === "completed" ? "#10B981" : "#F59E0B",
                      },
                    ]}>
                    <Text style={styles.statusText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  welcomeSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  welcomeContent: {
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
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
    color: "#64748b",
    fontWeight: "500",
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#1e293b",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: "#64748b",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#64748b",
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
    color: "#4F46E5",
    fontWeight: "500",
  },
  recentItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: "#1e293b",
    marginBottom: 4,
  },
  recentItemSubtitle: {
    fontSize: 14,
    color: "#64748b",
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
