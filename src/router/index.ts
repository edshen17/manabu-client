import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Home from '../views/Home.vue';
import UserAuthForm from '../views/UserAuthForm.vue';

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
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
