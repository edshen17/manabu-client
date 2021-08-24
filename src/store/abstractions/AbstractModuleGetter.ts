import { GetterTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleGetter } from './IModuleGetter';
import { IRootState } from './IRootState';

abstract class AbstractModuleGetter<EntityStateData> implements IModuleGetter<EntityStateData> {
  public getModuleGetters = (): GetterTree<IEntityState<EntityStateData>, IRootState> => {
    return {
      settings(state: IEntityState<EntityStateData>) {
        return state.entityStateData;
      },
    };
  };
}

export { AbstractModuleGetter };
