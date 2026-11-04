import api from './api';
import { localizeError } from '../utils/localizeError';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password, preferredLanguage) => {
    const response = await api.post('/auth/register', { name, email, password, preferredLanguage });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  }
};

export const getAuthErrorMessage = (error, fallback, t) => {
  if (error.response?.data?.message) {
    return localizeError(error.response.data.message, t);
  }
  if (error.request) {
    return t('auth.cannotReachServer');
  }
  return error.message || fallback;
};