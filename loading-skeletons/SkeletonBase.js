import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Base Skeleton Component with shimmer animation
 */
export const SkeletonBox = ({ width, height, borderRadius = 8, style }) => {
  const { theme } = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.isDark ? "#374151" : "#E5E7EB",
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton Circle (for avatars)
 */
export const SkeletonCircle = ({ size = 40 }) => {
  return <SkeletonBox width={size} height={size} borderRadius={size / 2} />;
};

/**
 * Skeleton Text Line
 */
export const SkeletonText = ({ width = "100%", height = 16, style }) => {
  return (
    <SkeletonBox width={width} height={height} borderRadius={4} style={style} />
  );
};

/**
 * Skeleton Card
 */
export const SkeletonCard = ({ children, style }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        },
        style,
      ]}>
      {children}
    </View>
  );
};
