<template>
  <button
    class="
      py-2
      flex
      w-full
      md:w-9/12
      lg:w-6/12
      mx-auto
      border-solid border
      rounded-lg
      bg-green-700
      text-white
      justify-center
      text-uppercase
    "
    @click="$emit('click')"
  >
    {{ buttonText }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GridButton',
  components: {},
  props: {
    buttonText: {
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
