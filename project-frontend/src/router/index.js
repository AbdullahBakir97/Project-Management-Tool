import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';
import TaskBoard from '../components/TaskBoard.vue';

Vue.use(Router);

const routes = [
  { path: '/login', component: Login },
  { path: '/tasks', component: TaskBoard, meta: { requiresAuth: true } },
];

const router = new Router({
  mode: 'history',
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
