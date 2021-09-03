import { NavigationGuard } from 'vue-router';

interface IRouterGuard {
  consume: () => NavigationGuard;
  init: (initParams: any) => this;
}

export { IRouterGuard };
