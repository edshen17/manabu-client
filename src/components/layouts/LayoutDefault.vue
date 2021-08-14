<template>
  <div class="LayoutDefault" id="LayoutDefault">
    <navbar-component></navbar-component> 
    <main class="LayoutDefault_main relative">
      <slot />
    </main>
    <footer class="bg-light text-black">
    </footer>
  </div>
</template>

<script>
import NavbarComponent from "../Navbar.vue";
import FooterComponent from "../Footer.vue";
export default {
  name: "landing-page",
  components: {
    NavbarComponent,
    FooterComponent
  }
}
</script>
