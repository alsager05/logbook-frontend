import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

const Colors = {
  primary: '#000000',
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#666666',
  border: '#CCCCCC',
  inactive: '#888888',
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('');
  const { isLoggingIn } = useAuth();

  const handleLogin = () => {
    if (!username || !password || !roles) {
      alert('Please fill in all fields');
      return;
    }

    // Convert role to uppercase to match backend
    const normalizedRole = roles.toUpperCase();
    console.log('Submitting login with role:', normalizedRole); // Debug log
    
    onLogin(username, password, normalizedRole);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/kbog-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, roles === 'tutor' && styles.roleButtonActive]}
              onPress={() => setRoles('tutor')}
            >
              <Text style={[styles.roleButtonText, roles === 'tutor' && styles.roleButtonTextActive]}>
                tutor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, roles === 'RESIDENT' && styles.roleButtonActive]}
              onPress={() => setRoles('RESIDENT')}
            >
              <Text style={[styles.roleButtonText, roles === 'RESIDENT' && styles.roleButtonTextActive]}>
                Resident
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.button, 
              (!username || !password || !roles) && styles.buttonDisabled,
              isLoggingIn && styles.buttonLoading
            ]}
            onPress={handleLogin}
            disabled={!username || !password || !roles || isLoggingIn}
          >
            <Text style={styles.buttonText}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    flex: 2,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#000',
  },
  roleButtonText: {
    color: '#000',
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: Colors.inactive,
  },
  buttonLoading: {
    backgroundColor: Colors.inactive,
  },
});