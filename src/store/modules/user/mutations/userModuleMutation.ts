import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { UserEntityState, UserEntityStateData } from '../types';

class UserModuleMutation extends AbstractModuleMutation<UserEntityStateData> {
  // public SET_USER_SETTINGS_PROPERTY = (props: {
  //   state: UserState;
  //   payload: { newValue: string; settingsProperty: string };
  // }) => {
  //   const { state, payload } = props;
  //   const { newValue, settingsProperty } = payload;
  //   state.userData.settings[settingsProperty] = newValue;
  // };
  // in index.ts
  //   SET_USER_SETTINGS_PROPERTY(state, payload: { newValue: string; settingsProperty: string }): void {
  //     userModuleMutations.SET_USER_SETTINGS_PROPERTY({ state, payload });
  //   },
}

export { UserModuleMutation };
