import { locale } from '@/plugins/i18n';
import { IRootState } from '@/store/abstractions/IRootState';
import { Module } from 'vuex';
import { userModuleActions } from './actions';
import { userModuleGetters } from './getters';
import { userModuleMutations } from './mutations';
import { UserEntityState } from './types';

const userEntityState: UserEntityState = {
  entityStateData: {
    settings: {
      currency: 'SGD',
      locale,
    },
  },
};

const user: Module<UserEntityState, IRootState> = {
  state: userEntityState,
  actions: userModuleActions,
  mutations: userModuleMutations,
  getters: userModuleGetters,
  namespaced: true,
};

export { user, userEntityState };
