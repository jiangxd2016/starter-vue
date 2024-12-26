import { createApp } from 'vue';

import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';

import App from './App.vue';

import '@unocss/reset/tailwind.css';
import 'uno.css';
import '@arco-design/web-vue/dist/arco.css';

import './styles/main.css';
import './styles/reset.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(globalComponents);

app.mount('#app');
