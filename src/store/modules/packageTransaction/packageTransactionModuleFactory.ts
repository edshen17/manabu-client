import { AbstractModuleFactory } from '@/store/abstractions/AbstractModuleFactory';
import { PackageTransactionEntityStateData } from './state/packageTransactionModuleState';

class PackageTransactionModuleFactory extends AbstractModuleFactory<PackageTransactionEntityStateData> {}

export { PackageTransactionModuleFactory };
