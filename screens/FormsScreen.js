import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { formSubmissionsService } from "../api/formSubmissions";
import { authService } from "../api/auth";

export default function FormsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = React.useState("pending");

  // Get forms data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["formsSubmissions"],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading forms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>
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
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4F46E5"]}
          tintColor="#4F46E5"
        />
      }>
      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "pending" && styles.activeTab]}
            onPress={() => setSelectedTab("pending")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "pending" && styles.activeTabText,
              ]}>
              Pending ({pendingForms.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "completed" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("completed")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "completed" && styles.activeTabText,
              ]}>
              Completed ({completedForms.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms List */}
        {selectedTab === "pending" ? (
          pendingForms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No pending forms</Text>
              <Text style={styles.emptyStateSubtitle}>
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
                <TouchableOpacity
                  key={form._id}
                  style={styles.formCard}
                  onPress={() =>
                    navigation.navigate("FormReview", {
                      formName: form.formTemplate?.formName || "Form",
                      formId: form.formTemplate?._id,
                      submissionId: form._id,
                    })
                  }>
                  <View style={styles.formCardHeader}>
                    <Text style={styles.formName}>
                      {form.formTemplate?.formName || "Unnamed Form"}
                    </Text>
                    <View style={[styles.statusBadge, styles.pendingBadge]}>
                      <Text style={styles.statusText}>Pending</Text>
                    </View>
                  </View>
                  <Text style={styles.formDetails}>
                    Submitted by:{" "}
                    {form.resident?.username || "Unknown Resident"}
                  </Text>
                  <Text style={styles.formDetails}>Date: {formattedDate}</Text>
                  <Text style={styles.formId}>ID: {form._id}</Text>
                </TouchableOpacity>
              );
            })
          )
        ) : completedForms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No completed forms</Text>
            <Text style={styles.emptyStateSubtitle}>
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
              <TouchableOpacity
                key={form._id}
                style={styles.formCard}
                onPress={() =>
                  navigation.navigate("FormReview", {
                    formName: form.formTemplate?.formName || "Form",
                    formId: form.formTemplate?._id,
                    submissionId: form._id,
                  })
                }>
                <View style={styles.formCardHeader}>
                  <Text style={styles.formName}>
                    {form.formTemplate?.formName || "Unnamed Form"}
                  </Text>
                  <View style={[styles.statusBadge, styles.completedBadge]}>
                    <Text style={styles.statusText}>Completed</Text>
                  </View>
                </View>
                <Text style={styles.formDetails}>
                  Submitted by: {form.resident?.username || "Unknown Resident"}
                </Text>
                <Text style={styles.formDetails}>Date: {formattedDate}</Text>
                <Text style={styles.formId}>ID: {form._id}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#4F46E5",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#fff",
  },
  messageText: {
    fontSize: 16,
    color: "#64748b",
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
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  formCard: {
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
  formCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  formName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: "#F59E0B",
  },
  completedBadge: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  formDetails: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  formId: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
  },
});
