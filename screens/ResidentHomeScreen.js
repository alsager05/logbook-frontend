import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ResidentHomeScreen({ navigation }) {
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