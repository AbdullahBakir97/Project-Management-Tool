import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export default new Vuex.Store({
  state: {
    projects: [],
    tasks: [],
    timeEntries: [],
    comments: [],
    user: null,
    authToken: localStorage.getItem('authToken') || null,
  },
  getters: {
    projects: state => state.projects,
    tasksByStatus: state => status => {
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
    setUser(state, user) {
      state.user = user;
    },
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
    setProjects(state, projects) {
      state.projects = projects;
    },
    addProject(state, project) {
      state.projects.push(project);
    },
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
    addFile(state, file) {
      state.files.push(file);
    },
    setFiles(state, files) {
      state.files = files;
    },
    setTimeEntries(state, timeEntries) {
      if (!Array.isArray(timeEntries)) {
        console.error('Invalid timeEntries data:', timeEntries);
        return;
      }
      state.timeEntries = timeEntries;
    },
    (method) setTimeEntries((state: {
      projects: any[];
      tasks: any[];
      timeEntries: any[];
      comments: any[];
      user: any;
      authToken: string;
    }, timeEntries: any): void
    addTimeEntry(state, timeEntry) {
      state.timeEntries.push(timeEntry);
    },
    updateTimeEntry(state, updatedTimeEntry) {
      const index = state.timeEntries.findIndex(entry => entry.id === updatedTimeEntry.id);
      if (index !== -1) {
        Vue.set(state.timeEntries, index, updatedTimeEntry);
      }
    },
    setEvents(state, events) {
      state.events = events;
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
    async login({ commit }, credentials) {
      const response = await axios.post('http://localhost:8000/auth/token/login/', credentials);
      commit('setAuthToken', response.data.auth_token);
      await this.dispatch('fetchUser');
    },
    async logout({ commit }) {
      await axios.post('http://localhost:8000/auth/token/logout/');
      commit('clearAuthToken');
      commit('setUser', null);
    },
    async fetchUser({ commit }) {
      const response = await api.get('auth/users/me/');
      commit('setUser', response.data);
    },
    async fetchProjects({ commit }) {
      const response = await api.get('projects/');
      commit('setProjects', response.data);
    },
    async createProject({ commit }, projectData) {
      const response = await api.post('projects/', projectData);
      commit('addProject', response.data);
    },
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
    async uploadFile({ commit }, formData) {
      const response = await api.post('/files/', formData);
      commit('addFile', response.data);
    },
    async fetchFiles({ commit }, taskId) {
      const response = await api.get(`/files/?task=${taskId}`);
      commit('setFiles', response.data);
    },
    async fetchEvents({ commit }) {
      const response = await api.get('/events/');
      commit('setEvents', response.data);
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