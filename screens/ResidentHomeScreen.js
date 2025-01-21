import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FormScreen from './FormScreen';
import { useQuery } from '@tanstack/react-query';
import { formsService } from '../api/forms';

const HomeStack = createStackNavigator();

function ResidentHomeContent({ navigation }) {
  const { data: formTemplates, isLoading, error } = useQuery({
    queryKey: ['formTemplates'],
    queryFn: async () => {
      const response = await formsService.getAllForms();
      console.log('Form templates response:', response);
      return Array.isArray(response) ? response : [];
    }
  });

  console.log('FormTemplates in component:', formTemplates);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error('Error in component:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Error: {error.message}</Text>
      </View>
    );
  }

  const templates = Array.isArray(formTemplates) ? formTemplates : [];

  // Helper function to get subtitle based on form name
  const getFormSubtitle = (formName) => {
    switch(formName.toUpperCase()) {
      case 'OBS':
        return 'Obstetrics';
      case 'GYN':
        return 'Gynecology';
      case 'EPA':
        return 'Entrustable Professional Activities';
      default:
        return formName;
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.buttonContainer}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <TouchableOpacity 
              key={template._id}
              style={styles.categoryButton}
              onPress={() => {
                console.log('Navigating with template:', template);
                navigation.navigate('Form', {
                  formId: template._id,
                  formName: template.formName,
                  formData: {
                    ...template,
                    fieldTemplates: template.fieldTemplates || []
                  }
                });
              }}
            >
              <View style={styles.buttonContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.categoryTitle}>{template.formName}</Text>
                  <Text style={styles.categorySubtitle}>
                    {getFormSubtitle(template.formName)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.messageText}>No forms available</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default function ResidentHomeScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen 
        name="ResidentHome" 
        component={ResidentHomeContent}
        options={{ 
          headerTitle: 'Home',
          headerShown: false 
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
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    padding: 15,
    gap: 15,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonContent: {
    padding: 20,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 16,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    padding: 20,
  }
}); 