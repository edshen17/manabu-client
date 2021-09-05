import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleState } from './IModuleState';
import { IRootState } from './IRootState';

type ModuleActionInitParams<OptionalModuleActionInitParams> = RequiredModuleActionInitParams &
  OptionalModuleActionInitParams;

type RequiredModuleActionInitParams = {
  axios: any;
  makeModuleState: IModuleState<any, any>;
  moduleName: string;
};

type GetEntityStateDataResponse<EntityStateData> =
  | EntityStateData
  | Promise<EntityStateData>
  | undefined;

type ModuleActionContext<EntityStateData> = ActionContext<
  IEntityState<EntityStateData>,
  IRootState
>;

interface IModuleAction<OptionalModuleActionInitParams, EntityStateData> {
  getModuleActions: () => ActionTree<IEntityState<EntityStateData>, IRootState>;
  getEntityStateData: (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ) => Promise<GetEntityStateDataResponse<EntityStateData>>;
  resetEntityStateData: (props: ModuleActionContext<EntityStateData>) => void;
  init: (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>) => this;
}

export { IModuleAction, ModuleActionInitParams, GetEntityStateDataResponse, ModuleActionContext };
