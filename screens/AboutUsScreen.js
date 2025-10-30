import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function AboutUsScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.aboutContainer}>
        <Image
          source={require("../assets/kbog-logo.jpg")}
          style={themedStyles.logo}
          resizeMode="contain"
        />
        <Text style={themedStyles.aboutTitle}>
          Kuwait Board of Obstetrics & Gynecology
        </Text>
        <Text style={themedStyles.aboutText}>
          The Kuwait Board of Obstetrics and Gynecology (KBOG) is a prestigious
          medical education program dedicated to training and certifying
          specialists in obstetrics and gynecology in Kuwait. Our mission is to
          provide high-quality medical education and training to ensure the best
          healthcare standards for women in Kuwait.
        </Text>
        <Text style={themedStyles.aboutText}>
          Through our comprehensive training programs, we strive to develop
          competent and compassionate healthcare professionals who are committed
          to excellence in patient care, research, and medical education.
        </Text>
      </View>
    </ScrollView>
  );
}

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    aboutContainer: {
      padding: 20,
      alignItems: "center",
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 24,
    },
    aboutTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: theme.text,
    },
    aboutText: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "justify",
      color: theme.textSecondary,
      marginBottom: 16,
    },
  });
