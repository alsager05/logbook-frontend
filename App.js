import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { InstitutionProvider } from "./contexts/InstitutionContext";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { authService } from "./api/auth";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import MainDrawer from "./navigation/MainDrawer";

const AuthStack = createStackNavigator();
const queryClient = new QueryClient();

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userId, setUserId] = useState(null);
  const { theme, isDark } = useTheme();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      if (data.requirePasswordChange) {
        setRequirePasswordChange(true);
        setUserId(data.userId);
      } else {
        const userRole = data.user?.role[0] || data.role[0];
        setRole(userRole.toUpperCase());
        setIsLoggedIn(true);
      }
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login"
      );
    },
  });

  const handleLogin = async (username, password, selectedRole) => {
    if (!username?.trim() || !password?.trim() || !selectedRole) {
      Alert.alert(
        "Error",
        "Please enter username, password, and select a role"
      );
      return;
    }

    loginMutation({
      username: username.trim(),
      password: password.trim(),
      selectedRole,
    });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setRole("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkToken = async () => {
    const token = await authService.checkToken();
    console.log("We Are here ");

    if (token) {
      const user = await authService.getUser();
      setIsLoggedIn(token);
      setRole(user.role[0].toUpperCase());
    }
  };

  useEffect(() => {
    checkToken();
  }, [isLoggedIn]);

  if (requirePasswordChange) {
    return (
      <ChangePasswordScreen
        userId={userId}
        onPasswordChanged={() => {
          setRequirePasswordChange(false);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={handleLogin}
                isLoggingIn={isPending}
              />
            )}
          </AuthStack.Screen>
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <>
      <StatusBar style={theme.statusBarStyle} />
      <NavigationContainer>
        <MainDrawer handleLogout={handleLogout} />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InstitutionProvider>
          <AppContent />
        </InstitutionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const Colors = {
  primary: "#000000",
  background: "#FFFFFF",
  text: "#000000",
  textLight: "#666666",
  border: "#CCCCCC",
  inactive: "#888888",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
