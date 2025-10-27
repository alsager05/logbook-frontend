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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";

const Stack = createStackNavigator();

function AboutUsScreen() {
  const { theme, isDark } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.aboutContainer}>
        <Image
          source={require("../assets/kbog-logo.jpg")}
          style={themedStyles.logo}
          resizeMode="contain"
        />
        <Text style={themedStyles.aboutTitle}>
          Kuwait Board of Obstetrics & Gynecology
        </Text>
        <Text style={themedStyles.aboutText}>
          The Kuwait Board of Obstetrics and Gynecology (KBOG) is a prestigious
          medical education program dedicated to training and certifying
          specialists in obstetrics and gynecology in Kuwait. Our mission is to
          provide high-quality medical education and training to ensure the best
          healthcare standards for women in Kuwait.
        </Text>
      </View>
    </ScrollView>
  );
}

function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.policyContainer}>
        <Text style={themedStyles.policyTitle}>Privacy Policy</Text>
        <Text style={themedStyles.policyText}>
          Your privacy is important to us. This privacy policy explains how we
          collect, use, and protect your personal information...
          {/* Add your complete privacy policy text here */}
        </Text>
      </View>
    </ScrollView>
  );
}

function MainSettingsScreen({ navigation, handleLogout, roles }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  // Load notification settings when component mounts
  React.useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const notificationSetting = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      setIsNotificationsEnabled(notificationSetting === "true");
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await AsyncStorage.setItem("notificationsEnabled", value.toString());
      setIsNotificationsEnabled(value);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const handleSocialLink = (type) => {
    let url;
    switch (type) {
      case "instagram":
        url = "https://www.instagram.com/kraog_q8/";
        break;
      case "website":
        url = "https://kims-pge.org";
        break;
      case "email":
        url = "mailto:info@kbog.org";
        break;
    }
    if (url) Linking.openURL(url);
  };

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.contentWrapper}>
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

        <View style={themedStyles.section}>
          <View style={themedStyles.menuItem}>
            <Ionicons name="moon-outline" size={24} color={theme.text} />
            <Text style={themedStyles.menuText}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDark ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={themedStyles.menuItem}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
            <Text style={themedStyles.menuText}>Notifications</Text>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity
            style={themedStyles.menuItem}
            onPress={() => navigation.navigate("AboutUs")}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.text}
            />
            <Text style={themedStyles.menuText}>About Us</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={themedStyles.menuItem}
            onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={theme.text}
            />
            <Text style={themedStyles.menuText}>Privacy Policy</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={themedStyles.socialSection}>
          <Text style={themedStyles.socialTitle}>Follow Us</Text>
          <View style={themedStyles.socialButtons}>
            <TouchableOpacity
              style={themedStyles.socialButton}
              onPress={() => handleSocialLink("instagram")}>
              <Ionicons name="logo-instagram" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={themedStyles.socialButton}
              onPress={() => handleSocialLink("website")}>
              <Ionicons name="globe-outline" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={themedStyles.socialButton}
              onPress={() => handleSocialLink("email")}>
              <Ionicons name="mail-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={themedStyles.logoutButton}
          onPress={handleLogout}>
          <Text style={themedStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingsScreen({ handleLogout, role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }}>
        {(props) => (
          <MainSettingsScreen
            {...props}
            handleLogout={handleLogout}
            role={role}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentWrapper: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
      backgroundColor: theme.surface,
      padding: 20,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    logo: {
      width: 300,
      height: 150,
    },
    section: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      marginBottom: 30,
      borderRadius: 12,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuText: {
      flex: 1,
      marginLeft: 15,
      fontSize: 16,
      color: theme.text,
    },
    socialSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    socialTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.text,
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
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    logoutButton: {
      backgroundColor: theme.primary,
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
      color: theme.text,
    },
    aboutText: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "justify",
      color: theme.textSecondary,
    },
    policyContainer: {
      padding: 20,
    },
    policyTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.text,
    },
    policyText: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "justify",
      color: theme.textSecondary,
    },
  });
