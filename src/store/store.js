import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import i18n, { selectedLocale } from '@/plugins/i18n'
import SecureLS from "secure-ls";
import SecureLsConfig from '../config/secureLs.config';
const ls = new SecureLS(SecureLsConfig);
Vue.use(Vuex);

//init store
const store = new Vuex.Store({
    state: {
        user: {
            data: {
              settings: {
                currency: 'SGD',
                locale: selectedLocale
              }
            },
            isLoggedIn: false,
        },
        deviceData: {
          isMobile: false,
        }
     },
     mutations: {
         setUserData(state, userData) {
             state.user.data = userData;
         },
         setUserSettings(state, settings) {
          state.user.data.settings = settings;
        },
         setLoggedIn(state, loggedIn) {
          state.user.isLoggedIn = loggedIn;
        },
        setIsMobile(state, isMobile) {
          state.deviceData.isMobile = isMobile;
        },
        setLocale(state, newLocale) {
          if (state.user.data) {
            state.user.data.settings.locale = newLocale
          }
        },
     },
     getters: {
      userData: state => {
        return state.user.data;
      },
      isLoggedIn: state => {
        return state.user.isLoggedIn;
      },
      isMobile: state => {
        return state.deviceData.isMobile;
      },
      locale: state => {
        if (state.user.data) {
          return state.user.data.settings.locale;
        }
        else {
          return selectedLocale;
        }
      }, 
    },
    actions: {
      changeLocale({ commit }, newLocale) {
        i18n.locale = newLocale // important!
        commit('setLocale', newLocale)
      }
    },
    plugins: [
      createPersistedState({
        key: 'metaData',
        storage: {
          getItem: key => {
            ls.get(key)
          },
          setItem: (key, value) => ls.set(key, value),
          removeItem: key => ls.remove(key)
        }
      })
    ],
})

export default store