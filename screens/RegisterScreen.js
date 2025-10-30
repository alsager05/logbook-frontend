import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { authService } from "../api/auth";

export default function RegisterScreen({ navigation, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    name: "",
    role: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, isDark } = useTheme();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.phone ||
      !formData.name ||
      !formData.role
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = new FormData();
      registrationData.append("username", formData.username);
      registrationData.append("password", formData.password);
      registrationData.append("email", formData.email);
      registrationData.append("phone", formData.phone);
      registrationData.append("name", formData.name);
      registrationData.append("role", formData.role.toUpperCase());

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        registrationData.append("image", {
          uri: image,
          name: filename,
          type,
        });
      }

      const response = await authService.register(registrationData);

      Alert.alert(
        "Success",
        "Registration successful! Please login with your credentials.",
        [
          {
            text: "OK",
            onPress: () => {
              if (onRegisterSuccess) {
                onRegisterSuccess();
              } else if (navigation) {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
          error.message ||
          "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaView style={themedStyles.safeArea} edges={["top"]}>
      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={themedStyles.container}>
          {/* Header */}
          <View style={themedStyles.header}>
            <TouchableOpacity
              style={themedStyles.backButton}
              onPress={() => {
                if (navigation) {
                  navigation.goBack();
                } else if (onRegisterSuccess) {
                  onRegisterSuccess();
                }
              }}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={themedStyles.headerTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Profile Image Picker */}
          <View style={themedStyles.imageSection}>
            <TouchableOpacity
              style={themedStyles.imagePicker}
              onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={themedStyles.profileImage}
                />
              ) : (
                <View style={themedStyles.imagePlaceholder}>
                  <Ionicons
                    name="person-add"
                    size={50}
                    color={theme.textSecondary}
                  />
                  <Text style={themedStyles.imageText}>Add Photo</Text>
                </View>
              )}
              <View style={themedStyles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={themedStyles.imageHint}>Optional</Text>
          </View>

          {/* Form Fields */}
          <View style={themedStyles.formContainer}>
            {/* Name */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Full Name *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.name}
                  onChangeText={(value) => updateField("name", value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Username */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Username *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="at-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.username}
                  onChangeText={(value) => updateField("username", value)}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Email *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Phone Number *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.phone}
                  onChangeText={(value) => updateField("phone", value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Password *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Create a password"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.password}
                  onChangeText={(value) => updateField("password", value)}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Confirm Password *</Text>
              <View style={themedStyles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.textSecondary}
                  style={themedStyles.inputIcon}
                />
                <TextInput
                  style={themedStyles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    updateField("confirmPassword", value)
                  }
                  secureTextEntry
                />
              </View>
            </View>

            {/* Role Selection */}
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>I am a *</Text>
              <View style={themedStyles.roleContainer}>
                <TouchableOpacity
                  style={[
                    themedStyles.roleButton,
                    formData.role === "resident" &&
                      themedStyles.roleButtonActive,
                  ]}
                  onPress={() => updateField("role", "resident")}>
                  <Ionicons
                    name="school-outline"
                    size={24}
                    color={
                      formData.role === "resident"
                        ? "#fff"
                        : theme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      themedStyles.roleButtonText,
                      formData.role === "resident" &&
                        themedStyles.roleButtonTextActive,
                    ]}>
                    Resident
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    themedStyles.roleButton,
                    formData.role === "tutor" && themedStyles.roleButtonActive,
                  ]}
                  onPress={() => updateField("role", "tutor")}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={
                      formData.role === "tutor" ? "#fff" : theme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      themedStyles.roleButtonText,
                      formData.role === "tutor" &&
                        themedStyles.roleButtonTextActive,
                    ]}>
                    Tutor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                themedStyles.registerButton,
                isLoading && themedStyles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <View style={themedStyles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={themedStyles.buttonText}>
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text style={themedStyles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={themedStyles.loginContainer}>
              <Text style={themedStyles.loginText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (navigation) {
                    navigation.goBack();
                  } else if (onRegisterSuccess) {
                    onRegisterSuccess();
                  }
                }}>
                <Text style={themedStyles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    imageSection: {
      alignItems: "center",
      paddingVertical: 30,
    },
    imagePicker: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: "hidden",
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    imagePlaceholder: {
      justifyContent: "center",
      alignItems: "center",
    },
    imageText: {
      marginTop: 8,
      fontSize: 14,
      color: theme.textSecondary,
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.background,
    },
    imageHint: {
      marginTop: 8,
      fontSize: 12,
      color: theme.textSecondary,
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12,
      backgroundColor: theme.input,
      paddingHorizontal: 15,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: theme.text,
    },
    roleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    roleButton: {
      flex: 1,
      height: 80,
      borderRadius: 12,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.border,
    },
    roleButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    roleButtonText: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    roleButtonTextActive: {
      color: "#fff",
    },
    registerButton: {
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 30,
    },
    registerButtonDisabled: {
      backgroundColor: theme.textLight,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    loginText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    loginLink: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
