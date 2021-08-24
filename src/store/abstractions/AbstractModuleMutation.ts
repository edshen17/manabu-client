import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

abstract class AbstractModuleMutation<EntityStateData> {
  public setEntityStateData = (props: {
    state: IEntityState<EntityStateData>;
    payload: EntityStateData;
  }): void => {
    const { state, payload } = props;
    state.entityStateData = payload;
  };

  public setEntityStatePromise = (props: {
    state: IEntityState<EntityStateData>;
    promise?: Promise<EntityStateData>;
  }) => {
    const { state, promise } = props;
    state.entityStatePromise = promise;
  };

  public getModuleMutations = (): MutationTree<IEntityState<EntityStateData>> => {
    const self = this;
    const baseModuleMutations: MutationTree<IEntityState<EntityStateData>> = {
      setEntityStateData(entityState: IEntityState<EntityStateData>): void {
        const state = entityState;
        const payload = entityState.entityStateData;
        self.setEntityStateData({ state, payload });
      },
      setEntityStatePromise(entityState: IEntityState<EntityStateData>): void {
        const state = entityState;
        const promise = entityState.entityStatePromise;
        self.setEntityStatePromise({ state, promise });
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
