import { StringKeyObject } from '@server/types/custom';
import { MutationTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleMutation } from './IModuleMutation';

abstract class AbstractModuleMutation<EntityStateData> implements IModuleMutation<EntityStateData> {
  public getModuleMutations = (): MutationTree<IEntityState<EntityStateData>> => {
    const self = this;
    const baseModuleMutations: MutationTree<IEntityState<EntityStateData>> = {
      setEntityStateData(
        state: IEntityState<EntityStateData>,
        entityStatePayload: StringKeyObject
      ): void {
        const entityStateData = self.getEntityStateData(entityStatePayload);
        self.setEntityStateData({ state, entityStateData });
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

  public abstract getEntityStateData(entityStatePayload: StringKeyObject): EntityStateData;

  public setEntityStateData = (props: {
    state: IEntityState<EntityStateData>;
    entityStateData: EntityStateData;
  }): void => {
    const { state, entityStateData } = props;
    state.entityStateData = entityStateData;
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
