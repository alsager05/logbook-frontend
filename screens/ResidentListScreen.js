import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResidentListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Example resident data with complete information for all residents
  const residents = [
    { 
      id: 1, 
      name: 'Dr. John Smith',
      level: 'R3',
      email: 'john.smith@hospital.com',
      phone: '+1 (555) 123-4567',
      startDate: 'July 1, 2021',
      expectedCompletion: 'June 30, 2024',
    },
    { 
      id: 2, 
      name: 'Dr. Sarah Johnson',
      level: 'R1',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 234-5678',
      startDate: 'July 1, 2023',
      expectedCompletion: 'June 30, 2026',
    },
    { 
      id: 3, 
      name: 'Dr. Michael Brown',
      level: 'R2',
      email: 'michael.brown@hospital.com',
      phone: '+1 (555) 345-6789',
      startDate: 'July 1, 2022',
      expectedCompletion: 'June 30, 2025',
    },
    { 
      id: 4, 
      name: 'Dr. Emily Davis',
      level: 'R3',
      email: 'emily.davis@hospital.com',
      phone: '+1 (555) 456-7890',
      startDate: 'July 1, 2021',
      expectedCompletion: 'June 30, 2024',
    },
  ];

  // Filter residents based on both name and level in a single search
  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or level (R1, R2, R3)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.buttonsContainer}>
          {filteredResidents.map((resident) => (
            <TouchableOpacity 
              key={resident.id}
              style={styles.button}
              onPress={() => navigation.navigate('ResidentDetails', { resident })}
            >
              <View style={styles.buttonHeader}>
                <Text style={styles.buttonText}>{resident.name}</Text>
                <Text style={styles.levelText}>{resident.level}</Text>
              </View>
              <Text style={styles.subText}>View Progress</Text>
            </TouchableOpacity>
          ))}
          {filteredResidents.length === 0 && (
            <Text style={styles.noResults}>No residents found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchSection: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  buttonsContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    padding: 20,
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
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 