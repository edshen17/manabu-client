import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleMutation } from './IModuleMutation';

abstract class AbstractModuleMutation<EntityStateData> implements IModuleMutation<EntityStateData> {
  public getModuleMutations = (): MutationTree<IEntityState<EntityStateData>> => {
    const self = this;
    const baseModuleMutations: MutationTree<IEntityState<EntityStateData>> = {
      setEntityStateData(
        state: IEntityState<EntityStateData>,
        entityStateData: EntityStateData
      ): void {
        self.setEntityStateData({ state, entityStateData });
      },
      setEntityStatePromise(
        state: IEntityState<EntityStateData>,
        entityStatePromise: Promise<EntityStateData>
      ): void {
        self.setEntityStatePromise({ state, entityStatePromise });
      },
    };
    const extendedModuleMutations = this._getModuleMutationsTemplate();
    const moduleMutations = { ...baseModuleMutations, ...extendedModuleMutations };
    return moduleMutations;
  };

  public setEntityStateData = (props: {
    state: IEntityState<EntityStateData>;
    entityStateData: EntityStateData;
  }): void => {
    const { state, entityStateData } = props;
    state.entityStateData = entityStateData;
  };

  public setEntityStatePromise = (props: {
    state: IEntityState<EntityStateData>;
    entityStatePromise: Promise<EntityStateData>;
  }): void => {
    const { state, entityStatePromise } = props;
    state.entityStatePromise = entityStatePromise;
  };

  protected _getModuleMutationsTemplate = (): MutationTree<IEntityState<EntityStateData>> => {
    return {};
  };
}

export { AbstractModuleMutation };
