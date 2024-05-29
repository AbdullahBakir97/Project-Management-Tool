import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import api from './service/api';

const app = createApp(App);

app.config.globalProperties.$http = api;

app.use(store);
app.use(router);
app.mount('#app');