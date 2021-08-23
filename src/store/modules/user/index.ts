import { Module } from 'vuex';
import { locale } from '@/plugins/i18n';
import { UserEntityState, USER_ENTITY_STATE } from './types';
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
  entityStateName: USER_ENTITY_STATE.NAME,
  entityStateEndpoint: USER_ENTITY_STATE.ENDPOINT,
};

const user: Module<UserEntityState, IRootState> = {
  state: userEntityState,
  actions: userModuleActions,
  mutations: userModuleMutations,
};

export { user, userEntityState };
