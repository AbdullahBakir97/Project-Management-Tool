// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginUser.vue';
import TaskBoard from '../components/TaskBoard.vue';
import store from '../store';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/tasks',
    component: TaskBoard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!store.state.authToken;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;