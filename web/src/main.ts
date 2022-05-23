import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import 'vue-multiselect/dist/vue-multiselect.css';
import './tailwind-include.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia)
app.use(router);
app.mount('#app');
