import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function AboutUsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.aboutContainer}>
        <Image 
          source={require('../assets/kbog-logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.aboutTitle}>Kuwait Board of Obstetrics & Gynecology</Text>
        <Text style={styles.aboutText}>
          The Kuwait Board of Obstetrics and Gynecology (KBOG) is a prestigious medical education 
          program dedicated to training and certifying specialists in obstetrics and gynecology 
          in Kuwait. Our mission is to provide high-quality medical education and training to 
          ensure the best healthcare standards for women in Kuwait.
        </Text>
      </View>
    </ScrollView>
  );
}

function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.policyContainer}>
        <Text style={styles.policyTitle}>Privacy Policy</Text>
        <Text style={styles.policyText}>
          Your privacy is important to us. This privacy policy explains how we collect, 
          use, and protect your personal information...
          {/* Add your complete privacy policy text here */}
        </Text>
      </View>
    </ScrollView>
  );
}

function MainSettingsScreen({ navigation, handleLogout, roles }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Load notification settings when component mounts
  React.useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const notificationSetting = await AsyncStorage.getItem('notificationsEnabled');
      setIsNotificationsEnabled(notificationSetting === 'true');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', value.toString());
      setIsNotificationsEnabled(value);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleSocialLink = (type) => {
    let url;
    switch(type) {
      case 'instagram':
        url = 'https://www.instagram.com/kraog_q8/';
        break;
      case 'website':
        url = 'https://kims-pge.org';
        break;
      case 'email':
        url = 'mailto:info@kbog.org';
        break;
    }
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/kbog-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <Text style={styles.menuText}>Notifications</Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#767577", true: "#000" }}
              thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AboutUs')}
          >
            <Ionicons name="information-circle-outline" size={24} color="#000" />
            <Text style={styles.menuText}>About Us</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#000" />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLink('instagram')}
            >
              <Ionicons name="logo-instagram" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLink('website')}
            >
              <Ionicons name="globe-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLink('email')}
            >
              <Ionicons name="mail-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingsScreen({ handleLogout, role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsScreen"
        options={{ headerShown: false }}
      >
        {(props) => <MainSettingsScreen {...props} handleLogout={handleLogout} role={role} />}
      </Stack.Screen>
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 15,
  },
  logo: {
    width: 200,
    height: 100,
  },
  section: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  socialSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  aboutContainer: {
    padding: 20,
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  policyContainer: {
    padding: 20,
  },
  policyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
});
