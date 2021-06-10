import { ActionTree } from 'vuex';
import axios from 'axios';
import dayjs from 'dayjs';
import { RootState } from '../types';
import { UserState } from './types';
import i18n from '@/plugins/i18n';

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
  async changeUserLocale({ commit }, newLocale: string): Promise<any> {
    i18n.locale = newLocale;
    require(`dayjs/locale/${newLocale}`); // require again in case not required
    dayjs.locale(newLocale);
    commit('SET_USER_LOCALE', newLocale);

    //TODO: make db update request
  },
};
