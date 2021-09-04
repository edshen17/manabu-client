import { StringKeyObject } from '@server/types/custom';
import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

interface IModuleMutation<EntityStateData> {
  getModuleMutations: () => MutationTree<IEntityState<EntityStateData>>;
  setEntityStateData: (props: {
    state: IEntityState<EntityStateData>;
    entityStateData: EntityStateData;
  }) => void;
  getEntityStateData: (entityStatePayload: StringKeyObject) => EntityStateData;
  setEntityStatePromise: (props: {
    state: IEntityState<EntityStateData>;
    promise: Promise<EntityStateData>;
  }) => void;
}

export { IModuleMutation };
