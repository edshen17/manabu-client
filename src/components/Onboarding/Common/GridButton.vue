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
      rounded-md
      bg-green-600
      text-white
      justify-center
      uppercase
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
