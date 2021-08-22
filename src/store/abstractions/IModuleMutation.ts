import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

interface IModuleMutation<EntityStateData> {
  SET_ENTITY_DATA: (props: {
    state: IEntityState<EntityStateData>;
    payload: EntityStateData;
  }) => void;
  SET_ENTITY_PROMISE: (props: {
    state: IEntityState<EntityStateData>;
    promise: Promise<EntityStateData>;
  }) => void;
  getModuleMutations: () => MutationTree<IEntityState<EntityStateData>>;
}

export { IModuleMutation };
