<template>
  <div>
    <slot name="navbar" />
    <popup-alert-component>{{ err }}</popup-alert-component>
    <slot name="main" />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupAlertComponent from './PopupAlert.vue';

export default Vue.extend({
  name: 'ErrorBoundary',
  components: { PopupAlertComponent },
  props: {
    stopPropagation: Boolean,
  },
  data() {
    return {
      err: false,
      vm: null,
      info: null,
    };
  },
  errorCaptured(err: any, vm: any, info: any): any {
    this.err = err;
    this.vm = vm;
    this.info = info;
    return !this.stopPropagation;
  },
});
</script>