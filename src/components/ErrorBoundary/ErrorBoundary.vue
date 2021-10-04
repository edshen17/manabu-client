<template>
  <div>
    <slot name="navbar" />
    <popup-alert-component v-show="showPopup" @popup-close="showPopup = false">{{
      errorMessage
    }}</popup-alert-component>
    <slot name="main" />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import PopupAlertComponent from '../PopupAlert/PopupAlert.vue';

export default Vue.extend({
  name: 'ErrorBoundary',
  components: { PopupAlertComponent },
  props: {
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      err: new Error(),
      errEmitPage: '',
      _showPopup: false,
    };
  },
  computed: {
    showPopup: {
      get: function (): boolean {
        const showPopup = this.err && this.$data._showPopup && this.$route.path == this.errEmitPage;
        return showPopup;
      },
      set: function (newVal: boolean): void {
        this.$data._showPopup = newVal;
      },
    },
    errorMessage: {
      get: function (): string | TranslateResult {
        const errorMessage = this.err.message;
        const errorMessageLocale = this.$t(errorMessage) ? this.$t(errorMessage) : errorMessage;
        return errorMessageLocale;
      },
    },
  },
  errorCaptured(err: Error): boolean {
    this.err = err;
    this.$data._showPopup = true;
    this.errEmitPage = this.$route.path;
    return !this.stopPropagation;
  },
});
</script>
