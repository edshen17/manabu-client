import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { plugins } from './plugins';
import { RootState } from './types';
import { user } from './user';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  modules: {
    user
  },
  plugins
};

export default new Vuex.Store<RootState>(store);
