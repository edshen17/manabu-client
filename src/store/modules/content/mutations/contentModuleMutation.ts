import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { ContentEntityStateData } from '../state/contentModuleState';

class ContentModuleMutation extends AbstractModuleMutation<ContentEntityStateData> {}

export { ContentModuleMutation };
