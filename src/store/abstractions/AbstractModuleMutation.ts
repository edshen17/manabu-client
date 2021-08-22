import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

abstract class AbstractModuleMutation<EntityStateData> {
  public SET_ENTITY_STATE_DATA = (props: {
    state: IEntityState<EntityStateData>;
    payload: EntityStateData;
  }): void => {
    const { state, payload } = props;
    state.entityStateData = payload;
  };

  public SET_ENTITY_STATE_PROMISE = (props: {
    state: IEntityState<EntityStateData>;
    promise?: Promise<EntityStateData>;
  }) => {
    const { state, promise } = props;
    state.entityStatePromise = promise;
  };

  public getModuleMutations = (): MutationTree<IEntityState<EntityStateData>> => {
    const self = this;
    const baseModuleMutations: MutationTree<IEntityState<EntityStateData>> = {
      SET_ENTITY_STATE_DATA(entityState: IEntityState<EntityStateData>): void {
        const state = entityState;
        const payload = entityState.entityStateData;
        self.SET_ENTITY_STATE_DATA({ state, payload });
      },
      SET_ENTITY_STATE_PROMISE(entityState: IEntityState<EntityStateData>): void {
        const state = entityState;
        const promise = entityState.entityStatePromise;
        self.SET_ENTITY_STATE_PROMISE({ state, promise });
      },
    };
    const extendedModuleMutations = this._getModuleMutationsTemplate();
    const moduleMutations = { ...baseModuleMutations, ...extendedModuleMutations };
    return moduleMutations;
  };

  protected _getModuleMutationsTemplate = (): MutationTree<IEntityState<EntityStateData>> => {
    return {};
  };
}

export { AbstractModuleMutation };
