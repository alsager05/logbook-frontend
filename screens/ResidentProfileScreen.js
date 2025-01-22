import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../api/users';

const ResidentProfileScreen = () => {
  const insets = useSafeAreaInsets();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['residentProfile'],
    queryFn: userService.getUserProfile,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading profile: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 70 }]}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={profile?.imageUrl ? { uri: profile.imageUrl } : require('../assets/icon.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.level}>{profile?.level} Resident</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Resident ID</Text>
              <Text style={styles.value}>{profile?.residentId}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Training Level</Text>
              <Text style={styles.value}>{profile?.level}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.value}>{profile?.startDate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Expected Completion</Text>
              <Text style={styles.value}>{profile?.expectedCompletion}</Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{profile?.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{profile?.phone}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 70, // Add padding for the tab bar
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  level: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 10,
  },
  infoContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  contactSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ResidentProfileScreen; 