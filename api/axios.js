import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create axios instance with default config
const api = axios.create({
  // Update this to your actual API endpoint
  baseURL: 'http://192.168.2.203:8000', // Replace with your actual backend URL
 

});

// Add request interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request Config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;

    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // console.log('API Response:', {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data
    // });
    return response.data;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('token');
      // You might want to trigger a logout action here

    }
    
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
  }
);

export default api;
