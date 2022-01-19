import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './abstractions/IRootState';
import { makeExchangeRateModule } from './modules/exchangeRate';
import { makeUserModule } from './modules/user';
import { plugins } from './plugins';

Vue.use(Vuex);

const _store: StoreOptions<IRootState> = {
  state: {},
  modules: {
    user: makeUserModule,
    exchangeRate: makeExchangeRateModule,
  },
  plugins,
};

const store = new Vuex.Store<IRootState>(_store);

export { store };
