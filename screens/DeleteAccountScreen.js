import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { profileService } from "../api/profile";
import { authService } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";

export default function DeleteAccountScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: async (data) => {
      Alert.alert(
        "Account Deleted",
        data.message ||
          "Your account has been deleted. You can contact support within 30 days to restore it.",
        [
          {
            text: "OK",
            onPress: async () => {
              // Logout and redirect to login
              await authService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]
      );
    },
    onError: (error) => {
      const errorData = error.response?.data;

      if (errorData?.institutions) {
        // User is admin of institutions
        Alert.alert(
          "Cannot Delete Account",
          `${errorData.message}\n\nInstitutions: ${errorData.institutions.join(
            ", "
          )}`
        );
      } else if (error.response?.status === 401) {
        Alert.alert(
          "Incorrect Password",
          "The password you entered is incorrect"
        );
      } else {
        Alert.alert(
          "Error",
          errorData?.message || error.message || "Failed to delete account"
        );
      }
    },
  });

  const handleDeleteRequest = () => {
    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password to confirm");
      return;
    }

    Alert.alert(
      "Are You Absolutely Sure?",
      "This will permanently delete your account. You can contact support within 30 days to restore it.\n\nThis action cannot be easily undone!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete My Account",
          style: "destructive",
          onPress: () => deleteMutation.mutate(password),
        },
      ]
    );
  };

  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      {/* Warning Section */}
      <View style={themedStyles.warningSection}>
        <View style={themedStyles.warningHeader}>
          <Ionicons name="warning" size={48} color={theme.error} />
          <Text style={themedStyles.warningTitle}>Delete Account</Text>
        </View>
        <Text style={themedStyles.warningText}>
          This action will permanently delete your account. Here's what will
          happen:
        </Text>
      </View>

      {/* Consequences List */}
      <View style={themedStyles.consequencesSection}>
        <View style={themedStyles.consequenceItem}>
          <Ionicons name="close-circle" size={24} color={theme.error} />
          <Text style={themedStyles.consequenceText}>
            You will be immediately logged out
          </Text>
        </View>

        <View style={themedStyles.consequenceItem}>
          <Ionicons name="close-circle" size={24} color={theme.error} />
          <Text style={themedStyles.consequenceText}>
            You won't be able to log in again
          </Text>
        </View>

        <View style={themedStyles.consequenceItem}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={themedStyles.consequenceText}>
            Your data will be preserved for 30 days
          </Text>
        </View>

        <View style={themedStyles.consequenceItem}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={themedStyles.consequenceText}>
            Contact support within 30 days to restore your account
          </Text>
        </View>
      </View>

      {/* Important Note */}
      <View style={themedStyles.noteContainer}>
        <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
        <Text style={themedStyles.noteText}>
          If you're an admin of any institution, you must transfer admin rights
          before you can delete your account.
        </Text>
      </View>

      {/* Password Input */}
      <View style={themedStyles.formSection}>
        <Text style={themedStyles.label}>
          Enter Your Password to Confirm{" "}
          <Text style={themedStyles.required}>*</Text>
        </Text>
        <View style={themedStyles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={theme.textSecondary}
          />
          <TextInput
            style={themedStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!deleteMutation.isPending}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Button */}
      <View style={themedStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            themedStyles.deleteButton,
            deleteMutation.isPending && themedStyles.deleteButtonDisabled,
          ]}
          onPress={handleDeleteRequest}
          disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={themedStyles.deleteButtonText}>
                Delete My Account Permanently
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={deleteMutation.isPending}>
          <Text style={themedStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Support Info */}
      <View style={themedStyles.supportContainer}>
        <Ionicons
          name="help-circle-outline"
          size={20}
          color={theme.textSecondary}
        />
        <Text style={themedStyles.supportText}>
          Need help? Contact support at info@kbog.org
        </Text>
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
    warningSection: {
      padding: 24,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
      alignItems: "center",
    },
    warningHeader: {
      alignItems: "center",
      marginBottom: 16,
    },
    warningTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.error,
      marginTop: 12,
    },
    warningText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    consequencesSection: {
      padding: 16,
      gap: 16,
    },
    consequenceItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 12,
    },
    consequenceText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    noteContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 24,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.primary,
      gap: 12,
    },
    noteText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      lineHeight: 20,
      fontWeight: "500",
    },
    formSection: {
      padding: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    required: {
      color: theme.error,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
    },
    buttonContainer: {
      padding: 16,
      gap: 12,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.error,
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    deleteButtonDisabled: {
      opacity: 0.6,
    },
    deleteButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    cancelButton: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      backgroundColor: theme.card,
      alignItems: "center",
    },
    cancelButtonText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    supportContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      marginBottom: 24,
      gap: 8,
    },
    supportText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
  });
