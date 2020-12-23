import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';
import Home from '@/components/Home';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import TeacherSignup from '@/components/TeacherSignup';

Vue.use(Router);
const host = 'http://localhost:5000/api';
// use token to get user info
const getUserData = async () => {
  let res = await axios.get(`${host}/me`, {withCredentials: true, headers: {
    'X-Requested-With': 'XMLHttpRequest'
  } }).catch((err) => {});
  return res;
}

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
      async beforeEnter(to, from, next) {
        const data = await getUserData();
        if (data && data.data.email) {
          next('/dashboard');
        }  else {
          next()
        }
      },
    },
    // {
    //   path: '/teachers',
    //   name: 'Teachers',
    //   component: ,
    //   meta: {
    //     title: 'Teachers',
    //   },
    // },
    {
      path: '/apply',
      name: 'Apply',
      component: TeacherSignup,
      meta: {
        title: 'Become a Teacher',
      },
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: Signup,
      meta: {
        title: 'Sign Up',
      },
      async beforeEnter(to, from, next) {
        const data = await getUserData();
        if (data && data.data.email) { // if logged in, redirect to dashboard
          next('/dashboard');
        }  else {
          next();
        }
      },
    },
    {
      path: '/login',
      name: 'Log In',
      component: Login,
      meta: {
        title: 'Log In',
      },
      async beforeEnter(to, from, next) {
        const data = await getUserData();
        if (data && data.data.email) {
          next('/dashboard');
        }  else {
          next()
        }
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        title: 'Dashboard',
      },
      async beforeEnter(to, from, next) {
        const data = await getUserData();
        if (!data) { 
          next('/login');
        } else {
          next()
        }
      },
    },
    {
      path: '/logout',
      name: 'Logout',
      async beforeEnter(to, from, next) {
        Vue.$cookies.set('hp', '').set('sig', '');
        next('/')
      },
    },
  ],
});


export default router;
