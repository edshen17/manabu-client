import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

interface IModuleMutation<EntityStateData> {
  getModuleMutations: () => MutationTree<IEntityState<EntityStateData>>;
  setEntityStateData: (props: {
    state: IEntityState<EntityStateData>;
    entityStateData: EntityStateData;
  }) => void;
  setEntityStatePromise: (props: {
    state: IEntityState<EntityStateData>;
    entityStatePromise: Promise<EntityStateData>;
  }) => void;
}

export { IModuleMutation };
