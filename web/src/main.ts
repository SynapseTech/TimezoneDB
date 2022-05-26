import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import 'vue-multiselect/dist/vue-multiselect.css';
import './tailwind-include.css';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";

const app = createApp(App);
library.add(fas, fab);
app.component("font-awesome-icon", FontAwesomeIcon);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia)
app.use(router);
app.mount('#app');
