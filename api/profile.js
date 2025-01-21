import api from './axios';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  uploadAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageFile.uri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    });

    const response = await api.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}; 