import { makeContentRepository } from '@/repositories/content';
import { makeContentModuleState } from '../state';
import { ContentModuleAction } from './contentModuleAction';

const makeContentModuleAction = new ContentModuleAction().init({
  makeRepository: makeContentRepository,
  makeModuleState: makeContentModuleState,
});

export { makeContentModuleAction };
