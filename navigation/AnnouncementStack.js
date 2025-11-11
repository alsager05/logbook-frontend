import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AnnouncementScreen from "../screens/AnnouncementScreen";
import AnnouncementDetailsScreen from "../screens/AnnouncementDetailsScreen";
import { useTheme } from "../contexts/ThemeContext";

const Stack = createStackNavigator();

export function AnnouncementStack({ navigation }) {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          color: theme.text,
        },
      }}>
      <Stack.Screen
        name="AnnouncementMain"
        component={AnnouncementScreen}
        options={{
          headerTitle: "Announcements",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16 }}>
              <Ionicons name="menu-outline" size={24} color={theme.text} />
            </TouchableOpacity>
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

export default AnnouncementStack;
