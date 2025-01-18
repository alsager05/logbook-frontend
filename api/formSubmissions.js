import api from './axios';

export const formSubmissionsService = {
  submitForm: async (data) => {
    try {
      console.log('Submitting form with data:', data);
      const response = await api.post('/form-submissions', data);
      console.log('Form submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Form submission error:', error);
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