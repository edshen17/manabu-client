import { UserState } from '@/store/user/types';

class UserModuleMutations {
  public SET_USER = (props: { state: UserState; payload: UserState }): void => {
    const { state, payload } = props;
    state.isLoggedIn = true;
    state.userData = payload;
  };

  public SET_USER_DATA_PROMISE = (props: { state: UserState; promise: Promise<any> }) => {
    const { state, promise } = props;
    state.userPromise = promise;
  };

  public SET_USER_LOCALE = (props: { state: UserState; newLocale: string }) => {
    const { state, newLocale } = props;
    state.userData.settings.locale = newLocale;
  };
}

export { UserModuleMutations };
