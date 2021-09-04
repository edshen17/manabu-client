import { AbstractModuleFactory } from '@/store/abstractions/AbstractModuleFactory';
import { UserEntityStateData } from './state/userModuleState';

class UserModuleFactory extends AbstractModuleFactory<UserEntityStateData> {}

export { UserModuleFactory };
