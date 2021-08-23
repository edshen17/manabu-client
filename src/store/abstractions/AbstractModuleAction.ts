import { StringKeyObject } from '@server/types/custom';
import { ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import {
  GetEntityStateDataResponse,
  IModuleAction,
  ModuleActionInitParams,
  ModuleActionStoreDataParams,
} from './IModuleAction';
import { IRootState } from './IRootState';

abstract class AbstractModuleAction<OptionalModuleActionInitParams, EntityStateData>
  implements IModuleAction<OptionalModuleActionInitParams, EntityStateData>
{
  protected _axios!: any;

  public getEntityState = async (
    props: ModuleActionStoreDataParams<EntityStateData>
  ): Promise<GetEntityStateDataResponse<EntityStateData>> => {
    const { state } = props;
    const entityState = this._getEntityState(state);
    if (entityState) {
      return entityState;
    }
    await this._setEntityState(props);
  };

  private _getEntityState = (
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

  protected _setEntityState = async (
    props: ModuleActionStoreDataParams<EntityStateData>
  ): Promise<void> => {
    const { state, commit } = props;
    const { entityStateName, entityStateEndpoint } = state;
    try {
      const entityStatePromise = await this._axios.get(`/api/v1/${entityStateEndpoint}`);
      const payload = entityStatePromise && entityStatePromise.data;
      commit(`SET_${entityStateName}_ENTITY_STATE_PROMISE`, entityStatePromise);
      if (payload) {
        commit(`SET_${entityStateName}_ENTITY_STATE_DATA`, payload);
      }
    } catch (err) {}
  };

  public getModuleActions = (
    entityStateName: string
  ): ActionTree<IEntityState<EntityStateData>, IRootState> => {
    const self = this;
    const baseModuleActions: StringKeyObject = {};
    baseModuleActions[`GET_${entityStateName}_ENTITY_STATE_DATA`] = async (props: {
      state: IEntityState<EntityStateData>;
      commit: any;
    }): Promise<any> => {
      const { state, commit } = props;
      return self.getEntityState({ state, commit });
    };
    const extendedModuleActions = this._getModuleActionsTemplate();
    const moduleActions = { ...baseModuleActions, ...extendedModuleActions };
    return moduleActions;
  };

  protected _getModuleActionsTemplate = (): ActionTree<
    IEntityState<EntityStateData>,
    IRootState
  > => {
    return {};
  };

  public init = (initParams: ModuleActionInitParams<OptionalModuleActionInitParams>): this => {
    const { axios, ...optionalModuleActionInitParams } = initParams;
    this._axios = axios;
    this._initTemplate(optionalModuleActionInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalModuleActionInitParams>,
      'axios'
    >
  ): void => {};
}

export { AbstractModuleAction };
