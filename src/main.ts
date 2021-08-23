import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store/index';
import i18n from './plugins/i18n';
import vuetify from './plugins/vuetify/vuetify';
import './assets/css/tailwind.css';

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
