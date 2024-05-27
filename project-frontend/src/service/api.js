import axios from 'axios';

const api = {
  get: (url) => axios.get(url),
};

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
      const response = await api.post('auth/login/', credentials);
      commit('setAuthToken', response.data.key);
    },
    async logout({ commit }) {
      await api.post('auth/logout/');
      commit('clearAuthToken');
    },
  },
};