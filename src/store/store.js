import Vue from "vue";

export const store = Vue.observable({
  userData: {},  
});

export const storeMethods = {
  setUserData(userData) {
    store.userData = userData;
  },

  getStore() {
    return store;
  },

  isStoreEmpty() {
    return Object.keys(store.userData).length == 0;
  }
};