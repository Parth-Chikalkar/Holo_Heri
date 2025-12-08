import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api/holoheri/', // Set your common base URL here

});

export default api;