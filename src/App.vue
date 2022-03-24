<template>
  <component :is="$route.meta.layout || 'div'" class="font-noto-sans" translate="no">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />
    <router-view />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  computed: {},
  async created() {
    await this.$store.dispatch('user/getEntityStateData');
    await this.$store.dispatch('exchangeRate/getEntityStateData');
  },
});
</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
</style>
