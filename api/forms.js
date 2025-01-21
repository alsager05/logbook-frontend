import api from './axios';

export const formsService = {
  getAllForms: async () => {
    try {
      const response = await api.get('/formTemplates');
      const formTemplates = response.data || response;
      return Array.isArray(formTemplates) ? formTemplates : [];
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  },

  getFormById: async (id) => {
    try {
      const response = await api.get(`/formTemplates/${id}`);
      
      const template = response.data || response;
      
      if (!template) {
        throw new Error('No template data received');
      }

      // Ensure fieldTemplates is always an array
      if (!template.fieldTemplates) {
        template.fieldTemplates = [];
      }

      

      return template;
    } catch (error) {
      console.error('Error fetching form by id:', error);
      throw error;
    }
  },

  getTutorPendingForms: async (tutorId) => {
    try {
      const response = await api.get(`/formSubmitions?tutor=${tutorId}&status=pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor pending forms:', error);
      throw error;
    }
  }
}; 