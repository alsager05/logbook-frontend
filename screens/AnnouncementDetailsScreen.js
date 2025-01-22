import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnnouncementDetailsScreen({ route }) {
  const { announcement } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image 
          source={announcement.image}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.date}>{announcement.date}</Text>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.description}>{announcement.description}</Text>
          <Text style={styles.details}>{announcement.details}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 