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
        class="absolute right-0 mt-2 py-2 w-96 bg-gray-800 rounded-md shadow-xl text-white"
      >
        <div class="w-11/12 mx-auto">
          <div class="grid grid-flow-col grid-cols-3 justify-center">
            <div class="col-span-1">
              <img
                class="my-4 mx-5 h-20 w-20 relative z-10 block rounded-full object-cover"
                src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
              />
            </div>
            <div class="col-span-2 mt-6 ml-1 font-semi-bold justify-center">
              <p class="text-lg">greencopter4444</p>
              <div class="flex flex-wrap space-x-4 mt-3">
                <p>Level 53</p>
                <span class="border-l-2 border-gray-400"></span>
                <p>Lifetime</p>
              </div>
            </div>
          </div>
          <hr class="my-1 px-3 border-gray-400 mx-auto" />
          <ul class="my-2">
            <li
              v-for="routerLink in innerRouterLinks"
              :key="routerLink.title"
              class="px-2 py-1 text-white hover:bg-gray-600 rounded-md"
            >
              <router-link
                v-show="routerLink.isShowing"
                :to="routerLink.link"
                class="inline-block py-3 md:py-2 px-4 no-underline"
                >{{ routerLink.title }}</router-link
              >
            </li>
          </ul>
        </div>
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
      showDropdown: true,
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
