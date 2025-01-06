import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TutorHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Dashboard</Text>
      {/* Add tutor-specific content here */}
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

export default TutorHomeScreen; 