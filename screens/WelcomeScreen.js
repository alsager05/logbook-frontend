import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const handleBrowseInstitutions = () => {
    navigation.navigate("BrowseInstitutions");
  };

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.content}>
        <Ionicons name="business-outline" size={100} color={theme.primary} />
        <Text style={themedStyles.title}>Welcome to Logbook</Text>
        <Text style={themedStyles.subtitle}>
          Select an institution from the menu or browse available institutions
          to get started
        </Text>

        <TouchableOpacity
          style={themedStyles.button}
          onPress={handleBrowseInstitutions}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
          <Text style={themedStyles.buttonText}>Browse Institutions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.menuHint}
          onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={theme.primary} />
          <Text style={themedStyles.hintText}>
            Open menu to see your institutions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 24,
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
      paddingHorizontal: 16,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 10,
      marginBottom: 24,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    menuHint: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
    },
    hintText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
