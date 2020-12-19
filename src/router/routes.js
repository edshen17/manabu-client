import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';
import Home from '@/components/Home';
import Signup from '@/components/Signup';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import TeacherApplication from '@/components/TeacherApplication';

Vue.use(Router);

// use token to get user info
const getUserData = async () => {
  let res = await axios.get('http://localhost:5000/api/me', { headers: {
    'x-access-token': localStorage.getItem('token'),
    'Accept' : 'application/json',
    'Content-Type': 'application/json'
  } 
}).catch((err) => console.log(err));
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
        const data = await getUserData(localStorage.getItem('token'));
        if (data && data.data.email) {
          next('/dashboard');
        }  else {
          next()
        }
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
      path: '/apply',
      name: 'Apply',
      component: TeacherApplication,
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
        localStorage.setItem('token', '');
        next('/')
      },
    },
  ],
});


export default router;
