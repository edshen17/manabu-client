<template>
  <div class="LayoutDefault">
    <div>
      <b-navbar toggleable="lg" class="navbar navbar-expand-lg navbar-light bg-light">
        <b-navbar-brand>
          <b-link to="/" class="navbar-brand d-lg-inline-block">
            MANABU
          </b-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item>
              <b-link to="/teachers" class="nav-link menu-item" v-show="true" :class=" { active: $route.name == 'Teachers' } ">Find a Teacher</b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link to="/apply" class="nav-link menu-item" v-show="this.$route.name != 'Dashboard'" :class=" { active: $route.name == 'Apply' } ">Become a Teacher</b-link>
            </b-nav-item> 
            <b-nav-item>
              <b-link to="/login" class="nav-link menu-item" v-show="!this.isLoggedIn" :class=" { active: $route.name == 'Log In' } ">Log In</b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link to="/signup" class="nav-link menu-item" v-show="!this.isLoggedIn" :class=" { active: $route.name == 'Sign Up' } ">Sign Up</b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link to="/logout" class="nav-link menu-item" v-show="this.isLoggedIn" :class=" { active: $route.name == 'Logout' } ">Logout</b-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  <main class="LayoutDefault_main">
    <slot />
  </main>
  </div>
</template>

<script>
import axios from 'axios';
import getUserData from '../../assets/scripts/tokenGetter'

export default {
  name: 'LayoutDefault',
  async mounted() {
    let userData = await getUserData();
    this.isLoggedIn = (userData != null);
  },
  watch: {
    async '$route' () { // if route changes, update variables to avoid mutation errors
      let userData = await getUserData();
      this.isLoggedIn = (userData != null);
    }
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
};
</script>

<style lang="css">
  @import '../../assets/css/styles.css';
</style>
