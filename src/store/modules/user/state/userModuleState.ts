import { AbstractModuleState } from '@/store/abstractions/AbstractModuleState';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ModuleStateInitParams } from '@/store/abstractions/IModuleState';
import { JoinedUserDoc } from '@server/models/User';

type UserEntityState = IEntityState<UserEntityStateData>;
type UserEntityStateData = JoinedUserDoc | LoggedOutUser;

type LoggedOutUser = {
  settings: {
    currency: string;
    locale: string;
  };
};

type OptionalUserModuleStateInitParams = { locale: string };

class UserModuleState extends AbstractModuleState<
  OptionalUserModuleStateInitParams,
  UserEntityStateData
> {
  private _locale!: string;

  public getDefaultEntityStateData = (): UserEntityStateData => {
    const defaultEntityStateData = {
      settings: {
        currency: 'SGD',
        locale: this._locale,
      },
    };
    return defaultEntityStateData;
  };

  protected _initTemplate = (
    optionalModuleStateInitParams: Omit<
      ModuleStateInitParams<OptionalUserModuleStateInitParams>,
      ''
    >
  ): void => {
    const { locale } = optionalModuleStateInitParams;
    this._locale = locale;
  };
}

export { UserModuleState, UserEntityState, UserEntityStateData };
