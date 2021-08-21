// import { ActionTree } from 'vuex';
// import dayjs from 'dayjs';
// import axios from 'axios';
// import i18n from '@/plugins/i18n';
// import { UserModuleAction } from './userModuleAction';
// import { UserEntityState } from '../types';
// import { IRootState } from '@/store/abstractions/IRootState';

// const makeUserModuleAction = new UserModuleAction().init({ dayjs, axios, i18n });

// const userModuleActions: ActionTree<UserEntityState, IRootState> = {
//   async getUserData({ state, commit }): Promise<any> {
//     (await makeUserModuleAction).storeData({ state, commit });
//   },
//   async changeUserSettings(
//     { state, commit },
//     props: { newValue: string; settingsProperty: string }
//   ): Promise<any> {
//     (await makeUserModuleAction).updateSettings({ state, commit, ...props });
//   },
// };

// export { userModuleActions };
