<template>
  <div class="relative" @keydown.esc="showDropdown = false">
    <button
      class="relative z-10 block h-12 w-12 rounded-full overflow-hidden mx-4"
      tabindex="0"
      @click="showDropdown = !showDropdown"
      @focusout="showDropdown = false"
    >
      <img
        class="
          h-full
          w-full
          object-cover
          border-2 border-gray-600
          focus:outline-none focus:border-white
        "
        src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
      />
    </button>
    <div
      v-show="showDropdown"
      class="absolute right-0 mt-2 py-2 w-80 bg-gray-800 rounded-sm shadow-xl"
    >
      <ul>
        <li class="px-4 py-2 text-white hover:text-white">ssa</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AccountDropdown',
  components: {},
  model: {},
  props: {},
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});
</script>
