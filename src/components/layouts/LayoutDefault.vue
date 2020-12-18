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
            <b-nav-item v-for="route in navBarLinks" :key="route.id">
              <b-link :to="route.link" class="nav-link menu-item" :class=" { active: $route.name == route.name } ">{{ route.displayName }}</b-link>
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

export default {
  name: 'LayoutDefault',
  data() {
    return {
      navBarLinks: [
        {
          displayName: 'Find a Teacher',
          name: 'Teachers',
          link: '/teachers',
        },
        {
          displayName: 'Become a Teacher',
          name: 'Apply',
          link: '/apply',
        },
        {
          displayName: 'Log In',
          name: 'Log In',
          link: '/login',
        },
        {
          displayName: 'Sign Up',
          name: 'Sign Up',
          link: '/signup',
        },
      ],
    };
  },
};
</script>

<style lang="css">
  @import '../../assets/css/styles.css';
</style>
