import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FormScreen from './FormScreen';

const HomeStack = createStackNavigator();

function MainResidentScreen({ navigation }) {
  const handleFormPress = (formType) => {
    navigation.navigate('FormScreen', { 
      name: 'SCORE',
      formType: formType
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('OBS')}
        >
          <Text style={styles.iconText}>OBS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('GYN')}
        >
          <Text style={styles.iconText}>GYN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('EPA')}
        >
          <Text style={styles.iconText}>EPA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ResidentHomeScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true
      }}
    >
      <HomeStack.Screen 
        name="ResidentHome" 
        component={MainResidentScreen}
        options={{ 
          headerTitle: 'Home',
          headerShown: true
        }}
      />
      <HomeStack.Screen 
        name="OBS" 
        component={FormScreen}
        options={{
          headerShown: true
        }}
      />
      <HomeStack.Screen 
        name="GYN" 
        component={FormScreen}
        options={{
          headerShown: true
        }}
      />
      <HomeStack.Screen 
        name="EPA" 
        component={FormScreen}
        options={{
          headerShown: true
        }}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  iconsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    gap: 30,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '80%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 