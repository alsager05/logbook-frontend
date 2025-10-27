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
import { useTheme } from "../contexts/ThemeContext";
const { width } = Dimensions.get("window");

const AnnouncementDetailsScreen = ({ route }) => {
  const { announcement } = route.params;
  const { theme } = useTheme();

  const themedStyles = createThemedStyles(theme);

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
            <Text style={themedStyles.link}>{url}</Text>
          </TouchableOpacity>
        );
      }
      return <Text key={index}>{segment}</Text>;
    });
  };

  return (
    <SafeAreaView style={themedStyles.container}>
      <ScrollView bounces={false}>
        {announcement.image ? (
          <Image
            source={{ uri: announcement.image }}
            style={themedStyles.image}
            resizeMode="cover"
          />
        ) : (
          <Image source={pic} style={themedStyles.image} resizeMode="cover" />
        )}
        <View style={themedStyles.content}>
          <Text style={themedStyles.title}>{announcement.title}</Text>
          <Text style={themedStyles.date}>{announcement.date}</Text>
          <View style={themedStyles.divider} />
          <Text style={themedStyles.body}>{renderText(segments)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    image: {
      width: width,
      height: width * 0.6,
      backgroundColor: theme.card,
    },
    content: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      backgroundColor: theme.card,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },
    date: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 16,
      fontStyle: "italic",
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
      letterSpacing: 0.3,
      // textAlign: 'justify',  // Added for better text alignment
      paddingHorizontal: 2, // Added small padding for justified text
    },
    link: {
      color: theme.primary,
      textDecorationLine: "underline",
    },
  });

export default AnnouncementDetailsScreen;
