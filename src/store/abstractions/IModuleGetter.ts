import { GetterTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IRootState } from './IRootState';

interface IModuleGetter<EntityStateData> {
  getModuleGetters: () => GetterTree<IEntityState<EntityStateData>, IRootState>;
}

export { IModuleGetter };
