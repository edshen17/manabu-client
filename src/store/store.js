import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

//init store
const store = new Vuex.Store({
    state: {
        user: {
            data: null,
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
         setLoggedIn(state, loggedIn) {
          state.user.isLoggedIn = loggedIn;
        },
        setIsMobile(state, isMobile) {
          state.deviceData.isMobile = isMobile;
        }
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
    }
})

export default store