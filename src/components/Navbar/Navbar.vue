<template>
  <nav
    v-click-outside="closeDropdown"
    class="
      flex
      items-center
      justify-between
      flex-wrap
      p-4
      lg:sticky
      w-full
      z-20
      top-0
      bg-white
      shadow-md
      relative
    "
  >
    <div class="flex items-center flex-shrink-0 mr-6">
      <router-link
        to="/"
        class="text-black no-underline text-3xl lg:text-4xl pl-2 font-sans font-bold"
        @click="closeDropdown"
        >Manabu</router-link
      >
    </div>
    <button
      class="
        cursor-pointer
        text-3xl
        leading-none
        px-3
        py-1
        border border-solid border-transparent
        rounded
        bg-transparent
        block
        lg:hidden
        outline-none
        focus:outline-none
      "
      type="button"
      @click="toggleDropdown"
    >
      <i class="text-black fas fa-bars"></i>
    </button>
    <div
      class="py-2 w-full flex-grow lg:flex lg:w-auto"
      :class="{ hidden: !showDropdown, block: showDropdown }"
    >
      <div class="lg:flex justify-end flex-1 block items-center">
        <basic-account-dropdown-link
          :router-links="outerRouterLinks"
          div-class="block lg:inline-block text-gray-500"
          router-link-class="px-3 py-3 lg:py-2 lg:px-5 block no-underline text-md"
          @linkClick="closeDropdown"
        ></basic-account-dropdown-link>
        <extended-account-dropdown
          v-show="isLoggedIn"
          class="hidden lg:block"
          :inner-router-links="innerRouterLinks"
        ></extended-account-dropdown>
        <basic-account-dropdown
          v-show="isLoggedIn"
          :inner-router-links="innerRouterLinks"
          class="h-2/6 lg:hidden mt-4"
          div-class="text-gray-500"
          @linkClick="closeDropdown"
        ></basic-account-dropdown>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { TranslateResult } from 'vue-i18n';
import ExtendedAccountDropdown from '../AccountDropdown/ExtendedAccountDropdown.vue';
import BasicAccountDropdown from '../AccountDropdown/BasicAccountDropdown.vue';
import BasicAccountDropdownLink from '../AccountDropdown/BasicAccountDropdownLink.vue';

type RouterLink = {
  title: TranslateResult;
  path: string;
  isShowing: boolean;
};

export default Vue.extend({
  name: 'Navbar',
  components: {
    ExtendedAccountDropdown,
    BasicAccountDropdown,
    BasicAccountDropdownLink,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      userData: 'user/entityStateData',
    }),
    outerRouterLinks: {
      get: function (): RouterLink[] {
        return [
          {
            title: this.$t('nav.becomeTeacher'),
            path: '/apply',
            isShowing: !this.isLoggedIn,
          },
          {
            title: this.$t('nav.findTeacher'),
            path: '/teachers',
            isShowing: true,
          },
          {
            title: this.$t('nav.login'),
            path: '/login',
            isShowing: !this.isLoggedIn,
          },
          {
            title: this.$t('nav.signup'),
            path: '/signup',
            isShowing: !this.isLoggedIn,
          },
        ];
      },
    },
    innerRouterLinks: {
      get: function (): RouterLink[] {
        return [
          {
            title: this.$t('nav.profile'),
            path: '/profile',
            isShowing: this.isLoggedIn,
          },
          {
            title: this.$t('nav.settings'),
            path: '/onboarding',
            isShowing: this.isLoggedIn,
          },
          {
            title: this.$t('nav.logout'),
            path: '/logout',
            isShowing: this.isLoggedIn,
          },
        ];
      },
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown() {
      this.showDropdown = false;
    },
  },
});

export { RouterLink };
</script>
