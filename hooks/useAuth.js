import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      console.log('Attempting login with:', { username });
      const response = await authService.login(username, password);
      console.log('Login response:', response);
      return response;
    },
    onSuccess: async (data) => {
      console.log('Login successful:', data);
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
      await AsyncStorage.removeItem('token');
    },
    onSuccess: () => {
      // Clear all queries from the cache
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
} 