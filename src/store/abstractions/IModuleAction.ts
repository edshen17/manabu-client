import { ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IRootState } from './IRootState';

type ModuleActionInitParams<OptionalModuleActionInitParams> = RequiredModuleActionInitParams &
  OptionalModuleActionInitParams;

type RequiredModuleActionInitParams = {
  axios: any;
};

interface IModuleAction<OptionalModuleActionInitParams> {
  storeData: (props: ModuleActionStoreDataParams<IEntityState<any>>) => Promise<void>;
  init: (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>) => Promise<this>;
  getModuleActions: () => ActionTree<IEntityState<any>, IRootState>;
}

type ModuleActionStoreDataParams<IEntityState> = {
  state: IEntityState;
  commit: any;
};

export { IModuleAction, ModuleActionStoreDataParams, ModuleActionInitParams };
