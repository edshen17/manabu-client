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
  },
  {
    path: '/signup',
    name: 'Signup',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
  },
  {
    path: '/login',
    name: 'Login',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: loginProtectedRouterGuard.consume(),
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: logoutRouterGuard.consume(),
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
