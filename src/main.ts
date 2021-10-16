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

const myMixin = {
  computed: {
    isMobile: {
      get(): boolean {
        return (this as any).windowWidth < 760;
      },
    },
  },
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
