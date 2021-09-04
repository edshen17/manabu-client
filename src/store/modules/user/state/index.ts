import { locale } from '@/plugins/i18n';
import { UserModuleState } from './userModuleState';

const makeUserModuleState = new UserModuleState().init({ locale });

export { makeUserModuleState };
