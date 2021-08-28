import Vue from 'vue';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store/index';
import i18n from './plugins/i18n';
import vuetify from './plugins/vuetify/vuetify';
import './assets/css/tailwind.css';
import urljoin from 'url-join';
const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
const API_HOST = '/api/v1';

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};
axios.interceptors.request.use((config: any) => {
  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = urljoin(API_HOST, config.url);
  }
  return config;
});
axios.defaults.validateStatus = (status: number) => {
  return status >= 200 && status < 300;
};

Vue.config.productionTip = false;
Vue.use(Vuelidate);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
