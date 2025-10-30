import React from "react";
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

export default function MyInstitutionsScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const { theme } = useTheme();

  // Fetch user's institutions
  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myInstitutions"],
    queryFn: institutionsService.getMyInstitutions,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleInstitutionPress = (institution) => {
    navigation.navigate("InstitutionForms", {
      institutionId: institution._id,
      institutionName: institution.name,
      institutionLogo: institution.logo,
    });
  };

  const handleBrowseInstitutions = () => {
    navigation.navigate("BrowseInstitutions");
  };

  const themedStyles = createThemedStyles(theme);

  if (isLoading && !refreshing) {
    return (
      <View style={themedStyles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={themedStyles.messageText}>Loading institutions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.error} />
        <Text style={themedStyles.errorText}>Error loading institutions</Text>
        <Text style={themedStyles.messageText}>{error.message}</Text>
        <TouchableOpacity style={themedStyles.retryButton} onPress={refetch}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
      {/* Header with Join More Button */}
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerTitle}>My Institutions</Text>
        <TouchableOpacity
          style={themedStyles.joinMoreButton}
          onPress={handleBrowseInstitutions}>
          <Ionicons name="add-circle" size={20} color={theme.primary} />
          <Text style={themedStyles.joinMoreText}>Join More</Text>
        </TouchableOpacity>
      </View>

      {/* Institutions List */}
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
        {institutions.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Ionicons name="business" size={80} color={theme.textSecondary} />
            <Text style={themedStyles.emptyStateTitle}>
              No Institutions Yet
            </Text>
            <Text style={themedStyles.emptyStateSubtitle}>
              Join an institution to start submitting forms
            </Text>
            <TouchableOpacity
              style={themedStyles.browseButton}
              onPress={handleBrowseInstitutions}>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={themedStyles.browseButtonText}>
                Browse Institutions
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          institutions.map((institution) => (
            <TouchableOpacity
              key={institution._id}
              style={themedStyles.institutionCard}
              onPress={() => handleInstitutionPress(institution)}>
              {/* Institution Logo */}
              {institution.logo ? (
                <Image
                  source={{ uri: institution.logo }}
                  style={themedStyles.logo}
                  resizeMode="cover"
                />
              ) : (
                <View style={[themedStyles.logo, themedStyles.logoPlaceholder]}>
                  <Ionicons
                    name="business"
                    size={32}
                    color={theme.textSecondary}
                  />
                </View>
              )}

              {/* Institution Details */}
              <View style={themedStyles.institutionContent}>
                <Text style={themedStyles.institutionName}>
                  {institution.name}
                </Text>
                {institution.code && (
                  <Text style={themedStyles.institutionCode}>
                    {institution.code}
                  </Text>
                )}

                {/* Stats */}
                <View style={themedStyles.statsContainer}>
                  <View style={themedStyles.statItem}>
                    <Ionicons
                      name="document-text"
                      size={16}
                      color={theme.primary}
                    />
                    <Text style={themedStyles.statText}>
                      {institution.formsCount || 0} Forms
                    </Text>
                  </View>
                  <View style={themedStyles.statItem}>
                    <Ionicons
                      name="checkmark-done"
                      size={16}
                      color={theme.success}
                    />
                    <Text style={themedStyles.statText}>
                      {institution.submissionsCount || 0} Submissions
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
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surfaceVariant,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    joinMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      gap: 6,
    },
    joinMoreText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primary,
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
    browseButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    browseButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    institutionCard: {
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
    logo: {
      width: 64,
      height: 64,
      borderRadius: 10,
      marginRight: 16,
    },
    logoPlaceholder: {
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    institutionContent: {
      flex: 1,
    },
    institutionName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    institutionCode: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primary,
      marginBottom: 10,
    },
    statsContainer: {
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
