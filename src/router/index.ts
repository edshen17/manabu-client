import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { makeLoginProtectedRouterGuard } from './guards/loginProtectedRouterGuard';
import { makeLogoutRouterGuard } from './guards/logoutRouterGuard';

const Dashboard = () => import('../views/Dashboard.vue');
const Home = () => import('../views/Home.vue');
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
  },
  {
    path: '/login',
    name: 'Login',
    component: UserAuthForm,
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
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
