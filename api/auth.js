import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  login: async (data) => {
    try {
      console.log('Attempting login with:', data);
      const response = await api.post('/users/login', data);
      
      console.log('Login response:', response);

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the logout request fails
      throw error;
    }
  },

  checkToken: async () => {
    const token = await AsyncStorage.getItem('token');
   if(token){
    return true;
   }
   return false;  
  },

  changePassword: async (data) => {
    try {
      console.log('Changing password for user:', data);
      // const token = await AsyncStorage.getItem('token');
      // console.log('Token:', token);
      // const user = jwtDecode(token);
      // console.log('User:', user);
      const response = await api.put('/users/change-password', 
        data,
       
      );
      
      console.log('Change password response:', response);

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Change password error:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      throw error;
    }
  }
}; 