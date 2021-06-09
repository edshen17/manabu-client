import { MutationTree } from 'vuex';
import { UserState } from './types';

export const mutations: MutationTree<UserState> = {
  SET_USER(state, payload: UserState) {
    state.isLoggedIn = true;
    state.userData = payload;
  },
  SET_USER_DATA_PROMISE(state, promise: Promise<any>) {
    state.userPromise = promise;
  },
};
