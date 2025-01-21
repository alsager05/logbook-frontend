import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ResidentSubmissionsScreen from '../screens/ResidentSubmissionsScreen';

const Tab = createBottomTabNavigator();

export function BottomTabs({ roles}) {
  const isResident = roles?.toString().toUpperCase() === 'resident';

  return (
    <Tab.Navigator>
      {/* ... other tabs ... */}
      
      {isResident && (
        <Tab.Screen 
          name="My Submissions" 
          component={ResidentSubmissionsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
} 