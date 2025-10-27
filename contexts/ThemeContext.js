import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const lightTheme = {
  // Background colors
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceVariant: "#f8fafc",

  // Text colors
  text: "#1e293b",
  textSecondary: "#64748b",
  textLight: "#94a3b8",

  // Primary colors
  primary: "#4F46E5",
  primaryLight: "#6366f1",
  primaryDark: "#3730a3",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Border and divider colors
  border: "#e2e8f0",
  divider: "#e2e8f0",

  // Card and container colors
  card: "#FFFFFF",
  cardBorder: "#e2e8f0",

  // Input colors
  input: "#FFFFFF",
  inputBorder: "#e2e8f0",
  inputPlaceholder: "#94a3b8",

  // Tab colors
  tabActive: "#4F46E5",
  tabInactive: "#64748b",
  tabBackground: "#FFFFFF",

  // Shadow colors
  shadow: "#000000",

  // Status bar
  statusBarStyle: "dark-content",

  // Modal colors
  modalBackground: "#FFFFFF",
  modalOverlay: "rgba(0, 0, 0, 0.5)",
};

export const darkTheme = {
  // Background colors
  background: "#0f172a",
  surface: "#1e293b",
  surfaceVariant: "#334155",

  // Text colors
  text: "#f8fafc",
  textSecondary: "#cbd5e1",
  textLight: "#94a3b8",

  // Primary colors
  primary: "#6366f1",
  primaryLight: "#8b5cf6",
  primaryDark: "#4f46e5",

  // Status colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Border and divider colors
  border: "#475569",
  divider: "#475569",

  // Card and container colors
  card: "#1e293b",
  cardBorder: "#475569",

  // Input colors
  input: "#334155",
  inputBorder: "#475569",
  inputPlaceholder: "#94a3b8",

  // Tab colors
  tabActive: "#6366f1",
  tabInactive: "#94a3b8",
  tabBackground: "#1e293b",

  // Shadow colors
  shadow: "#000000",

  // Status bar
  statusBarStyle: "light",

  // Modal colors
  modalBackground: "#1e293b",
  modalOverlay: "rgba(0, 0, 0, 0.8)",
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark");
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
