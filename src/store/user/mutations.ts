import { MutationTree } from 'vuex';
import { UserState } from './types';

export const mutations: MutationTree<UserState> = {
  SET_USER(state, payload: UserState): void {
    state.isLoggedIn = true;
    state.userData = payload;
  },
  SET_USER_DATA_PROMISE(state, promise: Promise<any>): void {
    state.userPromise = promise;
  },
  SET_USER_LOCALE(state, newLocale: string): void {
    state.userData.settings.locale = newLocale;
  },
};
