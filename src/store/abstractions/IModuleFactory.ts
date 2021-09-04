import { Module } from 'vuex';
import { IEntityState } from './IEntityState';
import { IModuleAction } from './IModuleAction';
import { IModuleGetter } from './IModuleGetter';
import { IModuleMutation } from './IModuleMutation';
import { IModuleState } from './IModuleState';
import { IRootState } from './IRootState';

interface IModuleFactory<EntityStateData> {
  build(): Module<IEntityState<EntityStateData>, IRootState>;
  init(initParams: {
    makeModuleState: IModuleState<any, EntityStateData>;
    makeModuleAction: IModuleAction<any, EntityStateData>;
    makeModuleMutation: IModuleMutation<EntityStateData>;
    makeModuleGetter: IModuleGetter<EntityStateData>;
  }): this;
}

export { IModuleFactory };
