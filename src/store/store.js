// import Vue from 'vue';
// import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
// import i18n, { selectedLocale } from '@/plugins/i18n';
// import SecureLS from 'secure-ls';
// import SecureLsConfig from '../config/secureLs.config';
// import dayjs from 'dayjs';
// const dayJsLocales = {
//   ja: () => import('dayjs/locale/ja'),
//   en: () => import('dayjs/locale/en'),
// };

// function loadLocale(locale) {
//   dayJsLocales[locale]().then(() => dayjs.locale(locale));
// }

// // get query string
// function getParameterByName(name, url = window.location.href) {
//   name = name.replace(/[\[\]]/g, '\\$&');
//   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//     results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return '';
//   return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

// loadLocale(selectedLocale);

// dayjs.locale(selectedLocale); // set original locale
// const ls = new SecureLS(SecureLsConfig);
// Vue.use(Vuex);

// //init store
// const store = new Vuex.Store({
//   state: {
//     user: {
//       data: {
//         settings: {
//           currency: 'SGD',
//           locale: selectedLocale,
//         },
//       },
//       isLoggedIn: false,
//     },
//     deviceData: {
//       isMobile: false,
//     },
//     sharedVue: {
//       computed: {
//         encodedQueryParams: getParameterByName('state'),
//       },
//     },
//   },
//   mutations: {
//     setUserData(state, userData) {
//       state.user.data = userData;
//     },
//     setUserSettings(state, settings) {
//       state.user.data.settings = settings;
//     },
//     setLoggedIn(state, loggedIn) {
//       state.user.isLoggedIn = loggedIn;
//     },
//     setIsMobile(state, isMobile) {
//       state.deviceData.isMobile = isMobile;
//     },
//     setLocale(state, newLocale) {
//       if (state.user.data) {
//         state.user.data.settings.locale = newLocale;
//       }
//     },
//     setEncodedQueryParams(state, newParamObj) {
//       // encode given object in base 64
//       state.sharedVue.computed.encodedQueryParams = window.btoa(JSON.stringify(newParamObj));
//     },
//   },
//   getters: {
//     userData: (state) => {
//       return state.user.data;
//     },
//     isLoggedIn: (state) => {
//       return state.user.isLoggedIn;
//     },
//     isMobile: (state) => {
//       return state.deviceData.isMobile;
//     },
//     locale: (state) => {
//       if (state.user.data && state.user.data.settings) {
//         return state.user.data.settings.locale || selectedLocale; // or statement to account for if db locale empty
//       } else {
//         return selectedLocale;
//       }
//     },
//     sharedVue: (state) => {
//       return state.sharedVue;
//     },
//     encodedQueryParams: (state) => {
//       return state.sharedVue.computed.encodedQueryParams;
//     },
//     decodedQueryParams: (state, getters) => {
//       let decodedObj;
//       try {
//         decodedObj = JSON.parse(atob(getters.encodedQueryParams));
//       } catch (err) {
//         decodedObj = {};
//       }

//       return decodedObj;
//     },
//   },
//   actions: {
//     changeLocale({ commit }, newLocale) {
//       i18n.locale = newLocale; // important!
//       require(`dayjs/locale/${newLocale}`); // require again in case not required
//       dayjs.locale(newLocale); // change dayjs locale
//       commit('setLocale', newLocale);
//     },
//   },
//   plugins: [
//     createPersistedState({
//       key: 'metaData',
//       storage: {
//         getItem: (key) => {
//           ls.get(key);
//         },
//         setItem: (key, value) => ls.set(key, value),
//         removeItem: (key) => ls.remove(key),
//       },
//     }),
//   ],
// });

// export default store;
