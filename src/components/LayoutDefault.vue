<template>
  <div class="flex flex-col h-screen" id="LayoutDefault">
    <navbar-component></navbar-component> 
    <main class="LayoutDefault_main relative flex-grow">
      <slot />
    </main>
    <footer-component class="bg-light text-black">
    </footer-component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NavbarComponent from "./Navbar.vue";
import FooterComponent from "./Footer.vue";
export default Vue.extend({
  name: "LayoutDefault",
  components: {
    NavbarComponent,
    FooterComponent
  }
})
</script>
