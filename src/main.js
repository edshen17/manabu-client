import Vue from 'vue'
import App from './App.vue'
import router from './router/routes';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies'
import PortalVue from "portal-vue";

Vue.use(PortalVue);
Vue.use(VueCookies);
Vue.$cookies.config('1d')
Vue.use(Vuelidate);

Vue.config.productionTip = false
Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
