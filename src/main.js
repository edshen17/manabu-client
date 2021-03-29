import Vue from 'vue'
import App from './App.vue'
import router from './router/routes';
import { BootstrapVue, BIconPatchCheckFll, BIconPatchMinusFll } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueCookies from 'vue-cookies'
import PortalVue from "portal-vue";
import VueScrollTo from 'vue-scrollto';
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios';

axios.defaults.headers.common = {
  "X-Requested-With": "XMLHttpRequest",
};

var toolbarOptions = {
  modules: {
    'toolbar': [
      [ 'bold', 'italic', ],
      [{ 'list': 'ordered' }, { 'list': 'bullet'}],
      [],
      [ 'clean' ]
  ]
  }
}

Vue.use(PortalVue);
Vue.use(VueCookies);
Vue.component('BIconPatchCheckFll', BIconPatchCheckFll)
Vue.component('BIconPatchMinusFll', BIconPatchMinusFll)
Vue.$cookies.config('1d');
Vue.use(VueScrollTo)
Vue.use(VueQuillEditor, toolbarOptions)
Vue.config.productionTip = false
Vue.use(BootstrapVue);



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
