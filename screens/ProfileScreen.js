import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../api/profile";
import { authService } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileSkeleton } from "../loading-skeletons";
import { baseUrl } from "../api/baseUrl";

export default function ProfileScreen({ navigation, handleLogout }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const { theme, isDark, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // Load profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: profileService.getProfile,
  });

  // Load notification settings
  React.useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const notificationSetting = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      setIsNotificationsEnabled(notificationSetting === "true");
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await AsyncStorage.setItem("notificationsEnabled", value.toString());
      setIsNotificationsEnabled(value);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const handleSocialLink = (type) => {
    let url;
    switch (type) {
      case "instagram":
        url = "https://www.instagram.com/kraog_q8/";
        break;
      case "website":
        url = "https://kims-pge.org";
        break;
      case "email":
        url = "mailto:info@kbog.org";
        break;
    }
    if (url) Linking.openURL(url);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { profile });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be easily undone. You'll need to contact support within 30 days to restore your account.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => navigation.navigate("DeleteAccount"),
        },
      ]
    );
  };

  const themedStyles = createThemedStyles(theme);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  console.log("profile is this one", baseUrl + profile.image);

  if (error) {
    return (
      <View style={themedStyles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.error} />
        <Text style={themedStyles.errorText}>Error loading profile</Text>
        <Text style={themedStyles.messageText}>{error.message}</Text>
        <TouchableOpacity style={themedStyles.retryButton} onPress={refetch}>
          <Text style={themedStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={themedStyles.container}>
      {/* Profile Header */}
      <View style={themedStyles.profileHeader}>
        <View style={themedStyles.profileImageContainer}>
          {profile?.image ? (
            <Image
              source={{
                uri: profile.image ? baseUrl + profile.image : undefined,
              }}
              style={themedStyles.profileImage}
            />
          ) : (
            <View style={themedStyles.profileImagePlaceholder}>
              <Ionicons name="person" size={64} color={theme.textSecondary} />
            </View>
          )}
        </View>
        <Text style={themedStyles.profileName}>
          {profile?.name || profile?.username}
        </Text>
        <View style={themedStyles.roleBadge}>
          <Text style={themedStyles.roleBadgeText}>
            {profile?.roles?.[0]?.toUpperCase() || "USER"}
          </Text>
        </View>
        <TouchableOpacity
          style={themedStyles.editButton}
          onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={themedStyles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Information */}
      <View style={themedStyles.section}>
        <Text style={themedStyles.sectionTitle}>Profile Information</Text>

        <View style={themedStyles.infoItem}>
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.textSecondary}
          />
          <View style={themedStyles.infoContent}>
            <Text style={themedStyles.infoLabel}>Name</Text>
            <Text style={themedStyles.infoValue}>
              {profile?.name || "Not provided"}
            </Text>
          </View>
        </View>
        <View style={themedStyles.infoItem}>
          <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
          <View style={themedStyles.infoContent}>
            <Text style={themedStyles.infoLabel}>Email</Text>
            <Text style={themedStyles.infoValue}>
              {profile?.email || "Not provided"}
            </Text>
          </View>
        </View>

        <View style={themedStyles.infoItem}>
          <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
          <View style={themedStyles.infoContent}>
            <Text style={themedStyles.infoLabel}>Phone</Text>
            <Text style={themedStyles.infoValue}>
              {profile?.phone || "Not provided"}
            </Text>
          </View>
        </View>

        {profile?.supervisor && (
          <View style={themedStyles.infoItem}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={themedStyles.infoContent}>
              <Text style={themedStyles.infoLabel}>Supervisor</Text>
              <Text style={themedStyles.infoValue}>
                {profile.supervisor.name || profile.supervisor.username}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* My Institutions */}
      {profile?.institutions && profile.institutions.length > 0 && (
        <View style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>My Institutions</Text>
          {profile.institutions.map((institution) => (
            <View key={institution._id} style={themedStyles.institutionItem}>
              {institution.logo ? (
                <Image
                  source={{ uri: institution.logo }}
                  style={themedStyles.institutionLogo}
                />
              ) : (
                <View style={themedStyles.institutionLogoPlaceholder}>
                  <Ionicons
                    name="business"
                    size={20}
                    color={theme.textSecondary}
                  />
                </View>
              )}
              <View style={themedStyles.institutionInfo}>
                <Text style={themedStyles.institutionName}>
                  {institution.name}
                </Text>
                <Text style={themedStyles.institutionCode}>
                  {institution.code}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Settings Section */}
      {/* <View style={themedStyles.section}>
        <Text style={themedStyles.sectionTitle}>Settings</Text>

        <View style={themedStyles.settingItem}>
          <Ionicons name="moon-outline" size={24} color={theme.text} />
          <Text style={themedStyles.settingText}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDark ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={themedStyles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          <Text style={themedStyles.settingText}>Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={themedStyles.settingItem}
          onPress={() => navigation.navigate("AboutUs")}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={theme.text}
          />
          <Text style={themedStyles.settingText}>About Us</Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.settingItem}
          onPress={() => navigation.navigate("PrivacyPolicy")}>
          <Ionicons
            name="shield-checkmark-outline"
            size={24}
            color={theme.text}
          />
          <Text style={themedStyles.settingText}>Privacy Policy</Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View> */}

      {/* Social Section */}
      <View style={themedStyles.socialSection}>
        <Text style={themedStyles.socialTitle}>Follow Us</Text>
        <View style={themedStyles.socialButtons}>
          <TouchableOpacity
            style={themedStyles.socialButton}
            onPress={() => handleSocialLink("instagram")}>
            <Ionicons name="logo-instagram" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={themedStyles.socialButton}
            onPress={() => handleSocialLink("website")}>
            <Ionicons name="globe-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={themedStyles.socialButton}
            onPress={() => handleSocialLink("email")}>
            <Ionicons name="mail-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      {/* <TouchableOpacity
        style={themedStyles.logoutButton}
        onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={themedStyles.logoutText}>Logout</Text>
      </TouchableOpacity> */}

      {/* Danger Zone */}
      <View style={themedStyles.dangerZone}>
        <Text style={themedStyles.dangerZoneTitle}>Danger Zone</Text>
        <TouchableOpacity
          style={themedStyles.deleteButton}
          onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color={theme.error} />
          <Text style={themedStyles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={themedStyles.versionContainer}>
        <Text style={themedStyles.versionText}>Version 1.0.0</Text>
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
      backgroundColor: theme.surfaceVariant,
      padding: 20,
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
    profileHeader: {
      alignItems: "center",
      paddingVertical: 32,
      paddingHorizontal: 20,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    profileImageContainer: {
      marginBottom: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    profileImagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.primary,
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    roleBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 16,
    },
    roleBadgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      gap: 6,
    },
    editButtonText: {
      color: "#fff",
      fontSize: 14,
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
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    infoItem: {
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
    institutionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    institutionLogo: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
    institutionLogoPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    institutionInfo: {
      marginLeft: 12,
      flex: 1,
    },
    institutionName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    institutionCode: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
    },
    socialSection: {
      alignItems: "center",
      marginVertical: 24,
    },
    socialTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.text,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    socialButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      marginHorizontal: 16,
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    dangerZone: {
      marginTop: 24,
      marginHorizontal: 16,
      padding: 16,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.error,
    },
    dangerZoneTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.error,
      marginBottom: 12,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.error,
      backgroundColor: theme.surfaceVariant,
      gap: 8,
    },
    deleteButtonText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: "600",
    },
    versionContainer: {
      alignItems: "center",
      paddingVertical: 24,
    },
    versionText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
  });
