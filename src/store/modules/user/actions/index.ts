import axios from 'axios';
import { UserModuleAction } from './userModuleAction';
import { makeLocaleHandler } from '@/plugins/utils/localeHandler';
import i18n from '@/plugins/i18n';

const userModuleAction = new UserModuleAction().init({ axios, makeLocaleHandler, i18n });
const userModuleActions = userModuleAction.getModuleActions();

export { userModuleActions };
