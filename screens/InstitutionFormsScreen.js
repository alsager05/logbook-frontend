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
import { useInstitution } from "../contexts/InstitutionContext";
import { Ionicons } from "@expo/vector-icons";
import { FormListSkeleton } from "../loading-skeletons";

export default function InstitutionFormsScreen({ navigation, route }) {
  const { institutionId, institutionName, institutionLogo } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

  // Get user's level for this institution
  const userLevel = selectedInstitution?.userLevel || "";

  // Fetch institution forms
  const {
    data: forms = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["institutionForms", institutionId],
    queryFn: () => institutionsService.getInstitutionForms(institutionId),
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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

  const themedStyles = createThemedStyles(theme);

  if (isLoading && !refreshing) {
    return <FormListSkeleton />;
  }

  if (error) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.error} />
        <Text style={themedStyles.errorText}>Error loading forms</Text>
        <Text style={themedStyles.messageText}>{error.message}</Text>
        <TouchableOpacity style={themedStyles.retryButton} onPress={refetch}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
      {/* Level Info Header */}
      {userLevel && (
        <View style={themedStyles.levelHeader}>
          <View style={themedStyles.levelInfoContainer}>
            <Ionicons name="school" size={20} color={theme.primary} />
            <View style={themedStyles.levelTextContainer}>
              <Text style={themedStyles.levelTitle}>
                Your Level: {userLevel}
              </Text>
              <Text style={themedStyles.levelSubtitle}>
                Showing forms for {userLevel} and below
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Forms List */}
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
        {forms.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={80}
              color={theme.textSecondary}
            />
            <Text style={themedStyles.emptyStateTitle}>No Forms Available</Text>
            <Text style={themedStyles.emptyStateSubtitle}>
              There are no forms available for this institution yet
            </Text>
          </View>
        ) : (
          forms.map((form) => (
            <TouchableOpacity
              key={form._id}
              style={themedStyles.formCard}
              onPress={() => handleFormPress(form)}>
              {/* Form Icon */}
              <View style={themedStyles.formIcon}>
                <Ionicons
                  name="document-text"
                  size={32}
                  color={theme.primary}
                />
              </View>

              {/* Form Details */}
              <View style={themedStyles.formContent}>
                <Text style={themedStyles.formName}>{form.formName}</Text>
                {form.description && (
                  <Text
                    style={themedStyles.formDescription}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {form.description}
                  </Text>
                )}

                {/* Form Stats */}
                <View style={themedStyles.formStats}>
                  <View style={themedStyles.statItem}>
                    <Ionicons
                      name="list"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={themedStyles.statText}>
                      {form.fieldTemplates?.length || 0} fields
                    </Text>
                  </View>
                </View>
              </View>

              {/* Chevron */}
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    levelHeader: {
      backgroundColor: theme.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    levelInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    levelTextContainer: {
      flex: 1,
    },
    levelTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 2,
    },
    levelSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surfaceVariant,
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
      paddingVertical: 80,
      paddingHorizontal: 20,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 20,
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 24,
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
    formIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    formContent: {
      flex: 1,
    },
    formName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    formDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    formStats: {
      flexDirection: "row",
      gap: 16,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    statText: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: "500",
    },
  });
