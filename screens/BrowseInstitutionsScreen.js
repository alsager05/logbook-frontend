import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { institutionsService } from "../api/institutions";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function BrowseInstitutionsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch all institutions
  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allInstitutions"],
    queryFn: institutionsService.getAllInstitutions,
  });

  // Fetch user's institutions
  const { data: userInstitutions = [] } = useQuery({
    queryKey: ["myInstitutions"],
    queryFn: institutionsService.getMyInstitutions,
  });

  // Join institution mutation
  const joinMutation = useMutation({
    mutationFn: institutionsService.joinInstitution,
    onSuccess: (data, institutionId) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["myInstitutions"]);
      queryClient.invalidateQueries(["allInstitutions"]);

      const institution = institutions.find(
        (inst) => inst._id === institutionId
      );
      Alert.alert(
        "Success",
        data.message ||
          `Successfully joined ${institution?.name || "institution"}!`
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to join institution");
    },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Filter institutions based on search query
  const filteredInstitutions = institutions.filter((inst) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      inst.name?.toLowerCase().includes(searchLower) ||
      inst.code?.toLowerCase().includes(searchLower) ||
      inst.description?.toLowerCase().includes(searchLower)
    );
  });

  // Check if user has joined an institution
  const isJoined = (institutionId) => {
    return userInstitutions.some((inst) => inst._id === institutionId);
  };

  const handleJoinInstitution = (institutionId, institutionName) => {
    if (isJoined(institutionId)) {
      Alert.alert(
        "Already Joined",
        "You are already a member of this institution"
      );
      return;
    }

    Alert.alert("Join Institution", `Do you want to join ${institutionName}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Join",
        onPress: () => joinMutation.mutate(institutionId),
      },
    ]);
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
      {/* Search Bar */}
      <View style={themedStyles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={themedStyles.searchIcon}
        />
        <TextInput
          style={themedStyles.searchInput}
          placeholder="Search institutions..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
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
        {filteredInstitutions.length === 0 ? (
          <View style={themedStyles.emptyState}>
            <Ionicons name="business" size={64} color={theme.textSecondary} />
            <Text style={themedStyles.emptyStateTitle}>
              {searchQuery
                ? "No institutions found"
                : "No institutions available"}
            </Text>
            <Text style={themedStyles.emptyStateSubtitle}>
              {searchQuery
                ? "Try a different search term"
                : "Check back later for available institutions"}
            </Text>
          </View>
        ) : (
          filteredInstitutions.map((institution) => {
            const joined = isJoined(institution._id);
            return (
              <View key={institution._id} style={themedStyles.institutionCard}>
                {/* Institution Logo */}
                {institution.logo ? (
                  <Image
                    source={{ uri: institution.logo }}
                    style={themedStyles.logo}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[themedStyles.logo, themedStyles.logoPlaceholder]}>
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
                  {institution.description && (
                    <Text
                      style={themedStyles.institutionDescription}
                      numberOfLines={2}>
                      {institution.description}
                    </Text>
                  )}
                  {institution.contactEmail && (
                    <View style={themedStyles.contactContainer}>
                      <Ionicons
                        name="mail"
                        size={14}
                        color={theme.textSecondary}
                      />
                      <Text style={themedStyles.contactText}>
                        {institution.contactEmail}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Join Button */}
                <View style={themedStyles.actionContainer}>
                  {joined ? (
                    <View style={themedStyles.joinedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#fff"
                      />
                      <Text style={themedStyles.joinedText}>Joined</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        themedStyles.joinButton,
                        joinMutation.isLoading &&
                          themedStyles.joinButtonDisabled,
                      ]}
                      onPress={() =>
                        handleJoinInstitution(institution._id, institution.name)
                      }
                      disabled={joinMutation.isLoading}>
                      {joinMutation.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Ionicons name="add-circle" size={16} color="#fff" />
                          <Text style={themedStyles.joinButtonText}>Join</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
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
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      margin: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
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
    institutionCard: {
      flexDirection: "row",
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
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
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
      marginBottom: 6,
    },
    institutionDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    contactContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    contactText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 6,
    },
    actionContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    joinButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      gap: 6,
    },
    joinButtonDisabled: {
      opacity: 0.6,
    },
    joinButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    joinedBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.success,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    joinedText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });
