import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResidentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Resident Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    color: '#000000',
  },
});

export default ResidentScreen; 