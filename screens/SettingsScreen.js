import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
  Image,
  Switch,
  useColorScheme
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';



export default function SettingsScreen({ navigation, handleLogout, role }) {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { isDarkMode, toggleTheme, colors } = useTheme();

  
  const socialLinks = [
    {
      id: 1,
      name: "Instagram",
      icon: "logo-instagram",
      color: "#E1306C",
      url: "https://www.instagram.com/kraog_q8/",
    },

    {
      id: 2,
      name: "Website",
      icon: "globe-outline",
      color: "#007AFF",
      url: "https://www.kims-page.org", // Replace with actual website
    },
    {
      id: 3,
      name: "Email",
      icon: "mail-outline",
      color: "#FF2D55",
      url: "mailto:info@kbog.edu.kw", // Replace with actual email
    },
  ];

  const handleSocialLink = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/kbog-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      
                {/* Account Settings */}  
                <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="person-outline" size={24} color={colors.icon} />
            <Text style={[styles.menuText, { color: colors.text }]}>Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Notifications */}
        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <View style={styles.menuLeft}>
            <Ionicons name="notifications-outline" size={24} color={colors.icon} />
            <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        {/* Dark Mode */}
        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <View style={styles.menuLeft}>
            <Ionicons 
              name={isDarkMode ? "moon" : "moon-outline"} 
              size={24} 
              color={colors.icon} 
            />
            <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>

        {/* About Us */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('AboutScreen')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="information-circle-outline" size={24} color={colors.icon} />
            <Text style={[styles.menuText, { color: colors.text }]}>About Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('PrivacyPolicyScreen')}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.icon} />
            <Text style={[styles.menuText, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Follow Us Section */}
        <View style={styles.followSection}>
          <Text style={[styles.followTitle, { color: colors.text }]}>Follow Us</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((link) => (
              <TouchableOpacity 
                key={link.id}
                style={[styles.socialButton, { backgroundColor: '#f5f5f5' }]}
                onPress={() => handleSocialLink(link.url)}
              >
                <Ionicons 
                  name={link.icon} 
                  size={24} 
                  color={link.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logoutButton, { 
            backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' 
          }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { 
            color: isDarkMode ? '#000000' : '#FFFFFF' 
          }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#000',
    marginBottom: 20,
    borderRadius: 12,
    margin: 15,
  },
  logo: {
    width: 400,
    height: 120,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#000',
  },
  followSection: {
    padding: 20,
    marginTop: 20,
  },
  followTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#000',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});