import { Module } from 'vuex';
import { locale } from '@/plugins/i18n';
import { RootState } from '@/store/types';
import { actions } from '@/store/user/actions';
import { mutations } from '@/store/user/mutations';
import { UserState } from '@/store/user/types';

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
