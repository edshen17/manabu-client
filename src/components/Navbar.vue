<template>
  <nav
    class="flex items-center justify-between flex-wrap p-6 lg:sticky w-full z-10 top-0 bg-white shadow-md"
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <router-link to="/" class="text-black no-underline"
        ><span class="text-3xl pl-2 font-sans font-bold">Manabu</span></router-link
      >
    </div>
    <button
      class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
      type="button"
      v-on:click="toggleNavbar()"
    >
      <i class="text-black fas fa-bars"></i>
    </button>
    <div
      class="w-full flex-grow lg:flex lg:items-center lg:w-auto"
      :class="{'hidden': !showMenu, 'block': showMenu}"
      x-show.transition="true"
    >
      <ul
        class="pt-6 lg:pt-0 list-reset lg:flex justify-end flex-1 items-center"
      >
        <li
          v-for="routerLink in routerLinks"
          :key="routerLink.title"
          class="mr-3"
          @click="showMenu = !showMenu"
        >
          <router-link
            :to="routerLink.link"
            class="inline-block py-2 px-4 text-black no-underline"
            >{{routerLink.title}}</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';

export default Vue.extend({
  name: 'Navbar',
  computed: {
    routerLinks: {
      get: function (): Array<{ title: TranslateResult, link: string }> {
        return [
          {
            title: this.$t('nav.becomeTeacher'),
            link: '/apply',
          },
          {
            title: this.$t('nav.findTeacher'),
            link: '/teachers',
          },
          {
            title: this.$t('nav.login'),
            link: '/login',
          },
          {
            title: this.$t('nav.signup'),
            link: '/signup',
          },
        ];
      },
    }
  },
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    toggleNavbar: function(){
      this.showMenu = !this.showMenu;
    }
  }
})
</script>