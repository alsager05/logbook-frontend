import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import AnnouncementDetailsScreen from './screens/AnnouncementDetailsScreen';
import FormReviewScreen from './screens/FormReviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TutorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Residents') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TutorHomeScreen} />
      <Tab.Screen name="Residents" component={ResidentListScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Create Resident Tab Navigator
function ResidentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ResidentHomeScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function SettingsStackScreen({ role, onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TutorTabs"
          component={TutorTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResidentTabs"
          component={ResidentTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResidentDetails" 
          component={ResidentDetailsScreen}
          options={({ route }) => ({ 
            headerTitle: route.params.resident.name 
          })}
        />
        <Stack.Screen 
          name="AnnouncementDetails" 
          component={AnnouncementDetailsScreen}
          options={{ headerTitle: 'Announcement Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
