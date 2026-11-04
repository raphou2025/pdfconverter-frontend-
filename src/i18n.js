import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import km from './locales/km.json';

const savedLanguage = window.localStorage.getItem('appLanguage');
const initialLanguage = savedLanguage === 'km' ? 'km' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km }
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

i18n.on('languageChanged', (language) => {
  const supportedLanguage = language === 'km' ? 'km' : 'en';
  window.localStorage.setItem('appLanguage', supportedLanguage);
  document.documentElement.lang = supportedLanguage;
});

document.documentElement.lang = initialLanguage;

export default i18n;