<template>
  <div class="LayoutDefault" id='LayoutDefault'>
    <div>
      <b-navbar
        toggleable="lg"
        class="navbar navbar-expand-lg navbar-light bg-light"
      >
        <b-navbar-brand>
          <b-link to="/" class="navbar-brand d-lg-inline-block">
            MANABU
          </b-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-show="true">
              <b-link
                to="/teachers"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Teachers' } "
                >Find a Teacher</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="this.$route.name != 'Dashboard' && this.$route.name != 'Settings'">
              <b-link
                to="/apply"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Apply' } "
                >Become a Teacher</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/login"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Log In' } "
                >Log In</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/signup"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Sign Up' } "
                >Sign Up</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="this.isLoggedIn">
              <b-link
                to="/logout"
                class="nav-link menu-item"
                >Logout</b-link
              >
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <main class="LayoutDefault_main">
      <slot />
    </main>
    <footer class="bg-light text-black text-center text-lg-start">
  <!-- Grid container -->
  <div class="container p-4">
    <!--Grid row-->
    <div class="row">
      <!--Grid column-->
      <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
        <h5 class="text-uppercase">About</h5>
        <p>
          Minato Manabu (Pte. Ltd) is a startup focused on empowering people through education. Its headquarters are located in Singapore and the company strives to provide students with innovative learning tools and high quality lessons. 
        </p>
      </div>
      <!--Grid column-->

      <!--Grid column-->
      <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
        <h5 class="text-uppercase">Social Media</h5>

  <section class="mb-4">
      <!-- Facebook -->
      <a class="btn btn-floating m-1" href="https://www.facebook.com/ManabuOfficial/" role="button"
        ><i class="fab fa-facebook-f"></i
      ></a>

      <!-- Twitter -->
      <a class="btn btn-floating m-1" href="#!" role="button"
        ><i class="fab fa-twitter"></i
      ></a>

      <!-- Instagram -->
      <a class="btn btn-floating m-1" href="https://www.instagram.com/nihongo_manabu_/" role="button"
        ><i class="fab fa-instagram"></i
      ></a>

    </section>
      </div>
      <!--Grid column-->
      <!--Grid column-->
      <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
        <h5 class="text-uppercase mb-0">More</h5>

        <ul class="list-unstyled mt-2">
          <li class="mb-2">
            <a href="#!" class="text-black">Become a teacher</a>
          </li>
          <li class="mb-2">
            <a href="#!" class="text-black">Find a teacher</a>
          </li>
          <li class="mb-2">
            <a href="#!" class="text-black">Manabu Guidelines</a>
          </li>
          <li class="mb-2">
            <a href="#!" class="text-black">Currency placeholder</a>
          </li>
        </ul>
      </div>
      <!--Grid column-->
    </div>
    <!--Grid row-->
  </div>
  <!-- Grid container -->

  <!-- Copyright -->
  <div class="text-center p-3 bg-light">
    Copyright © 2021. Minato Manabu. 68 Circular Road, #02-01, 049422, Singapore. All Rights Reserved.  
  </div>
  <!-- Copyright -->
</footer>
  </div>
</template>

<script>
import store from '../../store/store'

export default {
  name: 'LayoutDefault',
  computed: {
    isLoggedIn: {
      get() {
        return store.getters.isLoggedIn;
      },
      set(isLoggedIn) {
        return isLoggedIn;
      }
    },
},
  watch: {
    isLoggedIn(value) { // watch in case of mutations
      this.isLoggedIn = value;
    }
  },
};
</script>

<style lang="css">
@import "../../assets/css/styles.css";
</style>
