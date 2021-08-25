import { GetterTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleGetter } from './IModuleGetter';
import { IRootState } from './IRootState';

abstract class AbstractModuleGetter<EntityStateData> implements IModuleGetter<EntityStateData> {
  public getModuleGetters = (): GetterTree<IEntityState<EntityStateData>, IRootState> => {
    const baseModuleGetters = {
      entityStateData(state: IEntityState<EntityStateData>) {
        return state.entityStateData;
      },
    };
    const extendedModuleGetters = this._getModuleGettersTemplate();
    const moduleGetters = { ...baseModuleGetters, ...extendedModuleGetters };
    return moduleGetters;
  };

  protected _getModuleGettersTemplate = (): GetterTree<
    IEntityState<EntityStateData>,
    IRootState
  > => {
    return {};
  };
}

export { AbstractModuleGetter };
