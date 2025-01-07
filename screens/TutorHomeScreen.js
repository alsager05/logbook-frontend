import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TutorHomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('OBS')}
      >
        <Ionicons name="medical" size={50} color="black" />
        <Text style={styles.iconText}>OBS</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('GYN')}
      >
        <Ionicons name="woman" size={50} color="black" />
        <Text style={styles.iconText}>GYN</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('EPA')}
      >
        <Ionicons name="document-text" size={50} color="black" />
        <Text style={styles.iconText}>EPA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 