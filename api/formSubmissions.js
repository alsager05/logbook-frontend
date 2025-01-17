import api from './axios';

export const formSubmissionsService = {
  submitForm: async (submissionData) => {
    try {
      const response = await api.post('/formSubmitions', submissionData);
      return response;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  getResidentSubmissions: async () => {
    try {
      const response = await api.get('/formSubmitions/resident');
      return response;
    } catch (error) {
      console.error('Error fetching resident submissions:', error);
      throw error;
    }
  },
}; 