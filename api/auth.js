import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  login: async (data) => {
    try {
      console.log('Login attempt:', {
        username: data.username,
        role: data.selectedRole
      });

      const response = await api.post('/users/login', {
        username: data.username,
        password: data.password,
        role: data.selectedRole.toUpperCase()
      });
      
      console.log('Login response:', response);

      // Check if response exists
      if (!response) {
        throw new Error('No response from server');
      }

      // Store token if it exists
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }

      // Return the response even if there's no token
      // This allows for different response types based on role
      return {
        token: response.token,
        role: response.role || data.selectedRole.toUpperCase(),
        requirePasswordChange: response.requirePasswordChange,
        userId: response.userId
      };

    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response,
        data: error.data
      });
      throw {
        message: error.message || 'Login failed',
        status: error.status || 500,
        data: error.data
      };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
        console.log("token removed")
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the logout request fails
      throw error;
    }
  },

  checkToken: async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("token",token)
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
  },

  getTutorList: async () => {
    try {
      const response = await api.get('/users/tutor-list');
      console.log('Tutor list response:', response);
      return response;
    } catch (error) {
      console.error('Get tutor list error:', error);
      throw error;
    }
  },

  getUser: async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await jwtDecode(token);  
    console.log('User response:', user);
    return user;
  }
}; 