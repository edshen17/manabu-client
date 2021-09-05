import { i18n } from '@/plugins/i18n';
import { makeLocaleHandler } from '@/plugins/i18n/utils/localeHandler';
import { MODULE_NAME } from '@/store/abstractions/IModuleFactory';
import axios from 'axios';
import { makeUserModuleState } from '../state';
import { UserModuleAction } from './userModuleAction';

const makeUserModuleAction = new UserModuleAction().init({
  axios,
  makeLocaleHandler,
  i18n,
  makeModuleState: makeUserModuleState,
  moduleName: MODULE_NAME.USER,
});

export { makeUserModuleAction };
