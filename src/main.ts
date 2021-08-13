// import Vue from 'vue';
// import App from './App.vue';
// import router from './router/routes';
// import { BootstrapVue, BIconPatchCheckFll, BIconPatchMinusFll } from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
// import VueCookies from 'vue-cookies';
// import PortalVue from 'portal-vue';
// import VueScrollTo from 'vue-scrollto';
// import VueQuillEditor from 'vue-quill-editor';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
// import axios from 'axios';
// import VueMask from 'v-mask';
// import i18n from './plugins/i18n';
// import store from './store/store';
// Vue.use(VueMask);

// const quillToolbarOptions = {
//   modules: {
//     toolbar: [['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }], [], ['clean']],
//   },
// };

// Vue.use(PortalVue);
// Vue.use(VueCookies);
// Vue.component('BIconPatchCheckFll', BIconPatchCheckFll);
// Vue.component('BIconPatchMinusFll', BIconPatchMinusFll);
// Vue.$cookies.config('7d');
// Vue.use(VueScrollTo);
// Vue.use(VueQuillEditor, quillToolbarOptions);
// Vue.config.productionTip = false;
// Vue.use(BootstrapVue);

// new Vue({
//   created() {
//     const getHTMLTag = document.documentElement;
//     getHTMLTag.setAttribute('lang', i18n.locale);
//   },
//   i18n,
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount('#app');

import Vue from 'vue';
import axios from 'axios';
import { BootstrapVue, BIconPatchCheckFll, BIconPatchMinusFll } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import router from './router';
import store from './store/index';
import i18n from './plugins/i18n';

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};

Vue.component('BIconPatchCheckFll', BIconPatchCheckFll);
Vue.component('BIconPatchMinusFll', BIconPatchMinusFll);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
