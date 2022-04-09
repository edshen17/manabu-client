import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from './abstractions/IRootState';
import { makeAppointmentModule } from './modules/appointment';
import { makeContentModule } from './modules/content';
import { makeExchangeRateModule } from './modules/exchangeRate';
import { makePackageTransactionModule } from './modules/packageTransaction';
import { makeUserModule } from './modules/user';
import { plugins } from './plugins';

Vue.use(Vuex);

const _store: StoreOptions<IRootState> = {
  state: {},
  modules: {
    user: makeUserModule,
    exchangeRate: makeExchangeRateModule,
    appointment: makeAppointmentModule,
    packageTransaction: makePackageTransactionModule,
    content: makeContentModule,
  },
  plugins,
};

const store = new Vuex.Store<IRootState>(_store);

export { store };
