import { IEntityState } from './IEntityState';
import { IModuleState, ModuleStateInitParams } from './IModuleState';

abstract class AbstractModuleState<OptionalModuleStateInitParams, EntityStateData>
  implements IModuleState<OptionalModuleStateInitParams, EntityStateData>
{
  public getModuleState = (): IEntityState<EntityStateData> => {
    const entityStateData = this.getDefaultEntityStateData();
    const moduleState = {
      entityStateData,
    };
    return moduleState;
  };

  public abstract getDefaultEntityStateData(): EntityStateData;

  public init = (initParams: ModuleStateInitParams<OptionalModuleStateInitParams>): this => {
    const { ...optionalModuleStateInitParams } = initParams;
    this._initTemplate(optionalModuleStateInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalModuleStateInitParams: Omit<ModuleStateInitParams<OptionalModuleStateInitParams>, ''>
  ): void => {
    return;
  };
}

export { AbstractModuleState };
