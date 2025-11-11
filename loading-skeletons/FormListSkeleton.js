import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  SkeletonBox,
  SkeletonText,
  SkeletonCard,
  SkeletonCircle,
} from "./SkeletonBase";

export const FormListSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView
      style={themedStyles.container}
      contentContainerStyle={themedStyles.scrollContent}>
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i}>
          <View style={themedStyles.formCard}>
            {/* Form Icon */}
            <SkeletonCircle size={56} />

            {/* Form Details */}
            <View style={themedStyles.formContent}>
              <SkeletonText width="80%" height={18} />
              <SkeletonText width="95%" height={14} style={{ marginTop: 6 }} />
              <SkeletonText width="60%" height={14} style={{ marginTop: 4 }} />

              {/* Stats */}
              <View style={themedStyles.statsRow}>
                <SkeletonText width="30%" height={12} />
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
    formCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    formContent: {
      flex: 1,
    },
    statsRow: {
      flexDirection: "row",
      marginTop: 8,
      gap: 16,
    },
  });
