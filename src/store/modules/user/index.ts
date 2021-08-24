import { Module } from 'vuex';
import { locale } from '@/plugins/i18n';
import { UserEntityState } from './types';
import { IRootState } from '@/store/abstractions/IRootState';
import { userModuleActions } from './actions';
import { userModuleMutations } from './mutations';

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
  namespaced: true,
};

export { user, userEntityState };
