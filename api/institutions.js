import api from "./axios";

export const institutionsService = {
  // Get all institutions (for browsing)
  getAllInstitutions: async () => {
    try {
      const response = await api.get("/institutions/all");

      return response.data || response;
    } catch (error) {
      console.error("Error fetching institutions:", error);
      throw error;
    }
  },

  // Get my institutions
  getMyInstitutions: async () => {
    try {
      const response = await api.get("/institutions/me");
      const institutions = response.data;
      return Array.isArray(institutions) ? institutions : [];
    } catch (error) {
      console.error("Error fetching my institutions:", error);
      throw error;
    }
  },

  // Join institution
  joinInstitution: async (institutionId) => {
    try {
      const response = await api.post(`/institutions/${institutionId}/join`);
      return response.data || response;
    } catch (error) {
      console.error("Error joining institution:", error);
      throw error;
    }
  },

  // Get institution details
  getInstitutionById: async (institutionId) => {
    try {
      const response = await api.get(`/institutions/${institutionId}`);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching institution details:", error);
      throw error;
    }
  },

  // Get institution forms
  getInstitutionForms: async (institutionId) => {
    try {
      const response = await api.get(
        `/formTemplates?institutionId=${institutionId}`
      );
      const forms = response.data || response;
      return Array.isArray(forms) ? forms : [];
    } catch (error) {
      console.error("Error fetching institution forms:", error);
      throw error;
    }
  },

  // Get institution submissions
  getInstitutionSubmissions: async (institutionId) => {
    try {
      const response = await api.get(
        `/formSubmitions?formPlatform=mobile&institutionId=${institutionId}`
      );

      return response.data || response;
    } catch (error) {
      console.error("Error fetching institution submissions:", error);
      throw error;
    }
  },

  // Get tutor's residents in institution
  getMyResidents: async (institutionId) => {
    try {
      const response = await api.get(
        `/users/residents/my-residents?institutionId=${institutionId}`
      );
      return response.data || response;
    } catch (error) {
      console.error("Error fetching my residents:", error);
      throw error;
    }
  },

  // Get resident details with submissions
  getResidentDetails: async (residentId, institutionId) => {
    try {
      const response = await api.get(
        `/users/residents/${residentId}/details?institutionId=${institutionId}`
      );
      return response.data || response;
    } catch (error) {
      console.error("Error fetching resident details:", error);
      throw error;
    }
  },
};
