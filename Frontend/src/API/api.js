import axios from 'axios';
import i18n from '../i18n';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api/holoheri/', // Set your common base URL here
});

// Add interceptor to include language parameter in all requests
api.interceptors.request.use((config) => {
  // Get current language from i18n
  const currentLang = i18n.language || 'en';
  
  // Add lang parameter to query string
  config.params = {
    ...config.params,
    lang: currentLang
  };
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;