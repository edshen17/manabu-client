// import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
// import {
//   ModuleActionInitParams,
//   ModuleActionStoreDataParams,
// } from '@/store/abstractions/IModuleAction';
// import { UserEntityState } from '@/store/modules/user/types';

// type OptionalUserModuleActionInitParams = { dayjs: any; i18n: any };

// class UserModuleAction extends AbstractModuleAction<OptionalUserModuleActionInitParams> {
//   private _dayjs!: any;
//   private _i18n!: any;

//   public storeData = async (props: ModuleActionStoreDataParams<UserEntityState>): Promise<void> => {
//     const { state } = props;
//     this._handleEntityStateReturn(state);
//     await this._setEntityStateData(props);
//   };

//   private _handleLocaleChange = (newValue: string) => {
//     this._i18n.locale = newValue;
//     require(`dayjs/locale/${newValue}`); // require again in case not required
//     this._dayjs.locale(newValue);
//   };

//   public updateSettings = (props: {
//     state: UserEntityState;
//     commit: any;
//     newValue: string;
//     settingsProperty: string;
//   }): void => {
//     const { state, commit, newValue, settingsProperty } = props;
//     if (settingsProperty == 'locale') {
//       this._handleLocaleChange(newValue);
//     } else if (settingsProperty == 'currency') {
//       // _handleCurrencyChange
//     }
//     commit(`SET_${state.entityStateName}_SETTINGS_PROPERTY`, { newValue, settingsProperty });
//   };

//   protected _initTemplate = async (
//     optionalModuleActionInitParams: Omit<
//       ModuleActionInitParams<OptionalUserModuleActionInitParams>,
//       'axios'
//     >
//   ): Promise<void> => {
//     const { dayjs, i18n } = optionalModuleActionInitParams;
//     this._dayjs = dayjs;
//     this._i18n = i18n;
//   };
// }
// export { UserModuleAction };
