<template>
  <nav
    v-click-outside="closeDropdown"
    class="
      flex
      items-center
      justify-between
      flex-wrap
      p-6
      lg:sticky
      w-full
      z-20
      top-0
      bg-white
      shadow-md
      relative
    "
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <router-link to="/" class="text-black no-underline"
        ><span class="text-3xl pl-2 font-sans font-bold">Manabu</span></router-link
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
      class="w-full flex-grow lg:flex lg:items-center lg:w-auto"
      :class="{ hidden: !showDropdown, block: showDropdown }"
    >
      <ul class="pt-6 lg:pt-0 list-reset lg:flex justify-end flex-1 items-center">
        <li v-for="routerLink in outerRouterLinks" :key="routerLink.title" @click="toggleDropdown">
          <router-link
            v-show="routerLink.isShowing"
            :to="routerLink.link"
            class="inline-block py-3 md:py-2 px-4 text-black no-underline"
            >{{ routerLink.title }}</router-link
          >
        </li>
        <hr v-show="isLoggedIn" class="my-4 border-gray-300" />
        <account-dropdown
          v-show="isLoggedIn"
          class="hidden lg:block"
          :inner-router-links="innerRouterLinks"
        ></account-dropdown>
        <div v-show="isLoggedIn" class="px-4 h-32 lg:hidden">
          <div class="flex items-center">
            <img
              class="h-14 w-14 object-cover rounded-full"
              src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
            />
            <span class="relative">
              <p class="ml-3 font-semi-bold">Jane Doe</p>
              <ul class="mt-3 block absolute left-6 border-l-2 border-gray-300">
                <li class="text-gray-400 mt-2 pl-2 right-0">ssa</li>
                <li class="text-gray-400 mt-2 pl-2">ssa</li>
              </ul>
            </span>
          </div>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { TranslateResult } from 'vue-i18n';
import AccountDropdown from './AccountDropdown.vue';

type RouterLink = {
  title: TranslateResult;
  link: string;
  isShowing: boolean;
  children?: RouterLink[];
};

export default Vue.extend({
  name: 'Navbar',
  components: {
    AccountDropdown,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
    }),
    outerRouterLinks: {
      get: function (): RouterLink[] {
        return [
          {
            title: this.$t('nav.becomeTeacher'),
            link: '/apply',
            isShowing: !this.isLoggedIn,
          },
          {
            title: this.$t('nav.findTeacher'),
            link: '/teachers',
            isShowing: true,
          },
          {
            title: this.$t('nav.login'),
            link: '/login',
            isShowing: !this.isLoggedIn,
          },
          {
            title: this.$t('nav.signup'),
            link: '/signup',
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
            link: '/profile',
            isShowing: this.isLoggedIn,
          },
          {
            title: this.$t('nav.settings'),
            link: '/settings',
            isShowing: this.isLoggedIn,
            children: [
              {
                title: this.$t('nav.logout'),
                link: '/logout',
                isShowing: this.isLoggedIn,
              },
            ],
          },
          {
            title: this.$t('nav.logout'),
            link: '/logout',
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
