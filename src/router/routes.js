import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';
import Home from '@/components/Home';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import TeacherSignup from '@/components/TeacherSignup';
import NotFound from '@/components/NotFound';
import UserProfile from '@/components/UserProfile';
import ViewCalendar from '@/components/steps/ViewCalendar';
import myUserData from '../assets/scripts/tokenGetter';
import { store, storeMethods } from '../store/store';

Vue.use(Router);
const host = 'http://localhost:5000/api';
// use token to get user info
const setUserStore = async () => {
  const user = await myUserData();
  if (user) {
    storeMethods.setUserData(user.data)
  }
}
setUserStore();

const beforeEnterCheck = (route, next) => {
  if (!storeMethods.isStoreEmpty()) {
    next(route)
  } else {
    next()
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
      async beforeEnter(to, from, next) {
        console.log(store.getUserData())
        if (Object.keys(storeMethods.getStore().userData).length != 0) {
          next('/dashboard');
        }  else {
          next()
        }
      },
    },
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
      async beforeEnter(to, from, next) {
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
      async beforeEnter(to, from, next) {
        if (to != '/') {
          next();
        }
      },
    },
    {
      path: '/logout',
      name: 'Logout',
      async beforeEnter(to, from, next) {
        Vue.$cookies.set('hp', '').set('sig', '');
        storeMethods.setUserData({})
        next('/')
      },
    },
    {
      path: '/user/:uId',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/calendar/:hostedBy/:packageTransactionId?',
      name: 'ViewCalendar',
      component: ViewCalendar,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
    },
    { path: '*', redirect: '/404' }
  ],
});



export default router;