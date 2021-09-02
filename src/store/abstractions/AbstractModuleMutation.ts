import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';

abstract class AbstractModuleMutation<EntityStateData> {
  public getModuleMutations = (): MutationTree<IEntityState<EntityStateData>> => {
    const self = this;
    const baseModuleMutations: MutationTree<IEntityState<EntityStateData>> = {
      setEntityStateData(state: IEntityState<EntityStateData>): void {
        const payload = state.entityStateData;
        self.setEntityStateData({ state, payload });
      },
      setEntityStatePromise(state: IEntityState<EntityStateData>): void {
        const promise = state.entityStatePromise;
        self.setEntityStatePromise({ state, promise });
      },
    };
    const extendedModuleMutations = this._getModuleMutationsTemplate();
    const moduleMutations = { ...baseModuleMutations, ...extendedModuleMutations };
    return moduleMutations;
  };

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
  }): void => {
    const { state, promise } = props;
    state.entityStatePromise = promise;
  };

  protected _getModuleMutationsTemplate = (): MutationTree<IEntityState<EntityStateData>> => {
    return {};
  };
}

export { AbstractModuleMutation };
