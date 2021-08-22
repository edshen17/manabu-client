import dayjs from 'dayjs';
import axios from 'axios';
import i18n from '@/plugins/i18n';
import { UserModuleAction } from './userModuleAction';

const userModuleAction = new UserModuleAction().init({ dayjs, axios, i18n });

const userModuleActions = userModuleAction.getModuleActions();

export { userModuleActions };
