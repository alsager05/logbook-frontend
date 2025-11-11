import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SkeletonBox, SkeletonText, SkeletonCard } from "./SkeletonBase";

export const SubmissionListSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView
      style={themedStyles.container}
      contentContainerStyle={themedStyles.scrollContent}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i}>
          <View style={themedStyles.submissionCard}>
            {/* Icon */}
            <SkeletonBox width={48} height={48} borderRadius={24} />

            {/* Content */}
            <View style={themedStyles.submissionContent}>
              <SkeletonText width="70%" height={18} />
              <SkeletonText width="50%" height={14} style={{ marginTop: 6 }} />
              <SkeletonText width="40%" height={12} style={{ marginTop: 8 }} />
            </View>

            {/* Status Badge */}
            <SkeletonBox width={70} height={24} borderRadius={12} />
          </View>
        </SkeletonCard>
      ))}
    </ScrollView>
  );
};

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    scrollContent: {
      padding: 16,
    },
    submissionCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    submissionContent: {
      flex: 1,
    },
  });
