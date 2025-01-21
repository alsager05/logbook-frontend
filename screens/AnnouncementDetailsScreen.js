import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const windowWidth = Dimensions.get('window').width;

export default function AnnouncementDetailsScreen({ route, navigation }) {
  const { announcementId } = route.params || {};
  
  console.log('Opening announcement details:', {
    params: route.params,
    announcementId
  });

  const { data: announcement, isLoading, error } = useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: async () => {
      try {
        const response = await api.get(`/announcements/${announcementId}`);
        console.log('Announcement details:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching announcement:', err);
        throw err;
      }
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  

  return (
    <ScrollView style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {announcement?.file ? (
          <Image 
            source={{ uri: `${api.defaults.baseURL}/uploads/${announcement.file}` }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={80} color="#666" />
            <Text style={styles.noImageText}>No Image Available</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title and Author */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{announcement?.title}</Text>
          <Text style={styles.date}>
            {new Date(announcement?.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>
            {announcement?.body || 'No content available'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: windowWidth,
    height: windowWidth * 0.75,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  bodyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bodyText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  }
}); 