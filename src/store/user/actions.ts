import { ActionTree } from 'vuex';
import axios from 'axios';
import { RootState } from '../types';
import { UserState } from './types';

export const actions: ActionTree<UserState, RootState> = {
  async fetchUserData({ state, commit }): Promise<any> {
    const isLoaded = state.userData && state.isLoggedIn;
    if (isLoaded) {
      return state.userData;
    }
    if (state.userPromise) {
      return state.userPromise;
    }
    const userDataPromise: any = await axios.get('/api/me').catch((err) => {
      console.log(err);
    });

    commit('SET_USER_DATA_PROMISE', userDataPromise);

    let payload: UserState = userDataPromise && userDataPromise.data;
    if (payload) {
      commit('SET_USER', payload);
    }
  },
};
