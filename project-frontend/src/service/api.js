import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Set the token on the instance
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;