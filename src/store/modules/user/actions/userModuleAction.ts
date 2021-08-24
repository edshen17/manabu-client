import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { UserEntityStateData } from '@/store/modules/user/types';

type OptionalUserModuleActionInitParams = { dayjs: any; i18n: any };

class UserModuleAction extends AbstractModuleAction<
  OptionalUserModuleActionInitParams,
  UserEntityStateData
> {
  private _dayjs!: any;
  private _i18n!: any;

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
    commit('SET_ENTITY_STATE_SETTINGS', {
      newValue,
      settingsProperty,
    });
  };

  private _handleLocaleChange = (newValue: string) => {
    this._i18n.locale = newValue;
    require(`dayjs/locale/${newValue}`); // require again in case not required
    this._dayjs.locale(newValue);
  };

  protected _initTemplate = async (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalUserModuleActionInitParams>,
      'axios'
    >
  ): Promise<void> => {
    const { dayjs, i18n } = optionalModuleActionInitParams;
    this._dayjs = dayjs;
    this._i18n = i18n;
  };
}
export { UserModuleAction };
