import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import {
  GetEntityStateDataResponse,
  IModuleAction,
  ModuleActionContext,
  ModuleActionInitParams,
} from './IModuleAction';
import { IModuleState } from './IModuleState';
import { IRootState } from './IRootState';

abstract class AbstractModuleAction<OptionalModuleActionInitParams, EntityStateData>
  implements IModuleAction<OptionalModuleActionInitParams, EntityStateData>
{
  protected _axios!: any;
  protected _moduleState!: IModuleState<any, EntityStateData>;
  protected _moduleName!: string;

  public getModuleActions = (): ActionTree<IEntityState<EntityStateData>, IRootState> => {
    const self = this;
    const baseModuleActions = {
      async getEntityStateData(
        props: ModuleActionContext<EntityStateData>,
        payload: StringKeyObject
      ): Promise<EntityStateData | undefined> {
        const entityStateData = await self.getEntityStateData(props, payload);
        return entityStateData;
      },
      resetEntityState(props: ModuleActionContext<EntityStateData>): void {
        self.resetEntityStateData(props);
        self.resetEntityStatePromise(props);
      },
      resetEntityStateData(props: ModuleActionContext<EntityStateData>): void {
        self.resetEntityStateData(props);
      },
      resetEntityStatePromise(props: ModuleActionContext<EntityStateData>): void {
        self.resetEntityStatePromise(props);
      },
    };
    const extendedModuleActions = this._getModuleActionsTemplate();
    const moduleActions = { ...baseModuleActions, ...extendedModuleActions };
    return moduleActions;
  };

  public getEntityStateData = async (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ): Promise<GetEntityStateDataResponse<EntityStateData>> => {
    const { state } = props;
    const entityState = this._getEntityStateData(state);
    if (entityState) {
      return entityState;
    }
    await this._setEntityStateData(props, payload);
  };

  private _getEntityStateData = (
    state: IEntityState<EntityStateData>
  ): GetEntityStateDataResponse<EntityStateData> => {
    const isDataLoaded = state.entityStateData;
    const isPromiseSet = state.entityStatePromise;
    if (isDataLoaded && isPromiseSet) {
      return state.entityStateData;
    }
    if (isPromiseSet) {
      return state.entityStatePromise;
    }
  };

  private _setEntityStateData = async (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ): Promise<void> => {
    const { state, commit } = props;
    const { endpoint } = payload;
    try {
      const entityStatePromise = await this._axios.get(endpoint);
      const entityStatePayload = entityStatePromise && entityStatePromise.data[this._moduleName];
      commit('setEntityStatePromise', entityStatePromise);
      if (entityStatePayload) {
        commit('setEntityStateData', entityStatePayload);
      }
    } catch (err: any) {
      const entityStatePromise = err.response;
      entityStatePromise.data = {};
      entityStatePromise.data[this._moduleName] = state.entityStateData;
      commit('setEntityStatePromise', entityStatePromise);
    }
  };

  protected _getModuleActionsTemplate = (): ActionTree<
    IEntityState<EntityStateData>,
    IRootState
  > => {
    return {};
  };

  public resetEntityStateData = (props: ModuleActionContext<EntityStateData>) => {
    const { commit } = props;
    const entityStatePayload = this._moduleState.getDefaultEntityStateData();
    commit('setEntityStateData', entityStatePayload);
  };

  public resetEntityStatePromise = (props: ModuleActionContext<EntityStateData>) => {
    const { commit } = props;
    const entityStatePromise = undefined;
    commit('setEntityStatePromise', entityStatePromise);
  };

  public init = (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>): this => {
    const { axios, makeModuleState, moduleName, ...optionalModuleActionInitParams } = initParams;
    this._axios = axios;
    this._moduleState = makeModuleState;
    this._moduleName = moduleName;
    this._initTemplate(optionalModuleActionInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalModuleActionInitParams>,
      'axios' | 'makeModuleState' | 'moduleName'
    >
  ): void => {
    return;
  };
}

export { AbstractModuleAction };
