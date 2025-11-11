import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SkeletonBox, SkeletonText, SkeletonCard } from "./SkeletonBase";

export const DashboardSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      {/* Welcome Section Skeleton */}
      <View style={themedStyles.welcomeSection}>
        <SkeletonText width="40%" height={20} />
        <SkeletonText width="60%" height={28} style={{ marginTop: 8 }} />
        <View style={themedStyles.userInfoRow}>
          <SkeletonText width="25%" height={16} />
          <SkeletonText width="25%" height={16} style={{ marginLeft: 16 }} />
        </View>
      </View>

      {/* Stats Section Skeleton */}
      <View style={themedStyles.statsSection}>
        <SkeletonText width="30%" height={20} style={{ marginBottom: 12 }} />
        <View style={themedStyles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} style={themedStyles.statCard}>
              <SkeletonText width="40%" height={32} />
              <SkeletonText width="80%" height={14} style={{ marginTop: 8 }} />
            </SkeletonCard>
          ))}
        </View>
      </View>

      {/* Quick Actions Skeleton */}
      <View style={themedStyles.actionsSection}>
        <SkeletonText width="35%" height={20} style={{ marginBottom: 12 }} />
        <View style={themedStyles.actionsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} style={themedStyles.actionCard}>
              <SkeletonBox width={56} height={56} borderRadius={28} />
              <SkeletonText width="80%" height={16} style={{ marginTop: 12 }} />
              <SkeletonText width="60%" height={12} style={{ marginTop: 6 }} />
            </SkeletonCard>
          ))}
        </View>
      </View>

      {/* Recent Activity Skeleton */}
      <View style={themedStyles.recentSection}>
        <View style={themedStyles.sectionHeader}>
          <SkeletonText width="40%" height={20} />
          <SkeletonText width="20%" height={16} />
        </View>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i}>
            <View style={themedStyles.recentItem}>
              <View style={{ flex: 1 }}>
                <SkeletonText width="70%" height={16} />
                <SkeletonText
                  width="40%"
                  height={14}
                  style={{ marginTop: 6 }}
                />
              </View>
              <SkeletonBox width={60} height={24} borderRadius={12} />
            </View>
          </SkeletonCard>
        ))}
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
    welcomeSection: {
      padding: 20,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder,
    },
    userInfoRow: {
      flexDirection: "row",
      marginTop: 12,
    },
    statsSection: {
      padding: 16,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: "45%",
    },
    actionsSection: {
      padding: 16,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    actionCard: {
      flex: 1,
      minWidth: "45%",
      alignItems: "center",
    },
    recentSection: {
      padding: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    recentItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
  });
