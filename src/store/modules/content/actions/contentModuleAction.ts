import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { ContentEntityStateData } from '../state/contentModuleState';

type OptionalContentModuleActionInitParams = {};

class ContentModuleAction extends AbstractModuleAction<
  OptionalContentModuleActionInitParams,
  ContentEntityStateData
> {}

export { ContentModuleAction };
