import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import mrTranslations from './locales/mr.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import knTranslations from './locales/kn.json';

// Get the saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      hi: {
        translation: hiTranslations
      },
      en: {
        translation: enTranslations
      },
      de: {
        translation: deTranslations
      },
      fr: {
        translation: frTranslations
      },
      mr: {
        translation: mrTranslations
      },
      ta: {
        translation: taTranslations
      },
      te: {
        translation: teTranslations
      },
      kn: {
        translation: knTranslations
      }
    },
    lng: savedLanguage, // default language
    fallbackLng: 'en', // fallback language if translation is missing
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

// Save language preference whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
