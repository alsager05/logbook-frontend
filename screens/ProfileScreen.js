import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../api/profile';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: (imageFile) => profileService.uploadAvatar(imageFile),
    onSuccess: () => {
      Alert.alert('Success', 'Profile picture updated successfully');
      queryClient.invalidateQueries(['profile']);
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to update profile picture');
    }
  });

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        uploadAvatarMutation.mutate(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            {profile?.avatar ? (
              <Image 
                source={{ uri: profile.avatar }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: colors.card }]}>
                <Ionicons name="person-outline" size={60} color={colors.icon} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Dr. {profile?.username || 'User'}</Text>
        <Text style={styles.title}>R1 Resident, Gynecology Department</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>R98765</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>R1 - First Year Resident</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Program:</Text>
            <Text style={styles.infoValue}>Gynecology Residency</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{profile?.email || 'Not provided'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{profile?.phone || 'Not provided'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF',
  },
  profileImageContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 25,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoLabel: {
    width: 110,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  infoValue: {
    flex: 1,
    fontSize: 18,
    color: '#666666',
    paddingLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
}); 