import { AbstractModuleState } from '@/store/abstractions/AbstractModuleState';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { PackageTransactionDoc } from '@server/models/PackageTransaction';

type PackageTransactionEntityState = IEntityState<PackageTransactionEntityStateData>;
type PackageTransactionEntityStateData = PackageTransactionDoc[];

type OptionalPackageTransactionModuleStateInitParams = {};

class PackageTransactionModuleState extends AbstractModuleState<
  OptionalPackageTransactionModuleStateInitParams,
  PackageTransactionEntityStateData
> {
  public getDefaultEntityStateData = (): PackageTransactionEntityStateData => {
    const defaultEntityStateData: PackageTransactionDoc[] = [];
    return defaultEntityStateData;
  };
}

export {
  PackageTransactionModuleState,
  PackageTransactionEntityState,
  PackageTransactionEntityStateData,
};
