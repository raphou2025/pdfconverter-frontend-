import api from './api';

export const translateService = {
  translateText: async (text, sourceLang, targetLang) => {
    const response = await api.post('/translate', { text, sourceLang, targetLang });
    return response.data;
  }
};