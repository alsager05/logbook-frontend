import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      // Store the token
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      // Clear the token
      await AsyncStorage.removeItem('token');
    } catch (error) {
      throw error;
    }
  }
}; 