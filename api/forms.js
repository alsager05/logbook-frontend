import api from './axios';

export const formsService = {
  getAllForms: async () => {
    try {
      const response = await api.get('/formTemplates');
      console.log('Forms response:', response);
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
      console.log('Form template response:', response);
      
      const template = response.data || response;
      
      if (!template) {
        throw new Error('No template data received');
      }

      // Ensure fieldTemplates is always an array
      if (!template.fieldTemplates) {
        template.fieldTemplates = [];
      }

      console.log('Template data:', {
        id: template._id,
        name: template.formName,
        fieldCount: template.fieldTemplates.length,
        fields: template.fieldTemplates.map(f => ({
          id: f._id,
          name: f.name,
          type: f.type,
          section: f.section
        }))
      });

      return template;
    } catch (error) {
      console.error('Error fetching form by id:', error);
      throw error;
    }
  },

  getTutorPendingForms: async (tutorId) => {
    try {
      console.log('Fetching pending forms for tutor:', tutorId);
      const response = await api.get(`/formSubmitions?tutor=${tutorId}&status=pending`);
      console.log('Tutor pending forms response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor pending forms:', error);
      throw error;
    }
  }
}; 