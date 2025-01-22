import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentsScreen({ navigation }) {
  // Add your residents data fetching logic here
  const residents = [
    {
      id: '1',
      name: 'Dr. John Doe',
      level: 'PGY-1',
      specialty: 'OB/GYN',
    },
    // Add more residents...
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.residentCard}
      onPress={() => navigation.navigate('ResidentDetails', { resident: item })}
    >
      <View style={styles.residentInfo}>
        <Text style={styles.residentName}>{item.name}</Text>
        <Text style={styles.residentLevel}>{item.level}</Text>
        <Text style={styles.residentSpecialty}>{item.specialty}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={residents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  residentLevel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  residentSpecialty: {
    fontSize: 14,
    color: '#888',
  },
}); 