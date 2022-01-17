import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import { makeLoginProtectedRouterGuard } from './guards/loginProtectedRouterGuard';
import { makeLogoutRouterGuard } from './guards/logoutRouterGuard';
const Dashboard = () => import('../views/Dashboard.vue');
const Home = () => import('../views/Home.vue');
const Onboarding = () => import('../views/Onboarding.vue');
const UserAuthForm = () => import('../views/UserAuthForm.vue');
const TeacherSignup = () => import('../views/TeacherSignup.vue');

const loginProtectedRouterGuard = makeLoginProtectedRouterGuard;
const logoutRouterGuard = makeLogoutRouterGuard;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, layout: LayoutDefault },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, layout: LayoutDefault },
  },
  {
    path: '/login',
    name: 'Login',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, layout: LayoutDefault },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresAuth: true, layout: LayoutDefault },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: logoutRouterGuard.consume(),
    meta: { requiresAuth: true, layout: LayoutDefault },
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresAuth: true, layout: LayoutDefault },
  },
  {
    path: '/apply',
    name: 'TeacherSignup',
    component: TeacherSignup,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { layout: LayoutDefault },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
