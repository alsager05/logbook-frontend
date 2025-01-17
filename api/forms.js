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
      // First get the form template
      const response = await api.get(`/formTemplates/${id}`);
      console.log('Form template response:', response);
      
      const template = response.data || response;
      
      // Then fetch each field template
      if (template.fieldTemplates && Array.isArray(template.fieldTemplates)) {
        const fieldPromises = template.fieldTemplates.map(fieldId => 
          api.get(`/fieldTemplates/${fieldId}`)
        );
        
        const fieldResponses = await Promise.all(fieldPromises);
        const populatedFields = fieldResponses.map(response => response.data || response);
        
        // Replace the array of IDs with the actual field data
        template.fieldTemplates = populatedFields;
      }

      return template;
    } catch (error) {
      console.error('Error fetching form by id:', error);
      throw error;
    }
  },

  getFieldTemplate: async (id) => {
    try {
      const response = await api.get(`/fieldTemplates/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching field template:', error);
      throw error;
    }
  }
}; 