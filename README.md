# Project Management Tool

This is a project management application built with Django and Vue.js. It offers a comprehensive set of features to facilitate efficient project planning, task management, team collaboration, and productivity tracking.

## Features

1. **Task Boards**
   - Implement a Kanban-style task board for organizing tasks into different stages (e.g., To Do, In Progress, Done).
   - Users can create tasks, assign them to team members, and move them between stages.

2. **Gantt Charts**
   - Integrate a Gantt chart component to visualize project timelines, task dependencies, and milestones.
   - Enable users to drag and drop tasks to adjust schedules and manage project timelines effectively.

3. **Time Tracking**
   - Provide features for tracking time spent on tasks and projects.
   - Users can start/stop timers, manually log time entries, and view reports to analyze time usage and productivity.

4. **Team Collaboration**
   - Enable collaboration among team members by allowing them to comment on tasks, mention others, and receive notifications for updates.
   - Implement user roles and permissions to control access to project data and ensure privacy.

5. **User Authentication and Authorization**
   - Implement user authentication to secure access to the application.
   - Define different user roles (e.g., admin, project manager, team member) with varying levels of permissions to ensure data security and integrity.

6. **Project and Task Management**
   - Provide functionality for creating and managing projects, setting project goals and deadlines, and organizing tasks within projects.
   - Users can prioritize tasks, set due dates, and track progress towards project milestones.

7. **File Upload and Sharing**
   - Allow users to upload and share files related to projects and tasks.
   - Implement version control to track changes and revisions, ensuring data integrity and collaboration efficiency.

8. **Calendar Integration**
   - Integrate a calendar view to visualize project deadlines, milestones, and team availability.
   - Users can schedule meetings, appointments, and project-related events directly within the application.

9. **Reporting and Analytics**
   - Generate reports and analytics to track project progress, identify bottlenecks, and measure team productivity.
   - Include charts and graphs to visualize data, making it easier for users to understand and interpret project metrics.

10. **Notifications and Reminders**
    - Implement email notifications, in-app alerts, and reminders to keep users informed about important updates, upcoming deadlines, and assigned tasks.

## Installation

### Backend (Django)

1. Clone the repository:

   ```
   git clone https://github.com/AbdullahBakir97/Project-Management-Tool.git
   cd Project-Management-Tool/backend
   ```
2.	Create a virtual environment and activate it:
   
   ```
   python -m venv venv
   source venv/bin/activate  
   # On Windows use `venv\Scripts\activate`
   ```
3.	Install the required packages:

   ```
   pip install -r requirements.txt
   ```
4.	Apply the migrations:

   ```
   python manage.py migrate
   ```
5.	Create a superuser:

   ```
   python manage.py createsuperuser
   ```
6.	Start the development server:

   ```
   python manage.py runserver
   ```

### Frontend (Vue.js)

1.	Navigate to the frontend directory:

   ```
   cd ../project-frontend
   ```
2.	Install the required packages:

   ```
   npm install
   ```
3.	Start the development server:

   ```
   npm run serve
   ```

## Usage

- Access the Django admin panel at http://localhost:8000/admin to manage users and data.
- Access the frontend application at http://localhost:8080 to start using the project management tool.

## Configuration

### Vue.js and Axios Setup

Ensure that your Vue.js application correctly handles the authentication tokens and communicates with the Django backend.

1.	Axios Instance Setup:
- Create an Axios instance with the base URL of your Django backend API.
```vue
import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:8000/api',  // Change this to your actual API base URL
});

export default api;
```

2.	Vuex Store Configuration:
- Set up Vuex for state management, including handling authentication tokens.
```vue
import { createStore } from 'vuex';
   import api from '../service/api';
   
   const store = createStore({
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
         const response = await api.post('auth/token/login/', credentials);
         commit('setAuthToken', response.data.auth_token);
         await this.dispatch('fetchUser');
       },
       async logout({ commit }) {
         await api.post('auth/token/logout/');
         commit('clearAuthToken');
       },
       async fetchUser({ commit }) {
         const response = await api.get('auth/users/me/');
         commit('setUser', response.data);
       },
     },
     getters: {
       isAuthenticated: state => !!state.authToken,
     },
   });
   
   export default store;
```
3.	Router Configuration:
- Set up route guards to protect authenticated routes.

```vue
   import { createRouter, createWebHistory } from 'vue-router';
   import Login from '../components/LoginUser.vue';
   import TaskBoard from '../components/TaskBoard.vue';
   import store from '../store';
   
   const routes = [
     { path: '/', redirect: '/login' },
     { path: '/login', component: Login },
     { path: '/tasks', component: TaskBoard, meta: { requiresAuth: true } },
   ];
   
   const router = createRouter({
     history: createWebHistory(),
     routes,
   });
   
   router.beforeEach((to, from, next) => {
     const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
     const isAuthenticated = store.getters.isAuthenticated;
   
     if (requiresAuth && !isAuthenticated) {
       next('/login');
     } else {
       next();
     }
   });
   
   export default router;
```

4.	Main Entry File:
- Integrate the Vuex store and Vue Router into your Vue application.
   
```vue
   import { createApp } from 'vue';
   import App from './App.vue';
   import store from './store';
   import router from './router';
   import api from './service/api';
   
   const app = createApp(App);
   
   app.use(store);
   app.use(router);
   
   // Attach axios instance to the global properties
   app.config.globalProperties.$http = api;
   
   app.mount('#app');
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
