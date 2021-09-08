<template>
  <div class="relative" @keydown.esc="showDropdown = false">
    <button
      class="
        h-12
        w-12
        mx-4
        relative
        z-10
        block
        rounded-full
        overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent
      "
      @click="toggleDropdown"
    >
      <img
        class="h-full w-full object-cover"
        src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
      />
    </button>
    <fade-in-out>
      <div
        v-show="showDropdown"
        v-click-outside="closeDropdown"
        class="absolute right-0 mt-2 py-2 w-80 bg-gray-800 rounded-sm shadow-xl"
      >
        <ul>
          <li
            v-for="routerLink in innerRouterLinks"
            :key="routerLink.title"
            class="px-4 py-2 text-white hover:text-white"
          >
            <router-link
              v-show="routerLink.isShowing"
              :to="routerLink.link"
              class="inline-block py-3 md:py-2 px-4 text-white no-underline"
              >{{ routerLink.title }}</router-link
            >
          </li>
        </ul>
      </div>
    </fade-in-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FadeInOut from './FadeInOut.vue';

export default Vue.extend({
  name: 'AccountDropdown',
  components: { FadeInOut },
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
      const isClickingProfileImage = event!.target.tagName.toLowerCase() == 'img';
      if (this.showDropdown && !isClickingProfileImage) {
        this.showDropdown = false;
      }
    },
  },
});
</script>
