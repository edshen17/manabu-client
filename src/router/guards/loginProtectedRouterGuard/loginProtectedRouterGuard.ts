import { USER_ENTITY_STATE_ENDPOINT } from '@/store/modules/user/state/userModuleState';
import { NavigationGuardNext, Route } from 'vue-router';
import { AbstractRouterGuard } from '../abstractions/AbstractRouterGuard';

class LoginProtectedRouterGuard extends AbstractRouterGuard {
  protected _consumeTemplate = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext<any>
  ): Promise<void> => {
    // need this because state may be the default on redirect
    await this._store.dispatch('user/getEntityStateData', {
      endpoint: USER_ENTITY_STATE_ENDPOINT,
    });
    const isLoggedIn = this._store.getters['user/isLoggedIn'];
    const isHomePage = to.path == '/';
    const isUserAuthPage = to.path == '/signup' || to.path == '/login';
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
