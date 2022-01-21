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
const UserProfile = () => import('../views/UserProfile.vue');
const AppointmentCalendar = () => import('../views/AppointmentCalendar.vue');

const loginProtectedRouterGuard = makeLoginProtectedRouterGuard;
const logoutRouterGuard = makeLogoutRouterGuard;

Vue.use(VueRouter);
const layout = { layout: LayoutDefault };

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, ...layout },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, ...layout },
  },
  {
    path: '/login',
    name: 'Login',
    component: UserAuthForm,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresRedirectOnAuth: true, ...layout },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresAuth: true, ...layout },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: logoutRouterGuard.consume(),
    meta: { requiresAuth: true, ...layout },
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { requiresAuth: true, ...layout },
  },
  {
    path: '/apply',
    name: 'TeacherSignup',
    component: TeacherSignup,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: { ...layout },
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: UserProfile,
    meta: { ...layout },
  },
  {
    path: '/user/:userId/calendar',
    name: 'AppointmentCalendar',
    component: AppointmentCalendar,
    beforeEnter: loginProtectedRouterGuard.consume(),
    meta: {},
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
