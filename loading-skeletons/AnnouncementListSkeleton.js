import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SkeletonBox, SkeletonText, SkeletonCard } from "./SkeletonBase";

export const AnnouncementListSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView
      style={themedStyles.container}
      contentContainerStyle={themedStyles.scrollContent}>
      {/* Filter Section Skeleton */}
      <View style={themedStyles.filterSection}>
        <SkeletonBox width={120} height={40} borderRadius={8} />
        <SkeletonBox width={120} height={40} borderRadius={8} />
      </View>

      {/* Announcements Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i}>
          <View style={themedStyles.announcementCard}>
            {/* Image */}
            <SkeletonBox
              width="100%"
              height={180}
              borderRadius={8}
              style={{ marginBottom: 12 }}
            />

            {/* Content */}
            <SkeletonText width="80%" height={20} />
            <SkeletonText width="95%" height={14} style={{ marginTop: 8 }} />
            <SkeletonText width="90%" height={14} style={{ marginTop: 4 }} />
            <SkeletonText width="40%" height={12} style={{ marginTop: 12 }} />
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
    filterSection: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    announcementCard: {
      width: "100%",
    },
  });
