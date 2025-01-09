import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from './screens/SettingsScreen';
import AnnouncementScreen from './screens/AnnouncementScreen';
import TutorHomeScreen from './screens/TutorHomeScreen';
import ResidentHomeScreen from './screens/ResidentHomeScreen';
import ResidentProfileScreen from './screens/ResidentProfileScreen';
import TutorProfileScreen from './screens/TutorProfileScreen';
import FormScreenScreen from './screens/FormScreen';
import LoginScreen from './screens/LoginScreen';
import AnnouncementDetailsScreen from './screens/AnnouncementDetailsScreen';

const Colors = {
  primary: '#000000',    
  background: '#FFFFFF', 
  text: '#000000',      
  textLight: '#666666',
  border: '#CCCCCC',   
  inactive: '#888888',  
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SettingsStack = createStackNavigator();

function SettingsStackScreen({ role, onLogout }) {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen 
        name="SettingsMain" 
        component={(props) => <SettingsScreen {...props} onLogout={onLogout} />}
        options={{ headerTitle: 'Settings' }}
      />
      <SettingsStack.Screen 
        name="Profile" 
        component={role === 'tutor' ? TutorProfileScreen : ResidentProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
    </SettingsStack.Navigator>
  );
}

// First, create a wrapper component for Settings
function SettingsWrapper(props) {
  const { role, onLogout } = props;
  return <SettingsStackScreen role={role} onLogout={onLogout} />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  const handleLogin = (username, password, selectedRole) => {
    if (username.trim() === '' || password.trim() === '' || !selectedRole) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }
    setRole(selectedRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
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
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.inactive,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={role === 'tutor' ? TutorHomeScreen : ResidentHomeScreen} 
        />
        <Tab.Screen 
          name="Announcements" 
          component={AnnouncementScreen} 
        />
        <Tab.Screen 
          name="Settings" 
          options={{ headerShown: false }}
        >
          {(props) => <SettingsWrapper {...props} role={role} onLogout={handleLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: Colors.background,
  },
});

