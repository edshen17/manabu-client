import { IRepository } from '@/repositories/abstractions/IRepository';
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
  protected _repository!: IRepository;
  protected _moduleState!: IModuleState<any, EntityStateData>;
  protected _moduleName!: string;

  public getModuleActions = (): ActionTree<IEntityState<EntityStateData>, IRootState> => {
    const self = this;
    const baseModuleActions = {
      async getEntityStateData(
        props: ModuleActionContext<EntityStateData>
      ): Promise<EntityStateData | undefined> {
        const entityStateData = await self.getEntityStateData(props);
        return entityStateData;
      },
      setEntityStateData(
        props: ModuleActionContext<EntityStateData>,
        payload: StringKeyObject
      ): void {
        self.setEntityStateData(props, payload);
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
    props: ActionContext<IEntityState<EntityStateData>, IRootState>
  ): Promise<GetEntityStateDataResponse<EntityStateData>> => {
    const { state } = props;
    const entityState = this._getEntityStateData(state);
    if (entityState) {
      return entityState;
    }
    await this._setBaseEntityStateData(props);
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

  private _setBaseEntityStateData = async (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>
  ): Promise<void> => {
    const { state, commit } = props;
    try {
      const entityStatePromise = await this._repository.getSelf();
      const entityStatePayload = entityStatePromise && entityStatePromise.data[this._moduleName];
      commit('setEntityStatePromise', entityStatePromise);
      if (entityStatePayload) {
        this.setEntityStateData(props, entityStatePayload);
      }
    } catch (err: any) {
      const entityStatePromise = err.response;
      entityStatePromise.data = {};
      entityStatePromise.data[this._moduleName] = state.entityStateData;
      commit('setEntityStatePromise', entityStatePromise);
    }
  };

  public setEntityStateData = (
    props: ActionContext<IEntityState<EntityStateData>, IRootState>,
    payload: StringKeyObject
  ): void => {
    const { commit } = props;
    commit('setEntityStateData', payload);
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
    const { makeRepository, makeModuleState, moduleName, ...optionalModuleActionInitParams } =
      initParams;
    this._repository = makeRepository;
    this._moduleState = makeModuleState;
    this._moduleName = moduleName;
    this._initTemplate(optionalModuleActionInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalModuleActionInitParams>,
      'makeRepository' | 'makeModuleState' | 'moduleName'
    >
  ): void => {
    return;
  };
}

export { AbstractModuleAction };
