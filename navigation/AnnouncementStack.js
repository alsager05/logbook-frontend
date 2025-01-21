import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import AnnouncementDetailsScreen from '../screens/AnnouncementDetailsScreen';

const Stack = createStackNavigator();

export function AnnouncementStack() {
  return (
    <Stack.Navigator
      initialRouteName="AnnouncementList"
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
        name="AnnouncementList"
        component={AnnouncementScreen}
        options={{
          headerTitle: 'Announcements',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="AnnouncementDetailsScreen"
        component={AnnouncementDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.title || 'Announcement Details',
          headerShown: true
        })}
      />
    </Stack.Navigator>
  );
}