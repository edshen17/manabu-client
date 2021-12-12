<template>
  <div class="container w-11/12 mx-auto">
    <h2 class="mb-5 md:mb-16 pb-8 flex justify-center font-bold text-3xl lg:text-2xl">
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
