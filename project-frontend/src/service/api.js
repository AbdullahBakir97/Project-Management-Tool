import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django backend URL
});

export default api;