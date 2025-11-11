import api from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);

      if (response.data?.token) {
        await AsyncStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove the token even if the logout request fails
      throw error;
    }
  },

  checkToken: async () => {
    const token = await AsyncStorage.getItem("token");
    // console.log("token is this one", token);
    if (token) {
      return true;
    }
    return false;
  },

  changePassword: async (data) => {
    try {
      // const token = await AsyncStorage.getItem('token');
      // console.log('Token:', token);
      // const user = jwtDecode(token);
      // console.log('User:', user);
      const response = await api.put("/users/change-password", data);

      if (response.token) {
        await AsyncStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      console.error("Change password error:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });
      throw error;
    }
  },

  getTutorList: async () => {
    try {
      const response = await api.get("/users/tutor-list");
      return response.data;
    } catch (error) {
      console.error("Error fetching tutors:", error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return null;
      }

      const decodedUser = jwtDecode(token);

      // console.log("decodedUser is this one", decodedUser);
      return {
        id: decodedUser.id,
        username: decodedUser.username,
        role: decodedUser.role || "UNKNOWN",
      };
    } catch (error) {
      console.error("Error in getUser:", error);
      return null;
    }
  },

  register: async (formData) => {
    try {
      const response = await api.post("/users/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
};
