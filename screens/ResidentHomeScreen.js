import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResidentHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resident Dashboard</Text>
      {/* Add resident-specific content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
});

export default ResidentHomeScreen; 