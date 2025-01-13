import api from './axios';

export const formsService = {
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
  }
}; 