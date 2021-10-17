import { LocaleHandler } from '@/plugins/i18n/utils/localeHandler/localeHandler';
import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { IRootState } from '@/store/abstractions/IRootState';
import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { UserEntityStateData } from '../state/userModuleState';

type UpdateLocaleParams = { locale: string; settings: StringKeyObject; _id: string };

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
        payload: UpdateLocaleParams
      ) {
        return self.updateLocale(props, payload);
      },
    };
    return extendedModuleActions;
  };

  public updateLocale = (
    props: ActionContext<IEntityState<UserEntityStateData>, IRootState>,
    payload: UpdateLocaleParams
  ): void => {
    const { commit, getters } = props;
    const { locale, settings, _id } = payload;
    const updatedSettings = { ...settings, locale };
    this._localeHandler.updateLocale({ i18n: this._i18n, locale });
    commit('updateSettings', { locale });
    if (getters.isLoggedIn) {
      this._repository.updateById({ _id, updateParams: { settings: updatedSettings } });
    }
  };

  protected _initTemplate = async (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalUserModuleActionInitParams>,
      'makeRepository' | 'makeModuleState' | 'moduleName'
    >
  ): Promise<void> => {
    const { makeLocaleHandler, i18n } = optionalModuleActionInitParams;
    this._localeHandler = makeLocaleHandler;
    this._i18n = i18n;
  };
}
export { UserModuleAction };
