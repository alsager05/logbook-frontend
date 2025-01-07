import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';


// Import screens
import SettingsScreen from './screens/SettingsScreen';
import AnnouncementScreen from './screens/AnnouncementScreen';
import TutorHomeScreen from './screens/TutorHomeScreen';
import ResidentHomeScreen from './screens/ResidentHomeScreen.js';
import OBSScreen from './screens/OBSScreen';
import GYNScreen from './screens/GYNScreen';
import EPAScreen from './screens/EPAScreen';

const Tab = createBottomTabNavigator();

// Create a Stack navigator for Settings
const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
      {/* Add other settings screens here */}
    </SettingsStack.Navigator>
  );
}

const Colors = {
  primary: '#000000',    // Black instead of blue
  background: '#FFFFFF', // White
  text: '#000000',      // Black
  textLight: '#666666', // Gray for secondary text
  border: '#CCCCCC',    // Light gray for borders
  inactive: '#888888',  // Gray for inactive elements
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '' || !role) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }
   
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Animated.Image
          source={require('./assets/kbog-logo.jpg')}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }
          ]}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'tutor' && styles.roleButtonActive]}
            onPress={() => setRole('tutor')}
          >
            <Text style={[styles.roleButtonText, role === 'tutor' && styles.roleButtonTextActive]}>
              Tutor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'resident' && styles.roleButtonActive]}
            onPress={() => setRole('resident')}
          >
            <Text style={[styles.roleButtonText, role === 'resident' && styles.roleButtonTextActive]}>
              Resident
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
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
          component={role === 'tutor' ? TutorHomeScreen : HomeStackScreen} 
        />
        <Tab.Screen name="Announcements" component={AnnouncementScreen}         />
        <Tab.Screen 
          name="Settings" 
          component={SettingsStackScreen}
          options={{
            headerShown: false // Hide the header for the tab screen
          }}
        />
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});

const Stack = createStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ResidentHome" 
        component={ResidentHomeScreen}
        options={{ headerTitle: 'Home' }}
      />
      <Stack.Screen name="OBS" component={OBSScreen} />
      <Stack.Screen name="GYN" component={GYNScreen} />
      <Stack.Screen name="EPA" component={EPAScreen} />
    </Stack.Navigator>
  );
}
