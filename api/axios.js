import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create axios instance with default config
const api = axios.create({
  // Update this to your actual API endpoint
  baseURL: 'http://192.168.221.31:8000', // Changed from 8081 to 8000 to match your backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Axios Interceptor Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response; // Return the full response, not just response.data
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;
