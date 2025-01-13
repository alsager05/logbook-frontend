import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });
      
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      throw error;
    }
  }
}; 