import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../api/profile";
import { useTheme } from "../contexts/ThemeContext";
import { baseUrl } from "../api/baseUrl";

export default function EditProfileScreen({ route, navigation }) {
  const { profile } = route.params || {};
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(!profile);
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch profile if not provided via route params
  useEffect(() => {
    const fetchProfile = async () => {
      if (profile) {
        setLoadingProfile(false);
        return;
      }
      try {
        setLoadingProfile(true);
        const fetched = await profileService.getProfile();
        setUsername(fetched?.username || "");
        setEmail(fetched?.email || "");
        setPhone(fetched?.phone || "");
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [profile]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries(["userProfile", "profile"]);
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      Alert.alert("Error", message);
    },
  });

  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photos"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    // Validation
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    const updateData = {
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (selectedImage) {
      updateData.image = selectedImage;
    }

    updateMutation.mutate(updateData);
  };

  const themedStyles = createThemedStyles(theme);

  if (loadingProfile) {
    return (
      <View style={themedStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={themedStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={themedStyles.container}>
      {/* Profile Image Section */}
      <View style={themedStyles.imageSection}>
        <View style={themedStyles.imageContainer}>
          {selectedImage || profile?.image ? (
            <Image
              source={{ uri: selectedImage || baseUrl + profile.image }}
              style={themedStyles.profileImage}
            />
          ) : (
            <View style={themedStyles.imagePlaceholder}>
              <Ionicons name="person" size={64} color={theme.textSecondary} />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={themedStyles.changePhotoButton}
          onPress={pickImage}>
          <Ionicons name="camera-outline" size={20} color={theme.primary} />
          <Text style={themedStyles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={themedStyles.formSection}>
        <View style={themedStyles.inputGroup}>
          <Text style={themedStyles.label}>
            Username <Text style={themedStyles.required}>*</Text>
          </Text>
          <View style={themedStyles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={themedStyles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={themedStyles.inputGroup}>
          <Text style={themedStyles.label}>
            Email <Text style={themedStyles.required}>*</Text>
          </Text>
          <View style={themedStyles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={themedStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={themedStyles.inputGroup}>
          <Text style={themedStyles.label}>Phone</Text>
          <View style={themedStyles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.textSecondary}
            />
            <TextInput
              style={themedStyles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={themedStyles.buttonContainer}>
        <TouchableOpacity
          style={[
            themedStyles.saveButton,
            updateMutation.isPending && themedStyles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={themedStyles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={updateMutation.isPending}>
          <Text style={themedStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Note */}
      <View style={themedStyles.noteContainer}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={theme.textSecondary}
        />
        <Text style={themedStyles.noteText}>
          Your role and supervisor cannot be changed. Contact support if you
          need to update these details.
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
    imageSection: {
      alignItems: "center",
      paddingVertical: 32,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    imageContainer: {
      marginBottom: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.primary,
    },
    changePhotoButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    changePhotoText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    formSection: {
      padding: 16,
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
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
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
    noteContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 24,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      gap: 8,
    },
    noteText: {
      flex: 1,
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
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
