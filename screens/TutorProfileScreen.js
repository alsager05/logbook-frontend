import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TutorProfileScreen = () => {
  const insets = useSafeAreaInsets();

  // This would typically come from your user data/state
  const tutorData = {
    name: "Dr. Fatma Al-Hadhoud",
    id: "TUT2024-001",
    email: "f.alhadhoud@hospital.com",
    trainingCenter: "Maternity Hospital",
    position: "Program Director", // One of: faculty chair, program director, assistant program director, site coordinator, clinical tutor
    phone: "123-4567",
    office: "KIMS,, Floor 4, Room 1"
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 70 }]}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/icon.png')} // Replace with actual profile picture
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{tutorData.name}</Text>
          <Text style={styles.position}>{tutorData.position}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Tutor ID</Text>
              <Text style={styles.value}>{tutorData.id}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Training Center</Text>
              <Text style={styles.value}>{tutorData.trainingCenter}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Position</Text>
              <Text style={styles.value}>{tutorData.position}</Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{tutorData.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{tutorData.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="business-outline" size={20} color="#000" />
              <Text style={styles.contactText}>{tutorData.office}</Text>
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
    paddingBottom: 70,
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
  position: {
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
});

export default TutorProfileScreen; 