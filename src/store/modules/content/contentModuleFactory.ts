import { AbstractModuleFactory } from '@/store/abstractions/AbstractModuleFactory';
import { ContentEntityStateData } from './state/contentModuleState';

class ContentModuleFactory extends AbstractModuleFactory<ContentEntityStateData> {}

export { ContentModuleFactory };
