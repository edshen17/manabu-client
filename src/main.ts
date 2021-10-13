import axios from 'axios';
import urljoin from 'url-join';
import vClickOutside from 'v-click-outside';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import VueWindowSize from 'vue-window-size';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import './assets/css/tailwind.css';
import { i18n } from './plugins/i18n';
import { vuetify } from './plugins/vuetify/vuetify';
import { router } from './router';
import { store } from './store/index';

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
const API_HOST = '/api/v1';
const myMixin = {
  computed: {
    isMobile: {
      get(): boolean {
        return (this as any).windowWidth < 760;
      },
    },
  },
};

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
Vue.config.errorHandler = (err, vm, info) => {
  return err;
};
Vue.use(VueCookies);
Vue.$cookies.config('7d');
Vue.use(vClickOutside);
Vue.use(VueWindowSize);
Vue.mixin(myMixin);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
