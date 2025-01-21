import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export const authService = {
  login: async (credentials) => {
    try {
      console.log('Login request:', credentials);
      const response = await api.post('/users/loginUser', credentials);
      console.log('Login response:', response.data);
      
      if (response.data?.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
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
      console.log('Fetching tutors...');
      const response = await api.get('/users/tutor-list');
      console.log('Tutor response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return null;
      }

      const decodedUser = jwtDecode(token);
      console.log('Decoded user:', decodedUser);
      
      return {
        id: decodedUser.id,
        username: decodedUser.username,
        role: decodedUser.roles?.[0] || decodedUser.roles[0] || 'UNKNOWN'
      };
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  }
}; 