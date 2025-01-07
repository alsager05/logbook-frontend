import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('OBS')}
        >
          <Ionicons name="medical" size={50} color="black" />
          <Text style={styles.iconText}>OBS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('GYN')}
        >
          <Ionicons name="woman" size={50} color="black" />
          <Text style={styles.iconText}>GYN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('EPA')}
        >
          <Ionicons name="document-text" size={50} color="black" />
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
  },
  iconButton: {
    alignItems: 'center',
    padding: 20,
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 