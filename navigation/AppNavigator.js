import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// This can be used for both TutorNavigator and ResidentNavigator
const screenOptions = {
  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopWidth: 0,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarActiveTintColor: '#FFFFFF',  // Active icons will be white
  tabBarInactiveTintColor: '#808080', // Inactive icons will be gray
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTintColor: '#FFFFFF',  // Header text color
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

// Add this to your existing TutorNavigator
export function TutorNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* Your existing Tab.Screen components stay exactly the same */}
    </Tab.Navigator>
  );
}

// Add this to your existing ResidentNavigator
export function ResidentNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* Your existing Tab.Screen components stay exactly the same */}
    </Tab.Navigator>
  );
} 