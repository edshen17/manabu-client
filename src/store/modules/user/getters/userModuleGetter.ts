import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { GetterTree } from 'vuex';
import { UserEntityStateData } from '../state/userModuleState';

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {
  protected _getModuleGettersTemplate = (): GetterTree<
    IEntityState<UserEntityStateData>,
    IRootState
  > => {
    const extendedModuleGetters = {
      isLoggedIn(state: IEntityState<UserEntityStateData>): boolean {
        const isLoggedIn = '_id' in state.entityStateData;
        return isLoggedIn;
      },
      isTeacher(state: IEntityState<UserEntityStateData>): boolean {
        const isTeacher = 'teacherData' in state.entityStateData;
        return isTeacher;
      },
      locale(state: IEntityState<UserEntityStateData>): string {
        const locale = state.entityStateData.settings.locale!;
        return locale;
      },
      currency(state: IEntityState<UserEntityStateData>): string {
        const currency = state.entityStateData.settings.currency!;
        return currency;
      },
    };
    return extendedModuleGetters;
  };
}

export { UserModuleGetter };
