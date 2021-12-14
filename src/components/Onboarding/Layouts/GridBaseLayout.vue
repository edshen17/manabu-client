<template>
  <div class="container w-11/12 mx-auto">
    <h2 class="pb-8 md:mb-5 flex justify-center text-center font-bold text-2xl mx-auto">
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
