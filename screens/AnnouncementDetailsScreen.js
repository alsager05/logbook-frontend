import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnnouncementDetailsScreen({ route }) {
  const { announcement } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Ionicons name="image-outline" size={100} color="#666" />
        <Text style={styles.imagePlaceholderText}>Announcement Image</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{announcement.title}</Text>
        <Text style={styles.date}>
          Posted on: {new Date(announcement.date).toLocaleDateString()}
        </Text>
        <Text style={styles.details}>
          {announcement.fullDetails || announcement.details}
        </Text>
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 