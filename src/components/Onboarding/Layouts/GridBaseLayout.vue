<template>
  <div class="container w-11/12 mx-auto min-h-screen">
    <h2 class="flex justify-center text-2xl font-bold my-4 pb-8 lg:text-3xl lg:my-16">
      {{ stepTitle }}
    </h2>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GridBaseLayout',
  components: {},
  props: {
    stepTitle: {
      type: String,
      required: true,
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
