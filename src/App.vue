<template>
  <component :is="layout" class="font-noto-sans">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />
    <router-view :layout.sync="layout" />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      layout: 'div',
    };
  },
  created() {
    // this.$store.dispatch('fetchUserData');
  }
});
</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
</style>