import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import AnnouncementDetailsScreen from '../screens/AnnouncementDetailsScreen';

const Stack = createStackNavigator();

export function AnnouncementStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="AnnouncementMain" 
        component={AnnouncementScreen}
        options={{ 
          headerTitle: 'Announcements',
        }}
      />
      <Stack.Screen 
        name="AnnouncementDetails" 
        component={AnnouncementDetailsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.announcement?.title || 'Announcement Details',
        })}
      />
    </Stack.Navigator>
  );
}

export default AnnouncementStack; 