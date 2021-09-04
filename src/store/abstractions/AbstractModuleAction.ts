import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { IEntityState } from './IEntityState';
import { GetEntityStateDataResponse, IModuleAction, ModuleActionInitParams } from './IModuleAction';
import { IRootState } from './IRootState';

abstract class AbstractModuleAction<OptionalModuleActionInitParams, EntityStateData>
  implements IModuleAction<OptionalModuleActionInitParams, EntityStateData>
{
  protected _axios!: any;

  public getModuleActions = (): ActionTree<IEntityState<EntityStateData>, IRootState> => {
    const self = this;
    const baseModuleActions = {
      async getEntityStateData(
        props: ActionContext<IEntityState<EntityStateData>, IRootState>,
        payload: StringKeyObject
      ) {
        const entityStateData = await self.getEntityStateData(props, payload);
        return entityStateData;
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

  protected _setEntityStateData = async (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ): Promise<void> => {
    const { commit } = props;
    try {
      const entityStatePromise = await this._axios.get(payload.endpoint);
      const entityStatePayload = entityStatePromise && entityStatePromise.data;
      commit('setEntityStatePromise', entityStatePromise);
      if (entityStatePayload) {
        commit('setEntityStateData', entityStatePayload);
      }
    } catch (err) {}
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
  ): void => {
    return;
  };
}

export { AbstractModuleAction };
