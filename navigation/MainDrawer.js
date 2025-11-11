import React from "react";
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

// Import navigators and screens
import InstitutionTabs from "./InstitutionTabs";
import CustomDrawerContent from "../components/CustomDrawerContent";

// Import screens
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import SettingsScreen from "../screens/SettingsScreen";
import BrowseInstitutionsScreen from "../screens/BrowseInstitutionsScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Profile Stack Navigator
function ProfileStack({ handleLogout, navigation }) {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerBackTitle: "Back",
      }}>
      <Stack.Screen
        name="ProfileMain"
        options={{
          headerTitle: "Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16 }}>
              <Ionicons name="menu-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
        }}>
        {(props) => <ProfileScreen {...props} handleLogout={handleLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerTitle: "Edit Profile" }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ headerTitle: "Delete Account" }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ headerTitle: "About Us" }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerTitle: "Privacy Policy" }}
      />
    </Stack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStack({ navigation }) {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerBackTitle: "Back",
      }}>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16 }}>
              <Ionicons name="menu-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

// Browse Institutions Stack
function BrowseStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerBackTitle: "Back",
      }}>
      <Stack.Screen
        name="BrowseMain"
        component={BrowseInstitutionsScreen}
        options={{ headerTitle: "Browse Institutions" }}
      />
    </Stack.Navigator>
  );
}

// Main Drawer Navigator
export default function MainDrawer({ handleLogout }) {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.surface,
          width: 280,
        },
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.text,
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
        headerShown: false, // Hide drawer headers, show tab headers instead
      }}>
      {/* Main Institution View - This is the default screen */}
      <Drawer.Screen
        name="Institution"
        options={{
          drawerItemStyle: { display: "none" }, // Hide from drawer menu
          headerTitle: "Logbook",
        }}>
        {(props) => <InstitutionTabs {...props} />}
      </Drawer.Screen>

      {/* Profile */}
      <Drawer.Screen
        name="Profile"
        options={{ drawerItemStyle: { display: "none" } }}>
        {(props) => <ProfileStack {...props} handleLogout={handleLogout} />}
      </Drawer.Screen>

      {/* Settings */}
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerItemStyle: { display: "none" }, // Already in custom drawer
        }}
      />

      {/* Browse Institutions */}
      <Drawer.Screen
        name="BrowseInstitutions"
        component={BrowseStack}
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
