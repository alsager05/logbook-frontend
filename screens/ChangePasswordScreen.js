import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen({ userId, onPasswordChanged }) {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resolvedUserId, setResolvedUserId] = useState(userId || null);
  const [loadingUser, setLoadingUser] = useState(!userId);
  const { theme } = useTheme();

  // Resolve userId if not provided
  useEffect(() => {
    const loadUser = async () => {
      if (userId) {
        setResolvedUserId(userId);
        setLoadingUser(false);
        return;
      }
      try {
        setLoadingUser(true);
        const user = await authService.getUser();
        setResolvedUserId(user?.id || user?._id);
      } catch (error) {
        Alert.alert("Error", "Failed to load user info for password change");
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, [userId]);

  const changePasswordMutation = useMutation({
    mutationFn: (data) => authService.changePassword(data),
    onSuccess: () => {
      onPasswordChanged?.();
      Alert.alert("Success", "Password changed successfully", [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to Settings screen
            navigation.navigate("SettingsMain");
          },
        },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to change password");
    },
  });

  const handleSubmit = () => {
    if (!resolvedUserId) {
      Alert.alert("Error", "Unable to identify user");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    changePasswordMutation.mutate({
      userId: resolvedUserId,
      oldPassword,
      newPassword,
    });
  };

  if (loadingUser) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles(theme).loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).title}>Change Password</Text>
      <Text style={styles(theme).subtitle}>
        Please update your password regularly
      </Text>

      <TextInput
        style={styles(theme).input}
        placeholder="Current Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <TextInput
        style={styles(theme).input}
        placeholder="New Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles(theme).input}
        placeholder="Confirm Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[
          styles(theme).button,
          changePasswordMutation.isLoading && styles(theme).buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={changePasswordMutation.isLoading}>
        {changePasswordMutation.isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles(theme).buttonText}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: theme.surfaceVariant,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      color: theme.text,
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surfaceVariant,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.textSecondary,
    },
  });
