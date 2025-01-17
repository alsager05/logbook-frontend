import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

import { HomeStack } from './navigation/HomeStack';
import AnnouncementScreen from './screens/AnnouncementScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { useAuth } from './hooks/useAuth';
import { authService } from './api/auth';
import ChangePasswordScreen from './screens/ChangePasswordScreen';


const Tab = createBottomTabNavigator();

const queryClient = new QueryClient();


function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userId, setUserId] = useState(null);
  const { login, logout, isLoggingIn, loginError } = useAuth();

  const {mutate:loginMutation} = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      if (data.requirePasswordChange) {
        setRequirePasswordChange(true);
        setUserId(data.userId);
      } else {
        // Make sure we have a role
        const userRole = data.role || data.selectedRole?.toUpperCase();
        setRole(userRole);
        setIsLoggedIn(true);
      }
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login'
      );
    }
  });


  const handleLogin = async (username, password, selectedRole) => {
    if (!username?.trim() || !password?.trim() || !selectedRole) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }

    loginMutation({
      username: username.trim(),
      password: password.trim(),
      selectedRole
    });
  };

  const handleLogout = async () => {
    try {
      console.log("first")
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggedIn(false);
      setRole('');
    }
  };

  const checkToken = async () => {
    const token = await authService.checkToken();
    console.log("dd",token)
    if(token){
      const user = await authService.getUser();
      setIsLoggedIn(token);
      setRole(user.role);
    }
  };

  useEffect(()=>{
    checkToken();
  },[])

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


  console.log(isLoggedIn)
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
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
          {(props) => <SettingsScreen {...props} handleLogout={handleLogout} role={role} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />

    </QueryClientProvider>
  );
}

const Colors = {
  primary: '#000000',    
  background: '#FFFFFF', 
  text: '#000000',      
  textLight: '#666666',
  border: '#CCCCCC',   
  inactive: '#888888',  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
