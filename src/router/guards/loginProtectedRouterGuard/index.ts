import { store } from '@/store';
import { LoginProtectedRouterGuard } from './loginProtectedRouterGuard';

const makeLoginProtectedRouterGuard = new LoginProtectedRouterGuard().init({ store });

export { makeLoginProtectedRouterGuard };
