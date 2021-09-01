<template>
  <div class="flex flex-col h-screen" id="LayoutDefault">
    <error-boundary-component>
      <template v-slot:navbar>
        <navbar-component></navbar-component>
      </template>
      <template v-slot:main>
        <main class="LayoutDefault_main relative flex-grow">
          <slot />
        </main>
      </template>
      <template v-slot:footer>
        <footer-component class="bg-light text-black"></footer-component>
      </template>
    </error-boundary-component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NavbarComponent from './Navbar.vue';
import FooterComponent from './Footer.vue';
import ErrorBoundaryComponent from './ErrorBoundary.vue';

export default Vue.extend({
  name: 'LayoutDefault',
  components: {
    NavbarComponent,
    FooterComponent,
    ErrorBoundaryComponent,
  },
});
</script>
