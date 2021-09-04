import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
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
  getModuleActions: () => ActionTree<IEntityState<EntityStateData>, IRootState>;
  getEntityStateData: (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ) => Promise<GetEntityStateDataResponse<EntityStateData>>;
  init: (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>) => this;
}

export { IModuleAction, ModuleActionInitParams, GetEntityStateDataResponse };
