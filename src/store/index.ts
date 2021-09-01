import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './abstractions/IRootState';
import { user } from './modules/user';
import { plugins } from './plugins';

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
  state: {},
  modules: {
    user,
  },
  plugins,
};

export default new Vuex.Store<IRootState>(store);
