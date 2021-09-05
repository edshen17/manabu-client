import Vue from 'vue';
import { NavigationGuardNext, Route } from 'vue-router';
import { AbstractRouterGuard } from '../abstractions/AbstractRouterGuard';

class LogoutRouterGuard extends AbstractRouterGuard {
  protected _consumeTemplate = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext<any>
  ): Promise<void> => {
    this._store.dispatch('user/resetEntityStateData');
    Vue.$cookies.set('hp', '').set('sig', '');
    next('/');
  };
}

export { LogoutRouterGuard };
