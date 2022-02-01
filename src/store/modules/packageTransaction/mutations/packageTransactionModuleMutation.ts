import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { PackageTransactionEntityStateData } from '../state/packageTransactionModuleState';

class PackageTransactionModuleMutation extends AbstractModuleMutation<PackageTransactionEntityStateData> {}

export { PackageTransactionModuleMutation };
