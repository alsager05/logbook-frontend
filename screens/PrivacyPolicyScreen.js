import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      <View style={themedStyles.policyContainer}>
        <Text style={themedStyles.policyTitle}>Privacy Policy</Text>

        <Text style={themedStyles.sectionTitle}>1. Information We Collect</Text>
        <Text style={themedStyles.policyText}>
          We collect information that you provide directly to us, including your
          name, email address, phone number, and professional credentials. We
          also collect information about your use of our services, including
          form submissions and evaluation data.
        </Text>

        <Text style={themedStyles.sectionTitle}>
          2. How We Use Your Information
        </Text>
        <Text style={themedStyles.policyText}>
          We use the information we collect to provide, maintain, and improve
          our services, to communicate with you, and to monitor and analyze
          trends, usage, and activities in connection with our services.
        </Text>

        <Text style={themedStyles.sectionTitle}>3. Information Sharing</Text>
        <Text style={themedStyles.policyText}>
          We do not share your personal information with third parties except as
          necessary to provide our services, comply with the law, or protect our
          rights. Within the platform, your information may be shared with your
          assigned supervisors and administrators of your institutions.
        </Text>

        <Text style={themedStyles.sectionTitle}>4. Data Security</Text>
        <Text style={themedStyles.policyText}>
          We take reasonable measures to help protect your personal information
          from loss, theft, misuse, unauthorized access, disclosure, alteration,
          and destruction.
        </Text>

        <Text style={themedStyles.sectionTitle}>5. Your Rights</Text>
        <Text style={themedStyles.policyText}>
          You have the right to access, update, or delete your personal
          information at any time. You can do this through your profile settings
          or by contacting us directly.
        </Text>

        <Text style={themedStyles.sectionTitle}>6. Contact Us</Text>
        <Text style={themedStyles.policyText}>
          If you have any questions about this Privacy Policy, please contact us
          at info@kbog.org
        </Text>

        <Text style={themedStyles.lastUpdated}>Last Updated: October 2025</Text>
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
    policyContainer: {
      padding: 20,
    },
    policyTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      color: theme.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 20,
      marginBottom: 12,
      color: theme.text,
    },
    policyText: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "justify",
      color: theme.textSecondary,
      marginBottom: 12,
    },
    lastUpdated: {
      fontSize: 14,
      fontStyle: "italic",
      color: theme.textSecondary,
      marginTop: 24,
      textAlign: "center",
    },
  });
