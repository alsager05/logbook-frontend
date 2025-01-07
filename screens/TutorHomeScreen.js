import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TutorHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Tutor!</Text>
      <Text style={styles.subText}>Use the Residents tab to view resident progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 