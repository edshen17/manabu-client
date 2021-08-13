import { ActionTree } from 'vuex';
import dayjs from 'dayjs';
import axios from 'axios';
import { RootState } from '@/store/types';
import { UserState } from '@/store/user/types';
import i18n from '@/plugins/i18n';
import { UserModuleActions } from '@/store/user/actions/userModuleActions';

const makeUserModuleActions = new UserModuleActions().init({ dayjs, axios, i18n });
export const actions: ActionTree<UserState, RootState> = {
  async fetchUserData({ state, commit }): Promise<any> {
    const APIEndpoint = '/api/users/self/me';
    makeUserModuleActions.fetchAPIData({ state, commit, APIEndpoint });
  },
  async changeUserSettings(
    { commit },
    props: { newValue: string; settingsProperty: string }
  ): Promise<any> {
    const { newValue, settingsProperty } = props;
    makeUserModuleActions.updateSettings({ commit, newValue, settingsProperty });
  },
};
