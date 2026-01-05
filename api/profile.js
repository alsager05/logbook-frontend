import api from "./axios";

export const profileService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile/me");
      return response.data || response;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      const formData = new FormData();

      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.name) formData.append("name", data.name);
      if (data.image) {
        // Handle image upload for React Native
        const imageData = {
          uri: data.image,
          type: "image/jpeg",
          name: "profile.jpg",
        };
        formData.append("image", imageData);
      }

      const response = await api.put("/users/profile/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data || response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Delete account (soft delete)
  deleteAccount: async (password) => {
    try {
      const response = await api.delete("/users/profile/me", {
        data: { password },
      });
      return response.data || response;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
};
