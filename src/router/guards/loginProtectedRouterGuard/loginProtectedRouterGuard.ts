import { NavigationGuardNext, Route } from 'vue-router';
import { AbstractRouterGuard } from '../abstractions/AbstractRouterGuard';

class LoginProtectedRouterGuard extends AbstractRouterGuard {
  protected _consumeTemplate = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext<any>
  ): Promise<void> => {
    await this._store.dispatch('user/getEntityStateData');
    const isLoggedIn = this._store.getters['user/isLoggedIn'];
    const requiresAuth = to.meta.requiresAuth;
    const requiresRedirectOnAuth = to.meta.requiresRedirectOnAuth;
    if ((!requiresAuth && !requiresRedirectOnAuth) || (requiresRedirectOnAuth && !isLoggedIn)) {
      next();
    }
    if (requiresAuth && !isLoggedIn) {
      next('/');
    }
    if (requiresRedirectOnAuth && isLoggedIn) {
      next('/dashboard');
    }
    next();
  };
}

export { LoginProtectedRouterGuard };
