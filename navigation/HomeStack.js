import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TutorHomeScreen from '../screens/TutorHomeScreen';
import ResidentHomeScreen from '../screens/ResidentHomeScreen';
import FormScreen from '../screens/FormScreen';
import FormReviewScreen from '../screens/FormReviewScreen';

const Stack = createStackNavigator();

export function HomeStack({ roles, handleLogout }) {
  console.log('Role received in HomeStack:', roles); // Debug log

  // Normalize the role check
  const normalizedRole = roles?.toString().toUpperCase();
  console.log('Normalized role:', normalizedRole); // Debug log

  const isTutor = normalizedRole === 'tutor';
  const HomeComponent = isTutor ? TutorHomeScreen : ResidentHomeScreen;
  
  console.log('Is Tutor:', isTutor); // Debug log
  console.log('Selected Component:', HomeComponent.name); // Debug log

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#000000',
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerTintColor: '#000000',
      }}
    >
           <Stack.Screen 
        name="HomeMain" 
        component={HomeComponent}
        options={{ 
          headerTitle: isTutor ? 'Tutor Dashboard' : 'Resident Dashboard',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Form" 
        component={FormScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Form',
          headerShown: false
        })}
      />
      <Stack.Screen 
        name="FormReview" 
        component={FormReviewScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Review Form',
          headerShown: false
        })}
      />
    </Stack.Navigator>
  );
} 