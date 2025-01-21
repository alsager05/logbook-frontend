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

        <View style={styles.formWrapper}>
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
                styles.loginButton, 
                (!username || !password || !roles) ? styles.loginButtonDisabled : styles.loginButtonEnabled,
                isLoggingIn && styles.loginButtonLoading
              ]}
              onPress={handleLogin}
              disabled={!username || !password || !roles || isLoggingIn}
            >
              <View style={styles.loginButtonContent}>
                <Text style={styles.loginButtonText}>
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: '100%',
    height: '75%',
  },
  formWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 70,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 70,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 25,
  },
  roleButton: {
    width: '48%',
    height: 45,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#000',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  loginButton: {
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonEnabled: {
    backgroundColor: '#000',
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonLoading: {
    backgroundColor: '#666',
  },
  loginButtonContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});