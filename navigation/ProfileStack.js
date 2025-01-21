import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export function ProfileStack({ handleLogout, roles }) {
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
        name="SettingsMain"
        options={{
          headerShown: false 
        }}
      >
        {(props) => <SettingsScreen {...props} handleLogout={handleLogout} roles={roles} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: 'My Profile',
        }}
      />
    </Stack.Navigator>
  );
}