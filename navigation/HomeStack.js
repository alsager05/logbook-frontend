import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TutorHomeScreen from '../screens/TutorHomeScreen';
import ResidentHomeScreen from '../screens/ResidentHomeScreen';
import FormScreen from '../screens/FormScreen';
import FormReviewScreen from '../screens/FormReviewScreen';

const Stack = createStackNavigator();

export function HomeStack({ role, handleLogout }) {

  // Normalize the role check
  const normalizedRole = role?.toString().toUpperCase();

  const isTutor = normalizedRole === 'TUTOR';
  const HomeComponent = isTutor ? TutorHomeScreen : ResidentHomeScreen;
  

  return (
    <Stack.Navigator screenOptions={{headerBackTitle:'Back',}}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeComponent}
        options={{ 
          
          headerShown:isTutor ? true : false,
          headerTitle: isTutor ? 'Tutor Dashboard' : 'Resident Dashboard',
        }}
      />
      <Stack.Screen 
        name="Form" 
        component={FormScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Form',
          headerShown: true
        })}
      />
      <Stack.Screen 
        name="FormReview" 
        component={FormReviewScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Review Form',
          headerShown: true
        })}
      />
    </Stack.Navigator>
  );
} 