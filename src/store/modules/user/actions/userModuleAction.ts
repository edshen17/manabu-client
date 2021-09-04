import { LocaleHandler } from '@/plugins/i18n/utils/localeHandler/localeHandler';
import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { IRootState } from '@/store/abstractions/IRootState';
import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { UserEntityStateData } from '../state/userModuleState';

type OptionalUserModuleActionInitParams = { makeLocaleHandler: LocaleHandler; i18n: unknown };

class UserModuleAction extends AbstractModuleAction<
  OptionalUserModuleActionInitParams,
  UserEntityStateData
> {
  private _localeHandler!: LocaleHandler;
  private _i18n!: unknown;

  protected _getModuleActionsTemplate = (): ActionTree<
    IEntityState<UserEntityStateData>,
    IRootState
  > => {
    const self = this;
    const extendedModuleActions = {
      updateLocale(
        props: ActionContext<IEntityState<UserEntityStateData>, IRootState>,
        payload: StringKeyObject
      ) {
        return self.updateLocale(props, payload);
      },
    };
    return extendedModuleActions;
  };

  public updateLocale = (
    props: ActionContext<IEntityState<UserEntityStateData>, IRootState>,
    payload: StringKeyObject
  ): void => {
    const { commit } = props;
    const { locale } = payload;
    this._localeHandler.updateLocale({ i18n: this._i18n, locale });
    commit('updateSettings', { locale });
  };

  protected _initTemplate = async (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalUserModuleActionInitParams>,
      'axios'
    >
  ): Promise<void> => {
    const { makeLocaleHandler, i18n } = optionalModuleActionInitParams;
    this._localeHandler = makeLocaleHandler;
    this._i18n = i18n;
  };
}
export { UserModuleAction };
