import { makeContentModuleAction } from './actions';
import { ContentModuleFactory } from './contentModuleFactory';
import { makeContentModuleGetter } from './getters';
import { makeContentModuleMutation } from './mutations';
import { makeContentModuleState } from './state';

const makeContentModuleFactory = new ContentModuleFactory().init({
  makeModuleState: makeContentModuleState,
  makeModuleAction: makeContentModuleAction,
  makeModuleGetter: makeContentModuleGetter,
  makeModuleMutation: makeContentModuleMutation,
});

const makeContentModule = makeContentModuleFactory.build();

export { makeContentModule };
