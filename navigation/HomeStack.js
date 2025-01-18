import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TutorHomeScreen from '../screens/TutorHomeScreen';
import ResidentHomeScreen from '../screens/ResidentHomeScreen';
import FormScreen from '../screens/FormScreen';

const Stack = createStackNavigator();

export function HomeStack({ role, handleLogout }) {
  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={role === 'tutor' ? TutorHomeScreen : ResidentHomeScreen}
        options={{ 
          headerTitle: 'Home',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Form"
        component={FormScreen}
        initialParams={{ handleLogout }}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Form',
          headerShown: true ,
        })}
      />
    </Stack.Navigator>
  );
} 