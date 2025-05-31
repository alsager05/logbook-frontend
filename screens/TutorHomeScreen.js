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

export default function TutorHomeScreen({ navigation }) {
  // Add the missing state
  const [selectedTab, setSelectedTab] = React.useState("pending");

  // Get tutor's pending forms
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tutorPendingForms"],
    queryFn: formSubmissionsService.getResidentSubmissions,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
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
  // Ensure data is an array

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
      <View style={styles.iconsContainer}>
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

        {selectedTab === "pending" ? (
          pendingForms.length === 0 ? (
            <Text style={styles.messageText}>No pending forms</Text>
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
                  <Text style={styles.formName}>
                    {form.formTemplate?.formName || "Unnamed Form"}
                  </Text>
                  <Text style={styles.formDetails}>
                    Submitted by:{" "}
                    {form.resident?.username || "Unknown Resident"}
                  </Text>

                  <Text style={styles.formDetails}>Date: {formattedDate}</Text>
                  <Text style={styles.formDetails}>{form.status}</Text>
                </TouchableOpacity>
              );
            })
          )
        ) : completedForms.length === 0 ? (
          <Text style={styles.messageText}>No completed forms</Text>
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
                <Text style={styles.formName}>
                  {form.formTemplate?.formName || "Unnamed Form"}
                </Text>
                <Text style={styles.formDetails}>
                  Submitted by: {form.resident?.username || "Unknown Resident"}
                </Text>

                <Text style={styles.formDetails}>Date: {formattedDate}</Text>
                <Text style={styles.formDetails}>{form.status}</Text>
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
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  iconsContainer: {
    gap: 15,
  },
  messageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  formDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTab: {
    // backgroundColor: '#4F46E5',
    backgroundColor: "#000",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
});
