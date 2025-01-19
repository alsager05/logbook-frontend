import api from './axios';

export const formSubmissionsService = {
  submitForm: async (data) => {
    try {
      const response = await api.post('/formSubmitions', data);
      console.log('Form submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Form submission error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Failed to submit form');
    }
  },

  // getResidentSubmissions: async (userId, role = 'resident') => {
  getResidentSubmissions: async () => {
    try {
      // console.log(`Fetching submissions for ${role} with ID:`, userId);
      const response = await api.get(`/formSubmitions`);
      // const response = await api.get(`/formSubmitions/${userId}?role=${role}`);
      console.log('Submissions responsess:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  getSubmissionById: async (submissionId) => {
    try {
      const response = await api.get(`/formSubmitions/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching submission:', error);
      throw error;
    }
  },

  updateSubmission: async (submissionId, data) => {
    try {
      const response = await api.put(`/formSubmitions/${submissionId}/review`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating submission:', error);
      throw error;
    }
  },
}; 