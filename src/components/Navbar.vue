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
        ><span class="text-4xl pl-2 font-sans font-bold">Manabu</span></router-link
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
      class="w-full flex-grow lg:flex lg:w-auto"
      :class="{ hidden: !showDropdown, block: showDropdown }"
    >
      <ul class="pt-4 lg:pt-0 list-reset lg:flex justify-end flex-1">
        <li v-for="routerLink in outerRouterLinks" :key="routerLink.title" @click="toggleDropdown">
          <router-link
            v-show="routerLink.isShowing"
            :to="routerLink.link"
            class="px-3 py-4 md:py-2 inline-block no-underline"
            >{{ routerLink.title }}</router-link
          >
        </li>
        <account-dropdown
          v-show="isLoggedIn"
          class="hidden lg:block"
          :inner-router-links="innerRouterLinks"
        ></account-dropdown>
        <div v-show="isLoggedIn" class="h-2/6 lg:hidden border-red-50 my-4">
          <div class="w-11/12 mx-auto">
            <hr class="my-1 border-gray-400 mx-auto" />
            <div class="grid grid-flow-col grid-cols-12">
              <div class="col-span-4">
                <img
                  class="my-4 mx-4 h-16 w-16 relative z-10 block rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
                />
              </div>
              <div class="col-span-8 my-3 font-semi-bold">
                <p class="text-lg">greencopter4444</p>
                <div class="flex flex-wrap space-x-4 mt-3">
                  <p>Level 53</p>
                  <span class="border-l-2 border-gray-400"></span>
                  <p>Lifetime</p>
                </div>
              </div>
            </div>
            <hr class="my-1 border-gray-400 mx-auto" />
            <ul class="my-4">
              <li
                v-for="routerLink in innerRouterLinks"
                :key="routerLink.title"
                class="lg:hover:bg-gray-600 rounded-md"
              >
                <router-link
                  v-show="routerLink.isShowing"
                  :to="routerLink.link"
                  class="py-4 md:py-2 text-black inline-block no-underline"
                  >{{ routerLink.title }}</router-link
                >
              </li>
            </ul>
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
