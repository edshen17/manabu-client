import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { StringKeyObject } from '@server/types/custom';
import { MutationTree } from 'vuex';
import { UserEntityStateData } from '../state/userModuleState';

class UserModuleMutation extends AbstractModuleMutation<UserEntityStateData> {
  protected _getModuleMutationsTemplate = (): MutationTree<IEntityState<UserEntityStateData>> => {
    const self = this;
    const extendedModuleMutations = {
      updateSettings(state: IEntityState<UserEntityStateData>, payload: StringKeyObject): void {
        self.updateSettings({ state, payload });
      },
    };
    return extendedModuleMutations;
  };

  public updateSettings = (props: {
    state: IEntityState<UserEntityStateData>;
    payload: StringKeyObject;
  }): void => {
    const { state, payload } = props;
    state.entityStateData.settings = { ...state.entityStateData.settings, ...payload };
  };
}

export { UserModuleMutation };
