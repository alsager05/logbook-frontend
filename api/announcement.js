import api from "./axios";

export const announcementService = {
  // Get all announcements (global)
  getAllAnnouncements: async () => {
    try {
      const response = await api.get("/announcements");
      return response.data;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  // Get announcements by institution
  getInstitutionAnnouncements: async (institutionId) => {
    try {
      const response = await api.get(
        `/announcements?institutionId=${institutionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching institution announcements:", error);
      throw error;
    }
  },
};

// Legacy export for backward compatibility
export const getAllAnnouncements = announcementService.getAllAnnouncements;
