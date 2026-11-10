import api from './api';

export const userService = {
  exportAccountData: async () => {
    const response = await api.get('/user/export');
    return response.data;
  },
  updateSettings: async (settings) => {
    const response = await api.put('/user/settings', settings);
    return response.data;
  },
  updatePreferredLanguage: async (preferredLanguage) => {
    return userService.updateSettings({ preferredLanguage });
  },
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/user/profile-picture', formData);
    return response.data;
  },
  removeProfilePicture: async () => {
    const response = await api.delete('/user/profile-picture');
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/user/password', { oldPassword, newPassword });
    return response.data;
  },
  deleteAccount: async (password) => {
    const response = await api.delete('/user/account', { data: { password } });
    return response.data;
  }
};
