import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export default new Vuex.Store({
  state: {
    tasks: [],
  },
  getters: {
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    },
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
        Vue.set(state.tasks, index, updatedTask);
      }
    },
    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
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
    async deleteTask({ commit }, taskId) {
      try {
        await api.delete(`tasks/${taskId}/`);
        commit('deleteTask', taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
  },
});