import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { UserEntityStateData } from '../state/userModuleState';

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {}

export { UserModuleGetter };
