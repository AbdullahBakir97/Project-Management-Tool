import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Change this to your actual API base URL
});

export default {
  state: {
    authToken: localStorage.getItem('authToken') || null,
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
    },
    clearAuthToken(state) {
      state.authToken = null;
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await api.post('auth/login/', credentials);
        commit('setAuthToken', response.data.key);
      } catch (error) {
        console.error('Error logging in:', error);
        throw error; // Propagate the error to the caller for handling
      }
    },
    async logout({ commit }) {
      try {
        await api.post('auth/logout/');
        commit('clearAuthToken');
      } catch (error) {
        console.error('Error logging out:', error);
        throw error; // Propagate the error to the caller for handling
      }
    },
  },
};