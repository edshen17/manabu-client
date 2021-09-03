import { IRootState } from '@/store/abstractions/IRootState';
import { NavigationGuard, NavigationGuardNext, Route } from 'vue-router';
import { Store } from 'vuex';
import { IRouterGuard } from './IRouterGuard';

abstract class AbstractRouterGuard implements IRouterGuard {
  protected _store!: Store<IRootState>;

  public consume = (): NavigationGuard => {
    return async (to: Route, from: Route, next: NavigationGuardNext<any>): Promise<void> => {
      await this._consumeTemplate(to, from, next);
    };
  };

  protected _consumeTemplate = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext<any>
  ): Promise<void> => {
    return;
  };

  public init = (initParams: { store: Store<IRootState> }): this => {
    const { store } = initParams;
    this._store = store;
    return this;
  };
}

export { AbstractRouterGuard };
