import { makeUserModuleAction } from './actions';
import { makeUserModuleGetter } from './getters';
import { makeUserModuleMutation } from './mutations';
import { makeUserModuleState } from './state';
import { UserModuleFactory } from './userModuleFactory';

const makeUserModuleFactory = new UserModuleFactory().init({
  makeModuleState: makeUserModuleState,
  makeModuleAction: makeUserModuleAction,
  makeModuleGetter: makeUserModuleGetter,
  makeModuleMutation: makeUserModuleMutation,
});

const makeUserModule = makeUserModuleFactory.build();

export { makeUserModule };
