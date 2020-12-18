import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Signup from '@/components/Signup';
import Login from '@/components/Login';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Manabu',
      },
    },
    {
      path: '/teachers',
      name: 'Teachers',
      component: Home,
      meta: {
        title: 'Teachers',
      },
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: Signup,
      meta: {
        title: 'Sign Up',
      },
    },
    {
      path: '/login',
      name: 'Log In',
      component: Login,
      meta: {
        title: 'Log In',
      },
    },
  ],
});


export default router;
