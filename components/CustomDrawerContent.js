import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { institutionsService } from "../api/institutions";
import { profileService } from "../api/profile";
import { useTheme } from "../contexts/ThemeContext";
import { useInstitution } from "../contexts/InstitutionContext";
import { baseUrl } from "../api/baseUrl";

export default function CustomDrawerContent({ navigation, handleLogout }) {
  const { theme } = useTheme();
  const { selectedInstitution, setSelectedInstitution, changeInstitution } =
    useInstitution();

  // Fetch user's profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  // Fetch user's institutions
  const {
    data: institutions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myInstitutions"],
    queryFn: institutionsService.getMyInstitutions,
  });

  // Auto-select first institution if none is selected
  React.useEffect(() => {
    if (institutions.length > 0 && !selectedInstitution) {
      setSelectedInstitution(institutions[0]);
    }
  }, [institutions, selectedInstitution, setSelectedInstitution]);

  const handleInstitutionPress = (institution) => {
    // Use changeInstitution to trigger loading state
    changeInstitution(institution);

    // Navigate to Dashboard tab when switching institutions
    navigation.navigate("Institution", {
      screen: "Dashboard",
    });

    // Close drawer
    navigation.closeDrawer();
  };

  const themedStyles = createThemedStyles(theme);

  return (
    <View style={themedStyles.container}>
      {/* User Profile Header */}
      <TouchableOpacity
        style={themedStyles.header}
        onPress={() => navigation.navigate("Profile")}>
        {profile?.image ? (
          <Image
            source={{ uri: baseUrl + profile.image }}
            style={themedStyles.avatar}
          />
        ) : (
          <View style={themedStyles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
        )}
        <View style={themedStyles.userInfo}>
          <Text style={themedStyles.userName}>
            {profile?.name || profile?.username || "Loading..."}
          </Text>
          <Text style={themedStyles.userEmail}>
            {profile?.email || "Tap to view profile"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Institutions Section */}
      <View style={themedStyles.section}>
        <View style={themedStyles.sectionHeader}>
          <Text style={themedStyles.sectionTitle}>INSTITUTIONS</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BrowseInstitutions")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={themedStyles.institutionsList}>
          {isLoading ? (
            <View style={themedStyles.centerContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : error ? (
            <Text style={themedStyles.errorText}>
              Error loading institutions
            </Text>
          ) : institutions.length === 0 ? (
            <TouchableOpacity
              style={themedStyles.emptyState}
              onPress={() => navigation.navigate("BrowseInstitutions")}>
              <Ionicons
                name="business-outline"
                size={32}
                color={theme.textSecondary}
              />
              <Text style={themedStyles.emptyText}>No institutions yet</Text>
              <Text style={themedStyles.emptySubtext}>Tap to browse</Text>
            </TouchableOpacity>
          ) : (
            institutions.map((institution) => (
              <TouchableOpacity
                key={institution._id}
                style={[
                  themedStyles.institutionItem,
                  selectedInstitution?._id === institution._id &&
                    themedStyles.institutionItemActive,
                ]}
                onPress={() => handleInstitutionPress(institution)}>
                {institution.logo ? (
                  <Image
                    source={{ uri: baseUrl + institution.logo }}
                    style={themedStyles.institutionLogo}
                  />
                ) : (
                  <View
                    style={[
                      themedStyles.institutionLogo,
                      themedStyles.institutionLogoPlaceholder,
                    ]}>
                    <Text style={themedStyles.institutionLogoText}>
                      {institution.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={themedStyles.institutionInfo}>
                  <Text
                    style={themedStyles.institutionName}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {institution.name}
                  </Text>
                  {/* Display level and role badges */}
                  <View style={themedStyles.badgesContainer}>
                    {institution.userRole && (
                      <View
                        style={[
                          themedStyles.roleBadge,
                          {
                            backgroundColor:
                              institution.userRole.toLowerCase() === "admin"
                                ? "#EF444420"
                                : institution.userRole.toLowerCase() === "tutor"
                                ? "#3B82F620"
                                : "#10B98120",
                          },
                        ]}>
                        <Text
                          style={[
                            themedStyles.roleBadgeText,
                            {
                              color:
                                institution.userRole.toLowerCase() === "admin"
                                  ? "#EF4444"
                                  : institution.userRole.toLowerCase() ===
                                    "tutor"
                                  ? "#3B82F6"
                                  : "#10B981",
                            },
                          ]}>
                          {institution.userRole}
                        </Text>
                      </View>
                    )}
                    {institution.userLevel && (
                      <View style={themedStyles.levelBadge}>
                        <Ionicons
                          name="school-outline"
                          size={12}
                          color={theme.primary}
                        />
                        <Text style={themedStyles.levelBadgeText}>
                          {institution.userLevel}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Navigation Section */}
      <View style={themedStyles.navigationSection}>
        <TouchableOpacity
          style={themedStyles.navItem}
          onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={22} color={theme.text} />
          <Text style={themedStyles.navItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.navItem}
          onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={22} color={theme.text} />
          <Text style={themedStyles.navItemText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={themedStyles.footer}>
        <TouchableOpacity
          style={themedStyles.logoutButton}
          onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.error} />
          <Text style={themedStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: theme.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      gap: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#FFFFFF20",
    },
    avatarPlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#FFFFFF20",
      justifyContent: "center",
      alignItems: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 13,
      color: "#FFFFFFCC",
    },
    section: {
      flex: 1,
      paddingTop: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.textSecondary,
      letterSpacing: 0.5,
    },
    institutionsList: {
      flex: 1,
      paddingHorizontal: 8,
    },
    centerContainer: {
      padding: 20,
      alignItems: "center",
    },
    errorText: {
      color: theme.error,
      fontSize: 14,
      textAlign: "center",
      padding: 20,
    },
    emptyState: {
      alignItems: "center",
      padding: 20,
      marginTop: 20,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginTop: 8,
    },
    emptySubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    institutionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginVertical: 2,
      borderRadius: 8,
      backgroundColor: "transparent",
    },
    institutionItemActive: {
      backgroundColor: theme.surfaceVariant,
    },
    institutionLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    institutionLogoPlaceholder: {
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    institutionLogoText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    institutionInfo: {
      flex: 1,
      justifyContent: "center",
    },
    institutionName: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },
    badgesContainer: {
      flexDirection: "row",
      gap: 6,
      flexWrap: "wrap",
    },
    levelBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primaryContainer || theme.surfaceVariant,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      gap: 4,
    },
    levelBadgeText: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.primary,
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    roleBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    navigationSection: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingVertical: 8,
    },
    navItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 12,
    },
    navItemText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      padding: 16,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 12,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.error,
    },
  });
