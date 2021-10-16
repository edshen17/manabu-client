import { i18n } from '@/plugins/i18n';
import { makeLocaleHandler } from '@/plugins/i18n/utils/localeHandler';
import { makeUserRepository } from '@/repositories/user';
import { MODULE_NAME } from '@/store/abstractions/IModuleFactory';
import { makeUserModuleState } from '../state';
import { UserModuleAction } from './userModuleAction';

const makeUserModuleAction = new UserModuleAction().init({
  makeRepository: makeUserRepository,
  makeLocaleHandler,
  i18n,
  makeModuleState: makeUserModuleState,
  moduleName: MODULE_NAME.USER,
});

export { makeUserModuleAction };
