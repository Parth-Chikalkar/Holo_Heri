import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/holoheri/`, // Set your common base URL here

});

export default api;