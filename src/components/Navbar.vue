<template>
  <nav
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
    tabindex="0"
    @focusout="showMenu = false"
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <router-link to="/" class="text-black no-underline"
        ><span class="text-3xl pl-2 font-sans font-bold">Manabu</span></router-link
      >
    </div>
    <button
      class="
        cursor-pointer
        text-xl
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
      @click="toggleNavbar()"
    >
      <i class="text-black fas fa-bars"></i>
    </button>
    <div
      class="w-full flex-grow lg:flex lg:items-center lg:w-auto"
      :class="{ hidden: !showMenu, block: showMenu }"
      x-show.transition="true"
    >
      <ul class="pt-6 lg:pt-0 list-reset lg:flex justify-end flex-1 items-center">
        <li v-for="routerLink in routerLinks" :key="routerLink.title" @click="showMenu = !showMenu">
          <router-link
            v-show="routerLink.isShowing"
            :to="routerLink.link"
            class="inline-block py-3 md:py-2 px-4 text-black no-underline"
            >{{ routerLink.title }}</router-link
          >
        </li>
        <account-dropdown class="hidden sm:block"></account-dropdown>
        <div class="px-4 py-5 sm:hidden">
          <div class="flex items-center">
            <img
              class="h-16 w-16 object-cover border-2 border-gray-600 rounded-full"
              src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
            />
            <span class="ml-3 font-semi-bold"> Jane Doe </span>
          </div>
          <div class="">
            <ul class="mt-4">
              <li class="text-gray-400 mt-2">ssa</li>
              <li class="text-gray-400 mt-2">ssa</li>
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

export default Vue.extend({
  name: 'Navbar',
  components: {
    AccountDropdown,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
    isLoggedIn: {
      get: function (): boolean {
        const isLoggedIn = this.userData._id;
        return isLoggedIn;
      },
    },
    routerLinks: {
      get: function (): Array<{ title: TranslateResult; link: string; isShowing: boolean }> {
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
    toggleNavbar: function () {
      this.showMenu = !this.showMenu;
    },
  },
});
</script>
