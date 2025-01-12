import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import TutorHomeScreen from './screens/TutorHomeScreen';
import ResidentHomeScreen from './screens/ResidentHomeScreen';
import AnnouncementScreen from './screens/AnnouncementScreen';
import SettingsScreen from './screens/SettingsScreen';
import ResidentListScreen from './screens/ResidentListScreen';
import ResidentDetailsScreen from './screens/ResidentDetailsScreen';
import AnnouncementDetailsScreen from './screens/AnnouncementDetailsScreen';
import FormReviewScreen from './screens/FormReviewScreen';
import OBSScreen from './screens/OBSScreen';
import GYNScreen from './screens/GYNScreen';
import EPAScreen from './screens/EPAScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create Tutor Tab Navigator
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

export default function App() {
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
        <Stack.Screen 
          name="FormReview" 
          component={FormReviewScreen}
          options={{ headerTitle: 'Review Form' }}
        />
        <Stack.Screen 
          name="OBS" 
          component={OBSScreen}
          options={{ headerTitle: 'OBS Form' }}
        />
        <Stack.Screen 
          name="GYN" 
          component={GYNScreen}
          options={{ headerTitle: 'GYN Form' }}
        />
        <Stack.Screen 
          name="EPA" 
          component={EPAScreen}
          options={{ headerTitle: 'EPA Form' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
