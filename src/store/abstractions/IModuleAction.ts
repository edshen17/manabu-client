import { ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IRootState } from './IRootState';

type ModuleActionInitParams<OptionalModuleActionInitParams> = RequiredModuleActionInitParams &
  OptionalModuleActionInitParams;

type RequiredModuleActionInitParams = {
  axios: any;
};

type GetEntityStateDataResponse<EntityStateData> =
  | EntityStateData
  | Promise<EntityStateData>
  | undefined;

interface IModuleAction<OptionalModuleActionInitParams, EntityStateData> {
  getEntityStateData: (
    props: ModuleActionStoreDataParams<EntityStateData>
  ) => Promise<GetEntityStateDataResponse<EntityStateData>>;
  init: (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>) => this;
  getModuleActions: () => ActionTree<IEntityState<EntityStateData>, IRootState>;
}

type ModuleActionStoreDataParams<EntityStateData> = {
  state: IEntityState<EntityStateData>;
  commit: any;
};

export {
  IModuleAction,
  ModuleActionStoreDataParams,
  ModuleActionInitParams,
  GetEntityStateDataResponse,
};
