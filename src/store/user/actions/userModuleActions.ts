import { IModuleAction } from '@/store/abstractions/IStoreAction';
import { UserState } from '@/store/user/types';

class UserModuleActions implements IModuleAction {
  private axios!: any;
  private dayjs!: any;
  private i18n!: any;
  public init(services: { axios: any; dayjs: any; i18n: any }) {
    const { axios, dayjs, i18n } = services;
    this.axios = axios;
    this.dayjs = dayjs;
    this.i18n = i18n;
    return this;
  }

  public fetchAPIData = async (props: { state: any; commit: any }): Promise<any> => {
    const { state, commit } = props;
    const isLoaded = state.userData && state.isLoggedIn;
    if (isLoaded) {
      return state.userData;
    }
    if (state.userPromise) {
      return state.userPromise;
    }
    const userDataPromise: any = await this.axios.get('/api/me').catch((err: Error) => {
      console.log(err);
    });

    commit('SET_USER_DATA_PROMISE', userDataPromise);

    let payload: UserState = userDataPromise && userDataPromise.data;
    if (payload) {
      commit('SET_USER', payload);
    }
  };

  public updateModuleData = (props: { commit: any; newLocale: string }): void => {
    const { commit, newLocale } = props;
    this.i18n.locale = newLocale;
    require(`dayjs/locale/${newLocale}`); // require again in case not required
    this.dayjs.locale(newLocale);
    commit('SET_USER_LOCALE', newLocale);
    //TODO: make db update request
  };
}
export { UserModuleActions };
