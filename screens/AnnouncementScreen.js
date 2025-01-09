import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function AnnouncementScreen({ navigation }) {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const years = ['2024', '2023', '2022'];
  const months = [
    'All',
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Example announcements data - replace with your actual data
  const announcements = [
    {
      id: 1,
      title: 'Important Update',
      details: 'New guidelines for resident evaluations have been published. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '2024-03-20',
      fullDetails: 'This is the full detailed content of the announcement that will be shown in the details screen. It can contain much more information than the preview.',
    },
    {
      id: 2,
      title: 'Upcoming Workshop',
      details: 'Join us for a special workshop on advanced surgical techniques. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '2024-03-25',
      fullDetails: 'Complete workshop information including schedule, location, and prerequisites will be shown here.',
    },
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const announcementDate = new Date(announcement.date);
    const announcementYear = announcementDate.getFullYear().toString();
    const announcementMonth = months[announcementDate.getMonth() + 1];
    
    return (
      announcementYear === selectedYear &&
      (selectedMonth === 'All' || months[announcementDate.getMonth() + 1] === selectedMonth)
    );
  });

  const Dropdown = ({ title, selected, options, visible, setVisible, onSelect }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{title}: {selected}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  selected === option && styles.selectedOption
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const handleSearch = () => {
    // You can add additional search logic here if needed
    console.log('Searching for:', selectedYear, selectedMonth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filter by:</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownsContainer}>
            <Dropdown
              title="Year"
              selected={selectedYear}
              options={years}
              visible={showYearPicker}
              setVisible={setShowYearPicker}
              onSelect={setSelectedYear}
            />
            <Dropdown
              title="Month"
              selected={selectedMonth}
              options={months}
              visible={showMonthPicker}
              setVisible={setShowMonthPicker}
              onSelect={setSelectedMonth}
            />
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredAnnouncements.map((announcement) => (
          <View key={announcement.id} style={styles.announcementCard}>
            <Text style={styles.title}>{announcement.title}</Text>
            
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => navigation.navigate('AnnouncementDetails', { announcement })}
            >
              <Ionicons name="image-outline" size={50} color="#666" />
              <Text style={styles.imagePlaceholderText}>Tap to view details</Text>
            </TouchableOpacity>
            
            <Text style={styles.date}>
              Posted on: {new Date(announcement.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
        {filteredAnnouncements.length === 0 && (
          <Text style={styles.noResults}>No announcements found for selected period</Text>
        )}
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxHeight: '80%',
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  announcementCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
    width: windowWidth - 60,
    height: 200,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 