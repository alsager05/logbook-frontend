import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { HomeStack } from "./navigation/HomeStack";
import AnnouncementScreen from "./screens/AnnouncementScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import { useAuth } from "./hooks/useAuth";
import { authService } from "./api/auth";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ResidentSubmissionsScreen from "./screens/ResidentSubmissionsScreen";
import FormReviewScreen from "./screens/FormReviewScreen";
import AnnouncementStack from "./navigation/AnnouncementStack";
import DashboardScreen from "./screens/DashboardScreen";
import FormsScreen from "./screens/FormsScreen";
import FormScreen from "./screens/FormScreen";
import MyInstitutionsScreen from "./screens/MyInstitutionsScreen";
import BrowseInstitutionsScreen from "./screens/BrowseInstitutionsScreen";
import InstitutionFormsScreen from "./screens/InstitutionFormsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import DeleteAccountScreen from "./screens/DeleteAccountScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const queryClient = new QueryClient();

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userId, setUserId] = useState(null);
  const { login, logout, isLoggingIn, loginError } = useAuth();
  const { theme, isDark } = useTheme();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      if (data.requirePasswordChange) {
        setRequirePasswordChange(true);
        setUserId(data.userId);
      } else {
        const userRole = data.user?.role[0] || data.role[0];
        setRole(userRole.toUpperCase());
        setIsLoggedIn(true);
      }
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login"
      );
    },
  });

  const handleLogin = async (username, password, selectedRole) => {
    if (!username?.trim() || !password?.trim() || !selectedRole) {
      Alert.alert(
        "Error",
        "Please enter username, password, and select a role"
      );
      return;
    }

    loginMutation({
      username: username.trim(),
      password: password.trim(),
      selectedRole,
    });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setRole("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkToken = async () => {
    const token = await authService.checkToken();
    console.log("We Are here ");

    if (token) {
      const user = await authService.getUser();
      setIsLoggedIn(token);
      setRole(user.role[0].toUpperCase());
    }
  };

  useEffect(() => {
    checkToken();
  }, [isLoggedIn]);

  if (requirePasswordChange) {
    return (
      <ChangePasswordScreen
        userId={userId}
        onPasswordChanged={() => {
          setRequirePasswordChange(false);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} isLoggingIn={isPending} />;
  }

  return (
    <>
      <StatusBar style={theme.statusBarStyle} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Dashboard") {
                iconName = focused ? "grid" : "grid-outline";
              } else if (route.name === "Institutions") {
                iconName = focused ? "business" : "business-outline";
              } else if (route.name === "Forms") {
                iconName = focused ? "document-text" : "document-text-outline";
              } else if (route.name === "My Submissions") {
                iconName = focused ? "folder" : "folder-outline";
              } else if (route.name === "Announcements") {
                iconName = focused ? "megaphone" : "megaphone-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.tabActive,
            tabBarInactiveTintColor: theme.tabInactive,
            tabBarStyle: {
              backgroundColor: theme.tabBackground,
              borderTopColor: theme.border,
            },
            headerStyle: {
              backgroundColor: theme.surface,
              borderBottomColor: theme.border,
            },
            headerTitleStyle: {
              color: theme.text,
            },
          })}>
          {/* Dashboard Tab */}
          <Tab.Screen
            name="Dashboard"
            options={{
              headerShown: true,
              headerTitle: "Dashboard",
            }}>
            {(props) => <DashboardScreen {...props} role={role} />}
          </Tab.Screen>

          {/* Institutions Tab - For both residents and tutors */}
          <Tab.Screen
            name="Institutions"
            options={{
              headerShown: false,
            }}>
            {(props) => (
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
                  name="MyInstitutions"
                  component={MyInstitutionsScreen}
                  options={{
                    headerTitle: "My Institutions",
                  }}
                />
                <Stack.Screen
                  name="BrowseInstitutions"
                  component={BrowseInstitutionsScreen}
                  options={{
                    headerTitle: "Browse Institutions",
                  }}
                />
                <Stack.Screen
                  name="InstitutionForms"
                  component={InstitutionFormsScreen}
                  options={({ route }) => ({
                    headerTitle:
                      route.params?.institutionName || "Institution Forms",
                  })}
                />
                <Stack.Screen
                  name="Form"
                  component={FormScreen}
                  options={({ route }) => ({
                    headerTitle: route.params?.formName || "Form",
                  })}
                />
                <Stack.Screen
                  name="FormReview"
                  component={FormReviewScreen}
                  options={({ route }) => ({
                    headerTitle: route.params?.formName || "Review Form",
                  })}
                />
              </Stack.Navigator>
            )}
          </Tab.Screen>

          {/* Forms Tab - Only for tutors */}
          {role === "TUTOR" && (
            <Tab.Screen
              name="Forms"
              options={{
                headerShown: false,
                headerTitle: "Form Submissions",
              }}>
              {(props) => (
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.surface,
                      borderBottomColor: theme.border,
                    },
                    headerTitleStyle: {
                      color: theme.text,
                    },
                  }}>
                  <Stack.Screen
                    name="FormsList"
                    component={FormsScreen}
                    options={{
                      headerTitle: "Form Submissions",
                    }}
                  />
                  <Stack.Screen
                    name="FormReview"
                    component={FormReviewScreen}
                    options={({ route }) => ({
                      headerTitle: route.params?.formName || "Review Form",
                    })}
                  />
                </Stack.Navigator>
              )}
            </Tab.Screen>
          )}

          {/* My Submissions Tab - Only for residents */}
          {role === "RESIDENT" && (
            <Tab.Screen
              name="My Submissions"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={focused ? "document-text" : "document-text-outline"}
                    size={size}
                    color={color}
                  />
                ),
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.inactive,
              }}
              children={(props) => (
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.surface,
                      borderBottomColor: theme.border,
                    },
                    headerTitleStyle: {
                      color: theme.text,
                    },
                  }}>
                  <Stack.Screen
                    name="SubmissionsList"
                    component={ResidentSubmissionsScreen}
                    options={{
                      headerTitle: "My Submissions",
                    }}
                  />
                  <Stack.Screen
                    name="Form"
                    component={FormScreen}
                    options={({ route }) => ({
                      headerTitle: route.params?.formName || "New Form",
                    })}
                  />
                  <Stack.Screen
                    name="FormReview"
                    component={FormReviewScreen}
                    options={({ route }) => ({
                      headerTitle: route.params?.formName || "Review Form",
                    })}
                  />
                </Stack.Navigator>
              )}
            />
          )}
          <Tab.Screen
            name="Announcements"
            options={{ headerShown: false }}
            component={AnnouncementStack}
          />

          {/* Profile Tab - Replaces Settings */}
          <Tab.Screen name="Profile" options={{ headerShown: false }}>
            {(props) => (
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
                  }}>
                  {(screenProps) => (
                    <ProfileScreen
                      {...screenProps}
                      handleLogout={handleLogout}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfileScreen}
                  options={{
                    headerTitle: "Edit Profile",
                  }}
                />
                <Stack.Screen
                  name="DeleteAccount"
                  component={DeleteAccountScreen}
                  options={{
                    headerTitle: "Delete Account",
                  }}
                />
                <Stack.Screen
                  name="AboutUs"
                  component={AboutUsScreen}
                  options={{
                    headerTitle: "About Us",
                  }}
                />
                <Stack.Screen
                  name="PrivacyPolicy"
                  component={PrivacyPolicyScreen}
                  options={{
                    headerTitle: "Privacy Policy",
                  }}
                />
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const Colors = {
  primary: "#000000",
  background: "#FFFFFF",
  text: "#000000",
  textLight: "#666666",
  border: "#CCCCCC",
  inactive: "#888888",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
