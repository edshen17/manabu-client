import { i18n } from '@/plugins/i18n';
import { makeLocaleHandler } from '@/plugins/i18n/utils/localeHandler';
import axios from 'axios';
import { UserModuleAction } from './userModuleAction';

const makeUserModuleAction = new UserModuleAction().init({ axios, makeLocaleHandler, i18n });

export { makeUserModuleAction };
