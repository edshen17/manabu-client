import { store } from '@/store';
import { LoginProtectedRouterGuard } from '.';

const loginProtectedRouterGuard = new LoginProtectedRouterGuard().init({ store });

export { loginProtectedRouterGuard };
