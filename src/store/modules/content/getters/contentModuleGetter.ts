import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { ContentEntityStateData } from '../state/contentModuleState';

class ContentModuleGetter extends AbstractModuleGetter<ContentEntityStateData> {}

export { ContentModuleGetter };
