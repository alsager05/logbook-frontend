import api from "./axios";

export const formSubmissionsService = {
  submitForm: async (data) => {
    try {
      const response = await api.post("/formSubmitions", data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to submit form");
    }
  },

  // getResidentSubmissions: async (userId, role = 'resident') => {
  getResidentSubmissions: async () => {
    try {
      // console.log(`Fetching submissions for ${role} with ID:`, userId);
      const response = await api.get(`/formSubmitions`);
      // const response = await api.get(`/formSubmitions/${userId}?role=${role}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  },

  getSubmissionById: async (submissionId) => {
    try {
      const response = await api.get(`/formSubmitions/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching submission:", error);
      throw error;
    }
  },

  updateSubmission: async (submissionId, data) => {
    try {
      const response = await api.put(
        `/formSubmitions/${submissionId}/review`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating submission:", error);
      throw error;
    }
  },

  deleteSubmission: async (submissionId) => {
    try {
      // console.log("Attempting to delete submission with ID:", submissionId);
      const response = await api.delete(`/formSubmitions/${submissionId}`);
      // console.log("Delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting submission:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(
        error.response?.data?.message || "Failed to delete submission"
      );
    }
  },
};
