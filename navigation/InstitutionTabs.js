import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useInstitution } from "../contexts/InstitutionContext";

// Import screens
import DashboardScreen from "../screens/DashboardScreen";
import InstitutionFormsScreen from "../screens/InstitutionFormsScreen";
import ResidentSubmissionsScreen from "../screens/ResidentSubmissionsScreen";
import FormScreen from "../screens/FormScreen";
import FormReviewScreen from "../screens/FormReviewScreen";
import ResidentDetailsScreen from "../screens/ResidentDetailsScreen";
import FormsScreen from "../screens/FormsScreen";
import ResidentsScreen from "../screens/ResidentsScreen";
import AnnouncementScreen from "../screens/AnnouncementScreen";
import AnnouncementDetailsScreen from "../screens/AnnouncementDetailsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom header component with institution branding and menu button
function InstitutionHeader({ navigation, title, theme, institution }) {
  return (
    <View style={styles(theme).headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles(theme).menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="menu-outline" size={24} color={theme.text} />
      </TouchableOpacity>

      {institution && (
        <View style={styles(theme).institutionBadge}>
          {institution.logo ? (
            <Image
              source={{ uri: institution.logo }}
              style={styles(theme).institutionLogo}
            />
          ) : (
            <View style={styles(theme).institutionLogoPlaceholder}>
              <Ionicons name="business" size={16} color={theme.primary} />
            </View>
          )}
          <Text
            style={styles(theme).institutionName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {institution.name}
          </Text>
        </View>
      )}

      <View style={styles(theme).headerTitle}>
        <Text style={styles(theme).headerTitleText}>{title}</Text>
      </View>
    </View>
  );
}

// Stack for Dashboard tab
function DashboardStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="DashboardMain"
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="Dashboard"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}>
        {(props) => (
          <DashboardScreen {...props} role={selectedInstitution?.userRole} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Wrapper component for InstitutionFormsScreen to inject institution data
function InstitutionFormsWrapper({ navigation, route }) {
  const { selectedInstitution } = useInstitution();

  // Merge route params with selected institution data
  const enhancedRoute = {
    ...route,
    params: {
      ...route?.params,
      institutionId: selectedInstitution?._id,
      institutionName: selectedInstitution?.name,
      institutionLogo: selectedInstitution?.logo,
    },
  };

  return (
    <InstitutionFormsScreen navigation={navigation} route={enhancedRoute} />
  );
}

// Stack for Forms tab (Resident view - to submit forms)
function ResidentFormsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="InstitutionFormsMain"
        component={InstitutionFormsWrapper}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="Forms"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
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
  );
}

// Stack for Tutor Forms tab (to review submissions)
function TutorFormsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="FormsMain"
        component={FormsScreen}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="Submissions"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
      />
      <Stack.Screen
        name="FormReview"
        component={FormReviewScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || "Review Form",
        })}
      />
      <Stack.Screen
        name="ResidentDetails"
        component={ResidentDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.residentName || "Resident Details",
        })}
      />
    </Stack.Navigator>
  );
}

// Stack for My Submissions tab (Resident only - filtered by institution)
function MySubmissionsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="SubmissionsMain"
        component={ResidentSubmissionsScreen}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="My Submissions"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
      />
      <Stack.Screen
        name="FormReview"
        component={FormReviewScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || "Review Form",
        })}
      />
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || "Edit Form",
        })}
      />
    </Stack.Navigator>
  );
}

// Stack for Residents tab (Tutor only)
function ResidentsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="ResidentsMain"
        component={ResidentsScreen}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="My Residents"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ResidentDetails"
        component={ResidentDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.residentName || "Resident Details",
        })}
      />
    </Stack.Navigator>
  );
}

// Stack for Announcements tab
function AnnouncementsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

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
        name="AnnouncementsMain"
        component={AnnouncementScreen}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="Announcements"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
      />
      <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetailsScreen}
        options={({ route }) => ({
          headerTitle:
            route.params?.announcement?.title || "Announcement Details",
        })}
      />
    </Stack.Navigator>
  );
}

// Main Institution Tabs Navigator
export default function InstitutionTabs({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution, isLoadingInstitution } = useInstitution();

  // Use institution-specific role instead of global role
  const userRole = selectedInstitution?.userRole;
  const isResident = userRole?.toString().toUpperCase() === "RESIDENT";
  const isTutor = userRole?.toString().toUpperCase() === "TUTOR";
  const isAdmin = userRole?.toString().toUpperCase() === "ADMIN";

  // Show welcome screen if no institution is selected
  if (!selectedInstitution) {
    return <WelcomeScreen navigation={navigation} />;
  }

  // Show loading overlay when switching institutions
  if (isLoadingInstitution) {
    return (
      <View style={styles(theme).loadingContainer}>
        <View style={styles(theme).loadingContent}>
          {selectedInstitution.logo ? (
            <Image
              source={{ uri: selectedInstitution.logo }}
              style={styles(theme).loadingLogo}
            />
          ) : (
            <View style={styles(theme).loadingLogoPlaceholder}>
              <Ionicons name="business" size={48} color={theme.primary} />
            </View>
          )}
          <Text style={styles(theme).loadingInstitutionName}>
            {selectedInstitution.name}
          </Text>
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 20 }}
          />
          <Text style={styles(theme).loadingText}>
            Loading institution data...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Forms") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "MySubmissions") {
            iconName = focused ? "folder" : "folder-outline";
          } else if (route.name === "Residents") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Announcements") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBackground,
          borderTopColor: theme.border,
        },
        headerShown: false,
      })}>
      {/* Dashboard Tab */}
      <Tab.Screen name="Dashboard" options={{ tabBarLabel: "Dashboard" }}>
        {(props) => <DashboardStack {...props} />}
      </Tab.Screen>

      {/* Forms Tab */}
      <Tab.Screen
        name="Forms"
        component={isResident ? ResidentFormsStack : TutorFormsStack}
        options={{
          tabBarLabel: isResident ? "Forms" : "Submissions",
        }}
      />

      {/* My Submissions Tab - Only for Residents */}
      {isResident && (
        <Tab.Screen
          name="MySubmissions"
          component={MySubmissionsStack}
          options={{
            tabBarLabel: "My Submissions",
          }}
        />
      )}

      {/* Residents Tab - Only for Tutors */}
      {isTutor && (
        <Tab.Screen
          name="Residents"
          component={ResidentsStack}
          options={{
            tabBarLabel: "My Residents",
          }}
        />
      )}

      {/* Announcements Tab - For both Residents and Tutors */}
      <Tab.Screen
        name="Announcements"
        component={AnnouncementsStack}
        options={{
          tabBarLabel: "Announcements",
        }}
      />
    </Tab.Navigator>
  );
}

// Styles for custom header
const styles = (theme) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      paddingTop: 50,
      paddingBottom: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuButton: {
      padding: 8,
      marginRight: 8,
    },
    institutionBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      maxWidth: 150,
      marginRight: 12,
    },
    institutionLogo: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    institutionLogoPlaceholder: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    institutionName: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.text,
      flex: 1,
    },
    headerTitle: {
      flex: 1,
    },
    headerTitleText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    // Loading overlay styles
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContent: {
      alignItems: "center",
      padding: 32,
    },
    loadingLogo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    loadingLogoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    loadingInstitutionName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 8,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 12,
      textAlign: "center",
    },
  });
