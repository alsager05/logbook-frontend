import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Animated 
} from 'react-native';

const Colors = {
  primary: '#000000',    // Black instead of blue
  background: '#FFFFFF', // White
  text: '#000000',      // Black
  textLight: '#666666', // Gray for secondary text
  border: '#CCCCCC',    // Light gray for borders
  inactive: '#888888',  // Gray for inactive elements
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '' || !role) {
      Alert.alert('Error', 'Please enter username, password, and select a role');
      return;
    }
    onLogin(role);
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/kbog-logo.jpg')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}
        resizeMode="contain"
      />
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
          style={[styles.roleButton, role === 'tutor' && styles.roleButtonActive]}
          onPress={() => setRole('tutor')}
        >
          <Text style={[styles.roleButtonText, role === 'tutor' && styles.roleButtonTextActive]}>
            Tutor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'resident' && styles.roleButtonActive]}
          onPress={() => setRole('resident')}
        >
          <Text style={[styles.roleButtonText, role === 'resident' && styles.roleButtonTextActive]}>
            Resident
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
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
    borderColor: Colors.primary,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: Colors.background,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});
