import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  SkeletonBox,
  SkeletonText,
  SkeletonCard,
  SkeletonCircle,
} from "./SkeletonBase";

export const ProfileSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      {/* Profile Header Skeleton */}
      <View style={themedStyles.header}>
        <SkeletonCircle size={100} />
        <SkeletonText width="60%" height={24} style={{ marginTop: 16 }} />
        <SkeletonText width="40%" height={16} style={{ marginTop: 8 }} />
      </View>

      {/* Profile Info Section */}
      <View style={themedStyles.section}>
        <SkeletonText width="40%" height={20} style={{ marginBottom: 12 }} />
        <SkeletonCard>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={themedStyles.infoRow}>
              <SkeletonText width="30%" height={14} />
              <SkeletonText width="50%" height={16} />
            </View>
          ))}
        </SkeletonCard>
      </View>

      {/* Actions Section */}
      <View style={themedStyles.section}>
        <SkeletonCard>
          {[1, 2, 3].map((i) => (
            <View key={i} style={themedStyles.actionRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <SkeletonBox width={24} height={24} borderRadius={12} />
                <SkeletonText width={120} height={16} />
              </View>
              <SkeletonBox width={24} height={24} borderRadius={12} />
            </View>
          ))}
        </SkeletonCard>
      </View>
    </ScrollView>
  );
};

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    header: {
      alignItems: "center",
      padding: 24,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    section: {
      padding: 16,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
  });
