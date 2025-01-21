import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Image 
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// API client setup
const api = axios.create({
  baseURL: 'http://192.168.8.147:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function AnnouncementScreen({ navigation }) {
  const { colors } = useTheme();
  
  // Fetch announcements using React Query
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const response = await api.get('/announcements/');
        console.log('Announcements:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching announcements:', err);
        throw new Error(err.message);
      }
    }
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {announcements?.map((announcement) => (
        <TouchableOpacity
          key={announcement._id}
          style={[styles.card, { 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }]}
          onPress={() => navigation.navigate('AnnouncementDetailsScreen', {
            announcementId: announcement._id,
            title: announcement.title
          })}
        >
          {announcement.file ? (
            <Image
              source={{ uri: `${api.defaults.baseURL}/uploads/${announcement.file}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: colors.card }]}>
              <Ionicons name="newspaper-outline" size={40} color={colors.icon} />
            </View>
          )}
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {announcement.title}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {new Date(announcement.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 200,
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }
}); 