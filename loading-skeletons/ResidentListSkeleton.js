import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  SkeletonText,
  SkeletonCard,
  SkeletonCircle,
  SkeletonBox,
} from "./SkeletonBase";

export const ResidentListSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView
      style={themedStyles.container}
      contentContainerStyle={themedStyles.scrollContent}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i}>
          <View style={themedStyles.residentCard}>
            {/* Avatar */}
            <SkeletonCircle size={64} />

            {/* Resident Details */}
            <View style={themedStyles.residentContent}>
              <SkeletonText width="70%" height={18} />
              <SkeletonText width="50%" height={14} style={{ marginTop: 6 }} />

              {/* Stats */}
              <View style={themedStyles.statsRow}>
                <SkeletonText width="40%" height={12} />
                <SkeletonText
                  width="35%"
                  height={12}
                  style={{ marginLeft: 16 }}
                />
              </View>
            </View>

            {/* Chevron */}
            <SkeletonBox width={24} height={24} borderRadius={12} />
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
    residentCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    residentContent: {
      flex: 1,
    },
    statsRow: {
      flexDirection: "row",
      marginTop: 10,
    },
  });
