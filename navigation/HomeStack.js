import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TutorHomeScreen from '../screens/TutorHomeScreen';
import ResidentHomeScreen from '../screens/ResidentHomeScreen';
import FormScreen from '../screens/FormScreen';

const Stack = createStackNavigator();

export function HomeStack({ role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={role === 'tutor' ? TutorHomeScreen : ResidentHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Score"
        component={(props) => <FormScreen {...props} role={role} />}
        options={{ 
          headerTitle: 'Evaluation Form',
          headerShown: true 
        }}
      />
    </Stack.Navigator>
  );
} 