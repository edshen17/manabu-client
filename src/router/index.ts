import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { makeLoginProtectedRouterGuard } from './guards/loginProtectedRouterGuard';
import { makeLogoutRouterGuard } from './guards/logoutRouterGuard';

const Dashboard = () => import('../views/Dashboard.vue');
const Home = () => import('../views/Home.vue');
const Onboarding = () => import('../views/Onboarding.vue');
const UserAuthForm = () => import('../views/UserAuthForm.vue');

const loginProtectedRouterGuard = makeLoginProtectedRouterGuard;
const logoutRouterGuard = makeLogoutRouterGuard;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    // beforeEnter: loginProtectedRouterGuard.consume(),
    // meta: { requiresAuth: true },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: logoutRouterGuard.consume(),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    // beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
