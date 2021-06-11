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

  public fetchAPIData = async (props: {
    state: any;
    commit: any;
    APIEndpoint: string;
  }): Promise<any> => {
    const { state, commit, APIEndpoint } = props;
    const isLoaded = state.userData && state.isLoggedIn;
    if (isLoaded) {
      return state.userData;
    }
    if (state.userPromise) {
      return state.userPromise;
    }
    const userDataPromise: any = await this.axios.get(APIEndpoint).catch((err: Error) => {
      console.log(err);
    });

    commit('SET_USER_DATA_PROMISE', userDataPromise);

    let payload: UserState = userDataPromise && userDataPromise.data;
    if (payload) {
      commit('SET_USER', payload);
    }
  };

  private _handleLocaleChange = (newValue: string) => {
    this.i18n.locale = newValue;
    require(`dayjs/locale/${newValue}`); // require again in case not required
    this.dayjs.locale(newValue);
    // api call
  };

  public updateSettings = (props: {
    commit: any;
    newValue: string;
    settingsProperty: string;
  }): void => {
    const { commit, newValue, settingsProperty } = props;
    if (settingsProperty == 'locale') {
      this._handleLocaleChange(newValue);
    } else if (settingsProperty == 'currency') {
      // _handleCurrencyChange
    }
    commit('SET_USER_SETTINGS_PROPERTY', { newValue, settingsProperty });
  };
}
export { UserModuleActions };
