import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const themedStyles = createThemedStyles(theme);

  // Helper function to navigate to Profile stack screens
  const navigateToProfile = (screen) => {
    navigation.getParent()?.navigate("Profile", { screen });
  };

  const settingsOptions = [
    {
      section: "Account",
      items: [
        {
          icon: "person-outline",
          title: "Edit Profile",
          onPress: () => navigateToProfile("EditProfile"),
        },
        {
          icon: "lock-closed-outline",
          title: "Change Password",
          onPress: () => {
            Alert.alert(
              "Change Password",
              "This feature will be available soon."
            );
          },
        },
        {
          icon: "trash-outline",
          title: "Delete Account",
          color: theme.error,
          onPress: () => navigateToProfile("DeleteAccount"),
        },
      ],
    },
    {
      section: "Preferences",
      items: [
        {
          icon: isDark ? "moon" : "sunny",
          title: "Dark Mode",
          component: (
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDark ? "#FFFFFF" : "#f4f3f4"}
            />
          ),
        },
      ],
    },
    {
      section: "Information",
      items: [
        {
          icon: "information-circle-outline",
          title: "About Us",
          onPress: () => navigateToProfile("AboutUs"),
        },
        {
          icon: "shield-checkmark-outline",
          title: "Privacy Policy",
          onPress: () => navigateToProfile("PrivacyPolicy"),
        },
      ],
    },
  ];

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerTitle}>Settings</Text>
        <Text style={themedStyles.headerSubtitle}>
          Manage your account and preferences
        </Text>
      </View>

      {settingsOptions.map((section, sectionIndex) => (
        <View key={sectionIndex} style={themedStyles.section}>
          <Text style={themedStyles.sectionTitle}>{section.section}</Text>
          <View style={themedStyles.card}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={themedStyles.settingItem}
                  onPress={item.onPress}
                  disabled={!item.onPress}>
                  <View style={themedStyles.settingLeft}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.color || theme.text}
                    />
                    <Text
                      style={[
                        themedStyles.settingTitle,
                        item.color && { color: item.color },
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                  {item.component ? (
                    item.component
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.textSecondary}
                    />
                  )}
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <View style={themedStyles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={themedStyles.footer}>
        <Text style={themedStyles.footerText}>Version 1.0.0</Text>
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
    header: {
      padding: 20,
      paddingTop: 10,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 52,
    },
    footer: {
      padding: 20,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 40,
    },
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
