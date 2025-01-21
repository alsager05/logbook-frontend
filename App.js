import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStack } from './navigation/HomeStack';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { useAuth } from './hooks/useAuth';
import { authService } from './api/auth';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ResidentSubmissionsScreen from './screens/ResidentSubmissionsScreen';
import FormReviewScreen from './screens/FormReviewScreen';
import { AnnouncementStack } from "./navigation/AnnouncementStack";
import {ProfileStack} from "./navigation/ProfileStack";
import { ThemeProvider } from './context/ThemeContext';
import AnnouncementScreen from "./screens/AnnouncementScreen";



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const queryClient = new QueryClient();

// Create a wrapper component outside the render function
const ProfileStackWrapper = ({ handleLogout, roles }) => (
  <ProfileStack handleLogout={handleLogout} roles={roles} />
);

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRole] = useState('');
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
        const userRole = data.user?.role || data.user?.roles?.[0];
        console.log('Setting role to:', userRole);
        setRole(userRole);
        setIsLoggedIn(true);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  });


  const handleLogin = async (username, password, selectedRole) => {
    console.log('Login attempt:', { username, selectedRole });
    
    if (!username?.trim() || !password?.trim() || !selectedRole) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }

    loginMutation({
      username: username.trim(),
      password: password.trim(),
      role: selectedRole
    });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setRole('');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkToken = async () => {
    const token = await authService.checkToken();
    if(token){
      const user = await authService.getUser();
      console.log("user form App",user)
      setIsLoggedIn(token);
      setRole(user.roles[0]);
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
          headerShown: false,
          tabBarStyle: {
            height: 95,
            paddingTop: 13,
            paddingBottom: 10,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#EEEEEE',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            paddingBottom: 5,
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#888888',
        })}
      >
        <Tab.Screen 
          name="Home" 
          options={{ headerShown: false }}
        >
          {(props) => <HomeStack {...props} roles={roles} />}
        </Tab.Screen>
        {roles === 'resident' && (
          <Tab.Screen 
            name="My Submissions"
            options={{ 
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons 
                  name={focused ? 'document-text' : 'document-text-outline'} 
                  size={size} 
                  color={color} 
                />
              ),
              tabBarActiveTintColor: Colors.primary,
              tabBarInactiveTintColor: Colors.inactive,
            }}
            children={(props) => (
              <Stack.Navigator>
                <Stack.Screen
                  name="SubmissionsList"
                  component={ResidentSubmissionsScreen}
                  options={{
                    headerTitle: 'My Submissions'
                  }}
                />
                <Stack.Screen
                  name="FormReview"
                  component={FormReviewScreen}
                  options={({ route }) => ({
                    headerTitle: route.params?.formName || 'Review Form'
                    
                  })}
                />
              </Stack.Navigator>
            )}
          />
        )}
        <Tab.Screen
          name="Announcements"
          component={AnnouncementStack}
          options={{ headerShown: false }}
        />

        <Tab.Screen 
          name="Settings" 
          options={{ headerShown: false }}
        >
          {(props) => <ProfileStackWrapper handleLogout={handleLogout} roles={roles} {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const Colors = {
  primary: '#000000',    
  background: '#FFFFFF', 
  text: '#000000',      
  textLight: '#666666',
  border: '#EEEEEE',   
  inactive: '#888888',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});