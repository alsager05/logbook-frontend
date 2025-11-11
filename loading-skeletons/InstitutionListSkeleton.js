import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SkeletonText, SkeletonCard, SkeletonBox } from "./SkeletonBase";

export const InstitutionListSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <View style={themedStyles.container}>
      {/* Search Bar Skeleton */}
      <View style={themedStyles.searchContainer}>
        <SkeletonBox width="100%" height={48} borderRadius={24} />
      </View>

      {/* Institutions List Skeleton */}
      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i}>
            <View style={themedStyles.institutionCard}>
              {/* Logo */}
              <SkeletonBox width={64} height={64} borderRadius={32} />

              {/* Institution Details */}
              <View style={themedStyles.institutionContent}>
                <SkeletonText width="80%" height={20} />
                <SkeletonText
                  width="50%"
                  height={14}
                  style={{ marginTop: 6 }}
                />
                <SkeletonText
                  width="95%"
                  height={14}
                  style={{ marginTop: 8 }}
                />
                <SkeletonText
                  width="85%"
                  height={14}
                  style={{ marginTop: 4 }}
                />
              </View>

              {/* Join Button */}
              <SkeletonBox width={80} height={36} borderRadius={18} />
            </View>
          </SkeletonCard>
        ))}
      </ScrollView>
    </View>
  );
};

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    searchContainer: {
      padding: 16,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    institutionCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    institutionContent: {
      flex: 1,
    },
  });
