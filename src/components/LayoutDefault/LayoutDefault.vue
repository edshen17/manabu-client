<template>
  <div id="LayoutDefault" class="flex flex-col h-screen">
    <error-boundary-component>
      <template #navbar>
        <navbar-component></navbar-component>
      </template>
      <template #main>
        <main class="LayoutDefault_main relative flex-grow">
          <slot />
        </main>
      </template>
      <template #footer>
        <footer-component class="bg-light text-black"></footer-component>
      </template>
    </error-boundary-component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NavbarComponent from '../Navbar/Navbar.vue';
import FooterComponent from '../Footer/Footer.vue';
import ErrorBoundaryComponent from '../ErrorBoundary/ErrorBoundary.vue';

export default Vue.extend({
  name: 'LayoutDefault',
  components: {
    NavbarComponent,
    FooterComponent,
    ErrorBoundaryComponent,
  },
});
</script>
