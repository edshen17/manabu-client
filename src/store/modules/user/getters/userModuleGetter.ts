import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { GetterTree } from 'vuex';
import { UserEntityStateData } from '../types';

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {
  public getModuleGetters = (): GetterTree<IEntityState<UserEntityStateData>, IRootState> => {
    return {
      settings(state: IEntityState<UserEntityStateData>) {
        return state.entityStateData.settings;
      },
    };
  };
}

export { UserModuleGetter };
