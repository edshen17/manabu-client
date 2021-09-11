import { USER_ENTITY_STATE_ENDPOINT } from '@/store/modules/user/state/userModuleState';
import { NavigationGuardNext, Route } from 'vue-router';
import { AbstractRouterGuard } from '../abstractions/AbstractRouterGuard';

class LoginProtectedRouterGuard extends AbstractRouterGuard {
  protected _consumeTemplate = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext<any>
  ): Promise<void> => {
    const toDashboardPage = to.path == '/dashboard';
    // need this because state may be the default on redirect
    if (toDashboardPage) {
      await this._store.dispatch('user/getEntityStateData', {
        endpoint: USER_ENTITY_STATE_ENDPOINT,
      });
    }
    const isLoggedIn = this._store.getters['user/isLoggedIn'];
    const isHomePage = to.path == '/';
    const userAuthPaths = ['/signup', '/login'];
    const isUserAuthPage = userAuthPaths.includes(to.path);
    if (!isLoggedIn && !isHomePage && !isUserAuthPage) {
      next('/');
    }
    if (isLoggedIn && (isHomePage || isUserAuthPage)) {
      next('/dashboard');
    }
    next();
  };
}

export { LoginProtectedRouterGuard };
