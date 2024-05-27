import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import api from './services/api';

const app = createApp(App);

app.config.globalProperties.$http = api; // Register Axios globally

app.use(store);
app.use(router);
app.mount('#app');