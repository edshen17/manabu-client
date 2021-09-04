// import { USER_ENTITY_STATE_DISPATCH_PAYLOAD } from '@/store/modules/user/types';
// import { NavigationGuardNext, Route } from 'vue-router';
// import { AbstractRouterGuard } from '../abstractions/AbstractRouterGuard';

// class LoginProtectedRouterGuard extends AbstractRouterGuard {
//   protected _consumeTemplate = async (
//     to: Route,
//     from: Route,
//     next: NavigationGuardNext<any>
//   ): Promise<void> => {
//     // need this because state may be the default on redirect
//     await this._store.dispatch('user/getEntityStateData', {
//       endpoint: USER_ENTITY_STATE_DISPATCH_PAYLOAD.ENDPOINT,
//     });
//     const user = this._store.getters['user/entityStateData'];
//     const isLoggedIn = user._id;
//     if (isLoggedIn) {
//       next();
//     } else {
//       next('/login');
//     }
//   };
// }

// export { LoginProtectedRouterGuard };
