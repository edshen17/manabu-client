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

  public getEntityStateData = async (
    props: ModuleActionStoreDataParams<EntityStateData>
  ): Promise<GetEntityStateDataResponse<EntityStateData>> => {
    const { state } = props;
    const entityState = this._getEntityState(state);
    if (entityState) {
      return entityState;
    }
    await this._setEntityStateData(props);
  };

  protected _getEntityState = (
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

  protected _setEntityStateData = async (
    props: ModuleActionStoreDataParams<EntityStateData>
  ): Promise<void> => {
    const { state, commit } = props;
    try {
      const entityStatePromise = await this._axios.get('/api/v1/users/self');
      const payload = entityStatePromise && entityStatePromise.data;
      commit(`SET_${state.entityStateName}_ENTITY_STATE_PROMISE`, entityStatePromise);
      if (payload) {
        commit(`SET_${state.entityStateName}_ENTITY_STATE_DATA`, payload);
      }
    } catch (err) {}
  };

  public getModuleActions = (): ActionTree<IEntityState<EntityStateData>, IRootState> => {
    const self = this;
    const baseModuleActions = {
      async getEntityStateData(props: {
        state: IEntityState<EntityStateData>;
        commit: any;
      }): Promise<any> {
        const { state, commit } = props;
        return self.getEntityStateData({ state, commit });
      },
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
