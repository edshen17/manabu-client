import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';
import Home from '@/components/Home';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import Settings from '@/components/Settings';
import Dashboard from '@/components/Dashboard';
import TeacherSignup from '@/components/TeacherSignup';
import NotFound from '@/components/NotFound';
import UserProfile from '@/components/UserProfile';
import ViewCalendar from '@/components/steps/ViewCalendar';
import store  from '../store/store';

Vue.use(Router);
const host = '/api';
// use token to get user info
const getUserData = async () => {
  let res = await axios.get(`${host}/me`, {withCredentials: true, headers: {
    'X-Requested-With': 'XMLHttpRequest'
  } }).catch((err) => { res = null; store.commit('setLoggedIn', false); });
  return res;
}

async function beforeEnterCheck (route, next) {
  if (store.getters.isLoggedIn) {
    store.commit('setLoggedIn', true);
    next(route)
  } else {
    const res = await getUserData();
    if (res != null && res.data) {
      store.commit('setUserData', res.data);
      store.commit('setLoggedIn', true);
      next(route)
    } else {
      store.commit('setLoggedIn', false);
      store.commit('setUserData', {});
      next()
    }
  }
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
      beforeEnter(to, from, next) {
        beforeEnterCheck('/dashboard', next)
      },
    },
    {
      path: '/apply',
      name: 'Apply',
      component: TeacherSignup,
      meta: {
        title: 'Become a Teacher',
      },
      beforeEnter(to, from, next) {
        beforeEnterCheck(undefined, next)
      },
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: Signup,
      meta: {
        title: 'Sign Up',
      },
      beforeEnter(to, from, next) {
        beforeEnterCheck('/dashboard', next)
      },
    },
    {
      path: '/login',
      name: 'Log In',
      component: Login,
      meta: {
        title: 'Log In',
      },
      beforeEnter(to, from, next) {
        beforeEnterCheck('/dashboard', next)
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        title: 'Dashboard',
      },
      beforeEnter(to, from, next) {
        if (to != '/' && store.getters.isLoggedIn) {
          beforeEnterCheck(undefined, next) // undefined to prevent infinite loop
        } else {
          next('/')
        }
      },
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter(to, from, next) {
        Vue.$cookies.set('hp', '').set('sig', '');
        store.commit('setUserData', null);
        store.commit('setLoggedIn', false);
        next('/')
      },
    },
    {
      path: '/user/:uId',
      name: 'UserProfile',
      component: UserProfile,
      beforeEnter(to, from, next) {
        beforeEnterCheck(undefined, next)
      },
    },
    {
      path: '/calendar/:hostedBy/:packageTransactionId?',
      name: 'ViewCalendar',
      component: ViewCalendar,
      beforeEnter(to, from, next) {
        beforeEnterCheck(undefined, next)
      },
    },
    {
      path: '/settings/',
      name: 'Settings',
      component: Settings,
      beforeEnter(to, from, next) {
        if (to != '/' && store.getters.isLoggedIn) {
          beforeEnterCheck(undefined, next) // undefined to prevent infinite loop
        } else {
          next('/')
        }
      },
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
    },
    { path: '*', redirect: '/404', async beforeEnter(to, from, next) {
      beforeEnterCheck(undefined, next)
    }, }
  ],
});



export default router;