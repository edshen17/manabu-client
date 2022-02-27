<template>
  <i :class="`flag-icon flag-icon-${countryCode} ${iconClass}`"></i>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FlagIcon',
  components: {},
  props: {
    countryCode: {
      type: String,
      default: '',
      required: true,
    },
    iconClass: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});
</script>
