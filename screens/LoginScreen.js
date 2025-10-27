import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

const Colors = {
  primary: "#000000",
  background: "#FFFFFF",
  text: "#000000",
  textLight: "#666666",
  border: "#CCCCCC",
  inactive: "#888888",
};

export default function LoginScreen({ onLogin, isLoggingIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("");
  const { login } = useAuth();
  const { theme, isDark } = useTheme();

  const handleLogin = async () => {
    if (!username || !password || !roles) {
      alert("Please fill in all fields");
      return;
    }

    // Convert role to uppercase to match backend
    const normalizedRole = roles.toUpperCase();

    try {
      await login({ username, password, role: normalizedRole });
      // If login is successful, call the onLogin callback
      onLogin(username, password, normalizedRole);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaView style={themedStyles.safeArea} edges={["top"]}>
      <View style={themedStyles.container}>
        <View style={themedStyles.logoContainer}>
          <Image
            source={
              isDark
                ? require("../assets/images/splash-icon-light.png")
                : require("../assets/images/splash-icon-dark.png")
            }
            style={themedStyles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={themedStyles.formWrapper}>
          <View style={themedStyles.formContainer}>
            <Text style={themedStyles.title}>Login</Text>

            <TextInput
              style={themedStyles.input}
              placeholder="Username"
              placeholderTextColor={theme.inputPlaceholder}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <TextInput
              style={themedStyles.input}
              placeholder="Password"
              placeholderTextColor={theme.inputPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={themedStyles.roleContainer}>
              <TouchableOpacity
                style={[
                  themedStyles.roleButton,
                  roles === "tutor" && themedStyles.roleButtonActive,
                ]}
                onPress={() => setRoles("tutor")}>
                <Text
                  style={[
                    themedStyles.roleButtonText,
                    roles === "tutor" && themedStyles.roleButtonTextActive,
                  ]}>
                  tutor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  themedStyles.roleButton,
                  roles === "RESIDENT" && themedStyles.roleButtonActive,
                ]}
                onPress={() => setRoles("RESIDENT")}>
                <Text
                  style={[
                    themedStyles.roleButtonText,
                    roles === "RESIDENT" && themedStyles.roleButtonTextActive,
                  ]}>
                  Resident
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                themedStyles.loginButton,
                !username || !password || !roles
                  ? themedStyles.loginButtonDisabled
                  : themedStyles.loginButtonEnabled,
                isLoggingIn && themedStyles.loginButtonLoading,
              ]}
              onPress={handleLogin}
              disabled={!username || !password || !roles || isLoggingIn}>
              <View style={themedStyles.loginButtonContent}>
                {isLoggingIn ? (
                  <View style={themedStyles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={themedStyles.loginButtonText}>
                      Logging in...
                    </Text>
                  </View>
                ) : (
                  <Text style={themedStyles.loginButtonText}>Login</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    logoContainer: {
      height: "30%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
    },
    logo: {
      width: "100%",
      height: "75%",
    },
    formWrapper: {
      flex: 1,
      backgroundColor: theme.background,
      borderTopLeftRadius: 70,
    },
    formContainer: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 70,
      paddingHorizontal: 25,
      paddingTop: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
      textAlign: "center",
    },
    label: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 8,
      color: theme.text,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 25,
      paddingHorizontal: 20,
      marginBottom: 20,
      fontSize: 16,
      backgroundColor: theme.input,
      color: theme.text,
    },
    roleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
      marginBottom: 25,
    },
    roleButton: {
      width: "48%",
      height: 45,
      borderRadius: 25,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    roleButtonActive: {
      backgroundColor: theme.primary,
    },
    roleButtonText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
    },
    roleButtonTextActive: {
      color: "#fff",
    },
    loginButton: {
      height: 45,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    loginButtonEnabled: {
      backgroundColor: theme.primary,
    },
    loginButtonDisabled: {
      backgroundColor: theme.textLight,
    },
    loginButtonLoading: {
      backgroundColor: theme.textLight,
    },
    loginButtonContent: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    loginButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
