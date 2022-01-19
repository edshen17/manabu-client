<template>
  <div class="relative" @keydown.esc="showDropdown = false">
    <button
      class="
        h-10
        w-10
        mx-4
        relative
        z-10
        block
        rounded-full
        overflow-hidden
        outline-none
        border-transparent
        ring-0
        focus:ring-pink-600 focus:ring-2
      "
      :class="{
        'outline-none ring-2 ring-pink-600  border-transparent': showDropdown || isHovering,
      }"
      @click="toggleDropdown"
      @mouseover="toggleHover"
      @mouseleave="toggleHover"
    >
      <img class="h-full w-full object-cover" :src="userData.profileImageUrl" />
    </button>
    <fade-in-out>
      <div v-show="showDropdown" class="absolute m-3 right-0 w-80 bg-gray-800 rounded-md shadow-xl">
        <basic-account-dropdown
          v-click-outside="closeDropdown"
          :inner-router-links="innerRouterLinks"
          router-link-class="py-4 lg:py-2 lg:px-4 inline-block no-underline w-full h-full lg:hover:bg-gray-600 lg:rounded-md text-white"
          active-router-link-class="bg-gray-700"
          @linkClick="showDropdown = false"
        ></basic-account-dropdown>
      </div>
    </fade-in-out>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FadeInOut from '../FadeInOut/FadeInOut.vue';
import { mapGetters } from 'vuex';
import BasicAccountDropdown from './BasicAccountDropdown.vue';

export default Vue.extend({
  name: 'ExtendedAccountDropdown',
  components: { FadeInOut, BasicAccountDropdown },
  props: {
    innerRouterLinks: {
      required: false,
      type: Array,
    },
  },
  data() {
    return {
      showDropdown: false,
      isHovering: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
  },
  mounted() {
    return;
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    toggleHover() {
      this.isHovering = !this.isHovering;
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
