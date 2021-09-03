import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './abstractions/IRootState';
import { user } from './modules/user';
import { plugins } from './plugins';

Vue.use(Vuex);

const _store: StoreOptions<IRootState> = {
  state: {},
  modules: {
    user,
  },
  plugins,
};

const store = new Vuex.Store<IRootState>(_store);

export { store };
