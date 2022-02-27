import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { PackageTransactionEntityStateData } from '../state/packageTransactionModuleState';

class PackageTransactionModuleGetter extends AbstractModuleGetter<PackageTransactionEntityStateData> {}

export { PackageTransactionModuleGetter };
