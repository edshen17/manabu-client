import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { makeLoginProtectedRouterGuard } from './guards/loginProtectedRouterGuard';

const Dashboard = () => import('../views/Dashboard.vue');
const Home = () => import('../views/Home.vue');
const UserAuthForm = () => import('../views/UserAuthForm.vue');

const loginProtectedRouterGuard = makeLoginProtectedRouterGuard;

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    beforeEnter(to, from, next) {
      Vue.$cookies.set('hp', '').set('sig', '');
      next('/');
    },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export { router };
