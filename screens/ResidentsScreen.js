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
import { ResidentListSkeleton } from "../loading-skeletons";

export default function ResidentsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

  // Fetch my residents for the selected institution
  const {
    data: residentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myResidents", selectedInstitution?._id],
    queryFn: () => institutionsService.getMyResidents(selectedInstitution?._id),
    enabled: !!selectedInstitution?._id,
  });

  const residents = residentsData?.residents || [];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleResidentPress = (resident) => {
    navigation.navigate("ResidentDetails", {
      residentId: resident._id,
      residentName: resident.username,
      institutionId: selectedInstitution?._id,
    });
  };

  const themedStyles = createThemedStyles(theme);

  if (!selectedInstitution) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons
          name="business-outline"
          size={64}
          color={theme.textSecondary}
        />
        <Text style={themedStyles.messageText}>
          Please select an institution from the menu
        </Text>
      </View>
    );
  }

  if (isLoading && !refreshing) {
    return <ResidentListSkeleton />;
  }

  if (error) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.error} />
        <Text style={themedStyles.errorText}>Error loading residents</Text>
        <Text style={themedStyles.messageText}>{error.message}</Text>
        <TouchableOpacity style={themedStyles.retryButton} onPress={refetch}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
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
        {residents.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Ionicons
              name="people-outline"
              size={80}
              color={theme.textSecondary}
            />
            <Text style={themedStyles.emptyStateTitle}>No Residents Yet</Text>
            <Text style={themedStyles.emptyStateSubtitle}>
              Residents will appear here once they join this institution
            </Text>
          </View>
        ) : (
          residents.map((resident) => (
            <TouchableOpacity
              key={resident._id}
              style={themedStyles.residentCard}
              onPress={() => handleResidentPress(resident)}>
              {/* Resident Avatar */}
              {resident.image ? (
                <Image
                  source={{ uri: resident.image }}
                  style={themedStyles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[themedStyles.avatar, themedStyles.avatarPlaceholder]}>
                  <Ionicons
                    name="person"
                    size={32}
                    color={theme.textSecondary}
                  />
                </View>
              )}

              {/* Resident Details */}
              <View style={themedStyles.residentContent}>
                <Text style={themedStyles.residentName}>
                  {resident.username}
                </Text>
                {resident.email && (
                  <Text style={themedStyles.residentEmail}>
                    {resident.email}
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
                      {resident.stats?.totalSubmissions || 0} Submissions
                    </Text>
                  </View>
                  <View style={themedStyles.statItem}>
                    <Ionicons name="time" size={16} color={theme.warning} />
                    <Text style={themedStyles.statText}>
                      {resident.stats?.pendingSubmissions || 0} Pending
                    </Text>
                  </View>
                  {resident.lastSubmission && (
                    <View style={themedStyles.statItem}>
                      <Ionicons
                        name="time"
                        size={16}
                        color={theme.textSecondary}
                      />
                      <Text style={themedStyles.statText}>
                        {new Date(resident.lastSubmission).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
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
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginRight: 16,
    },
    avatarPlaceholder: {
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    residentContent: {
      flex: 1,
    },
    residentName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    residentEmail: {
      fontSize: 14,
      color: theme.textSecondary,
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
