import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FormScreen from './FormScreen';
import { useQuery } from '@tanstack/react-query';
import { formsService } from '../api/forms';

const HomeStack = createStackNavigator();

function MainResidentScreen({ navigation }) {
  const handleFormPress = (formType) => {
    navigation.navigate('FormScreen', { 
      name: 'SCORE',
      formType: formType
    });
  };

  const {data:forms, isLoading, error} = useQuery({
    queryKey: ['forms'],
    queryFn: formsService.getAllForms,
    onSuccess: (data)=>{
      console.log('forms', data);
    },
    onError: (error)=>{
      console.log('error', error);
    }
  });

  console.log(forms)
  console.log(isLoading)
  if(isLoading){
    return <Text>Loading...</Text>
  } 

  if(error){
    return <Text>Error</Text>
  }

  const formsList = forms?.map((form) => (
    <TouchableOpacity 
      key={form._id}
      style={styles.iconButton}
      onPress={() => navigation.navigate('Form', {
        formName: form.formName,
        formId: form._id
      })}
    >
      <Text style={styles.iconText}>{form.formName}</Text>
    </TouchableOpacity>
  ));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconsContainer}>
          {/* <TouchableOpacity 
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
          </TouchableOpacity> */}
          {formsList}
      </View>
    </ScrollView>
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
        name="Form" 
        component={FormScreen}
        options={({ route }) => ({
          headerTitle: route.params?.formName || 'Form',
          headerShown: true
        })}
      />
    
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
    paddingHorizontal: 20,
    // paddingTop: 50,
    // marginBottom: 50,
    // paddingBottom: 500,
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