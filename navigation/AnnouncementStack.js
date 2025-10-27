import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AnnouncementScreen from "../screens/AnnouncementScreen";
import AnnouncementDetailsScreen from "../screens/AnnouncementDetailsScreen";
import { useTheme } from "../contexts/ThemeContext";

const Stack = createStackNavigator();

export function AnnouncementStack() {
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
