import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginUser.vue';
import TaskBoard from '../components/TaskBoard.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Add this line to redirect root to login
  { path: '/login', component: Login },
  { path: '/tasks', component: TaskBoard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;