import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

import { HomeStack } from './navigation/HomeStack';
import AnnouncementScreen from './screens/AnnouncementScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { authService } from './api/auth';

const Tab = createBottomTabNavigator();

const Colors = {
  primary: '#000000',    
  background: '#FFFFFF', 
  text: '#000000',      
  textLight: '#666666',
  border: '#CCCCCC',   
  inactive: '#888888',  
};

const queryClient = new QueryClient()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = async (username, password, selectedRole) => {
    if (username.trim() === '' || password.trim() === '' || !selectedRole) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }

    try {
      const response = await authService.login(username, password);
      setToken(response.token);
      setRole(selectedRole);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert(
        'Login Failed', 
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setRole('');
      setToken(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoginScreen onLogin={handleLogin} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
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
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
          })}
        >
          <Tab.Screen 
            name="Home" 
            options={{ headerShown: false }}
          >
            {(props) => <HomeStack {...props} role={role} />}
          </Tab.Screen>
          <Tab.Screen 
            name="Announcements" 
            component={AnnouncementScreen} 
          />
          <Tab.Screen 
            name="Settings" 
            options={{ headerShown: false }}
          >
            {(props) => <SettingsScreen {...props} onLogout={handleLogout} role={role} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

