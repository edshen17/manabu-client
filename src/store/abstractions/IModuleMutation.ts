import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

interface IModuleMutation<EntityStateData> {
  setEntityStateData: (props: {
    state: IEntityState<EntityStateData>;
    payload: EntityStateData;
  }) => void;
  setEntityStatePromise: (props: {
    state: IEntityState<EntityStateData>;
    promise: Promise<EntityStateData>;
  }) => void;
  getModuleMutations: () => MutationTree<IEntityState<EntityStateData>>;
}

export { IModuleMutation };
