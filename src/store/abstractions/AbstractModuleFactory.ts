import { Module } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleAction } from './IModuleAction';
import { IModuleFactory } from './IModuleFactory';
import { IModuleGetter } from './IModuleGetter';
import { IModuleMutation } from './IModuleMutation';
import { IModuleState } from './IModuleState';
import { IRootState } from './IRootState';

abstract class AbstractModuleFactory<EntityStateData> implements IModuleFactory<EntityStateData> {
  protected _moduleState!: IModuleState<any, EntityStateData>;
  protected _moduleAction!: IModuleAction<any, EntityStateData>;
  protected _moduleMutation!: IModuleMutation<EntityStateData>;
  protected _moduleGetter!: IModuleGetter<EntityStateData>;

  public build = (): Module<IEntityState<EntityStateData>, IRootState> => {
    const module = {
      state: this._moduleState.getModuleState(),
      actions: this._moduleAction.getModuleActions(),
      mutations: this._moduleMutation.getModuleMutations(),
      getters: this._moduleGetter.getModuleGetters(),
      namespaced: true,
    };
    return module;
  };

  public init = (initParams: {
    makeModuleState: IModuleState<any, EntityStateData>;
    makeModuleAction: IModuleAction<any, EntityStateData>;
    makeModuleMutation: IModuleMutation<EntityStateData>;
    makeModuleGetter: IModuleGetter<EntityStateData>;
  }): this => {
    const { makeModuleState, makeModuleAction, makeModuleMutation, makeModuleGetter } = initParams;
    this._moduleState = makeModuleState;
    this._moduleAction = makeModuleAction;
    this._moduleMutation = makeModuleMutation;
    this._moduleGetter = makeModuleGetter;
    return this;
  };
}

export { AbstractModuleFactory };
