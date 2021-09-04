import { IEntityState } from './IEntityState';

type ModuleStateInitParams<OptionalModuleStateInitParams> = RequiredModuleStateInitParams &
  OptionalModuleStateInitParams;

type RequiredModuleStateInitParams = {};

interface IModuleState<OptionalModuleStateInitParams, EntityStateData> {
  getModuleState: () => IEntityState<EntityStateData>;
  init: (initParams: ModuleStateInitParams<OptionalModuleStateInitParams>) => this;
}

export { IModuleState, ModuleStateInitParams };
