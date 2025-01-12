import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const socialLinks = [
    {
      id: 1,
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E1306C',
      url: 'https://www.instagram.com/kbog_kw/',
    },
    {
      id: 2,
      name: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      url: 'https://wa.me/+96512345678', // Replace with actual WhatsApp number
    },
    {
      id: 3,
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      url: 'https://twitter.com/KBOG_KW',
    },
    {
      id: 4,
      name: 'Website',
      icon: 'globe-outline',
      color: '#007AFF',
      url: 'https://www.kbog.edu.kw', // Replace with actual website
    },
    {
      id: 5,
      name: 'Email',
      icon: 'mail-outline',
      color: '#FF2D55',
      url: 'mailto:info@kbog.edu.kw', // Replace with actual email
    },
  ];

  const handleSocialLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Social Media</Text>
        <View style={styles.socialContainer}>
          {socialLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.socialButton}
              onPress={() => handleSocialLink(link.url)}
            >
              <View style={[styles.iconContainer, { backgroundColor: link.color }]}>
                <Ionicons name={link.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.socialText}>{link.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Kuwait Board of Obstetrics and Gynaecology (KBOG) is dedicated to 
          advancing women's healthcare through excellence in education, research, 
          and practice.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version</Text>
        <Text style={styles.versionText}>1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  socialButton: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  versionText: {
    fontSize: 16,
    color: '#666',
  },
}); 