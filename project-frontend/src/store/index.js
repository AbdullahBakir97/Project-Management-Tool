import Vue from 'vue';
import Vuex from 'vuex';
import api from '../services/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [],
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      state.tasks.push(task);
    },
    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
  },
  actions: {
    async fetchTasks({ commit }) {
      try {
        const response = await api.get('tasks/');
        commit('setTasks', response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async createTask({ commit }, task) {
      try {
        const response = await api.post('tasks/', task);
        commit('addTask', response.data);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    async updateTask({ commit }, task) {
      try {
        const response = await api.put(`tasks/${task.id}/`, task);
        commit('updateTask', response.data);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
  },
  getters: {
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    },
  },
});