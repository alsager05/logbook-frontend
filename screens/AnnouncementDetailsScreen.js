import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from "react-native";
import pic from "../assets/annoucement2.jpg";
const { width } = Dimensions.get("window");

const AnnouncementDetailsScreen = ({ route }) => {
  const { announcement } = route.params;

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL: " + url);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  // Format the body text by removing extra whitespace
  const formattedBody = announcement.body
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim() // Remove leading/trailing whitespace
    .split("\n") // Split by newlines
    .map((para) => para.trim()) // Trim each paragraph
    .filter((para) => para) // Remove empty paragraphs
    .join("\n\n") // Join with double newlines for paragraph spacing
    .replace(
      /(https?:\/\/[^\s]+)/g, // Match URLs
      (url) => `[LINK]${url}[/LINK]` // Wrap URLs in link markers
    );

  const segments = formattedBody.split(/(\[LINK\].*?\[\/LINK\])/);

  const renderText = (segments) => {
    return segments.map((segment, index) => {
      if (segment.startsWith("[LINK]") && segment.endsWith("[/LINK]")) {
        const url = segment.slice(6, -7); // Remove [LINK] and [/LINK]
        return (
          <TouchableOpacity key={index} onPress={() => handleLinkPress(url)}>
            <Text style={styles.link}>{url}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index}>{segment}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        {announcement.image ? (
          <Image
            source={{ uri: announcement.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image source={pic} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{announcement.title}</Text>
          <Text style={styles.date}>{announcement.date}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{renderText(segments)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: width,
    height: width * 0.6,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    letterSpacing: 0.3,
    // textAlign: 'justify',  // Added for better text alignment
    paddingHorizontal: 2, // Added small padding for justified text
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

export default AnnouncementDetailsScreen;
