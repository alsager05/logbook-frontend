import api from './axios';

export const formsService = {

  getAllForms: async () => {
    try {
      const response = await api.get('/formTemplates');
      console.log('getAllForms response:', response);
      return response;
    } catch (error) {
      console.error('getAllForms error:', error);
      throw error;
    }
  },

  getPendingForms: async () => {
    try {
      const response = await api.get('/forms/pending');
      return response;
    } catch (error) {
      throw error;
    }
  },

  acceptForm: async (formId) => {
    try {
      const response = await api.post(`/forms/${formId}/accept`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  rejectForm: async (formId) => {
    try {
      const response = await api.post(`/forms/${formId}/reject`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFormById: async (formId) => {
    try {
      console.log('Getting form with ID:', formId);
      const response = await api.get(`/formTemplates/${formId}`);
      // console.log('getFormById response:', response);
      return response;
    } catch (error) {
      console.error('getFormById error:', error);
      throw error;
    }
  }
}; 