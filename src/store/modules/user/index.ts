import { Module } from 'vuex';
import { locale } from '@/plugins/i18n';
import { UserEntityState } from './types';
import { IRootState } from '@/store/abstractions/IRootState';
import { userModuleActions } from './actions';
import { userModuleMutations } from './mutations';

const state: UserEntityState = {
  entityStateData: {
    settings: {
      currency: 'SGD',
      locale,
    },
  },
  entityStateName: 'USER',
};

const user: Module<UserEntityState, IRootState> = {
  state,
  actions: userModuleActions,
  mutations: userModuleMutations,
};

export { user };
