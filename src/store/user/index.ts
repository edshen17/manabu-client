import { locale } from '@/plugins/i18n';
import { Module } from 'vuex';
import { RootState } from '../types';
import { actions } from './actions';
import { mutations } from './mutations';
import { UserState } from './types';

const state: UserState = {
  isLoggedIn: false,
  userData: {
    settings: {
      currency: 'SGD',
      locale,
    },
  },
  isMobile: false,
};

export const user: Module<UserState, RootState> = {
  state,
  actions,
  mutations,
};
