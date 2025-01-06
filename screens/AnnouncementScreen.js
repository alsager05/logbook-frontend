import { View, Text, StyleSheet } from 'react-native';

export default function AnnouncementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  // Add any other styles specific to announcements
}); 