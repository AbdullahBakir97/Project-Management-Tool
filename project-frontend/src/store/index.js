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
    timeEntries: [],
    comments: [],
  },
  getters: {
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    },
    timeEntriesByTask: (state) => (taskId) => {
      return state.timeEntries.filter(entry => entry.task === taskId);
    },
    commentsByTask: (state) => (taskId) => {
      return state.comments.filter(comment => comment.task === taskId);
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
    setTimeEntries(state, timeEntries) {
      state.timeEntries = timeEntries;
    },
    addTimeEntry(state, timeEntry) {
      state.timeEntries.push(timeEntry);
    },
    updateTimeEntry(state, updatedTimeEntry) {
      const index = state.timeEntries.findIndex(entry => entry.id === updatedTimeEntry.id);
      if (index !== -1) {
        Vue.set(state.timeEntries, index, updatedTimeEntry);
      }
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    addComment(state, comment) {
      state.comments.push(comment);
    },
    updateComment(state, updatedComment) {
      const index = state.comments.findIndex(comment => comment.id === updatedComment.id);
      if (index !== -1) {
        Vue.set(state.comments, index, updatedComment);
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
    async deleteTask({ commit }, taskId) {
      try {
        await api.delete(`tasks/${taskId}/`);
        commit('deleteTask', taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    async fetchTimeEntries({ commit }) {
      try {
        const response = await api.get('time-entries/');
        commit('setTimeEntries', response.data);
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    },
    async createTimeEntry({ commit }, timeEntry) {
      try {
        const response = await api.post('time-entries/', timeEntry);
        commit('addTimeEntry', response.data);
      } catch (error) {
        console.error('Error creating time entry:', error);
      }
    },
    async updateTimeEntry({ commit }, timeEntry) {
      try {
        const response = await api.put(`time-entries/${timeEntry.id}/`, timeEntry);
        commit('updateTimeEntry', response.data);
      } catch (error) {
        console.error('Error updating time entry:', error);
      }
    },
    async fetchComments({ commit }) {
      try {
        const response = await api.get('comments/');
        commit('setComments', response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async createComment({ commit }, comment) {
      try {
        const response = await api.post('comments/', comment);
        commit('addComment', response.data);
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    },
    async updateComment({ commit }, comment) {
      try {
        const response = await api.put(`comments/${comment.id}/`, comment);
        commit('updateComment', response.data);
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    },
  },
});