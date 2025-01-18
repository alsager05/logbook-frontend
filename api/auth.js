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

      if (response.data?.token) {
        await AsyncStorage.setItem('token', response.data.token);
        console.log('Token stored successfully');
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
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
      console.log('Decoded user token:', decodedUser);

      // Ensure role is properly set
      return {
        ...decodedUser,
        role: decodedUser.role || 'UNKNOWN'
      };
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  }
}; 