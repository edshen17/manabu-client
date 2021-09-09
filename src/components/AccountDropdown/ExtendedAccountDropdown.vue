<template>
  <div class="relative" @keydown.esc="showDropdown = false">
    <button
      class="h-12 w-12 mx-4 relative z-10 block rounded-full overflow-hidden"
      :class="{
        'outline-none ring-2 ring-pink-600 border-transparent': showDropdown,
      }"
      @click="toggleDropdown"
    >
      <img
        class="h-full w-full object-cover"
        src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
      />
    </button>
    <fade-in-out>
      <div v-show="showDropdown" class="absolute m-3 right-0 w-96 bg-gray-800 rounded-md shadow-xl">
        <basic-account-dropdown
          v-click-outside="closeDropdown"
          :inner-router-links="innerRouterLinks"
          @linkClick="closeDropdown"
        ></basic-account-dropdown>
      </div>
    </fade-in-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FadeInOut from '../FadeInOut.vue';
import BasicAccountDropdown from './BasicAccountDropdown.vue';

export default Vue.extend({
  name: 'ExtendedAccountDropdown',
  components: { FadeInOut, BasicAccountDropdown },
  model: {},
  props: {
    innerRouterLinks: {
      required: false,
      type: Array,
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown(event: any) {
      const itemClicked = event!.target.tagName.toLowerCase();
      const isClickingProfileImage = ['img', 'button'].includes(itemClicked);
      if (this.showDropdown && !isClickingProfileImage) {
        this.showDropdown = false;
      }
    },
  },
});
</script>
