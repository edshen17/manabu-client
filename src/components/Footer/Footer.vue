<template>
  <div class="border-t-2 border-gray-200">
    <footer class="relative bg-white pt-6 lg:pt-7 pb-6 mx-auto w-11/12">
      <div
        class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
        style="height: 80px"
      ></div>
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-12">
          <div class="col-span-12 lg:col-span-6">
            <h4 class="text-xl font-semibold">{{ $t('footer.questions.title') }}</h4>
            <h5 class="text-md text-gray-700 my-2">
              {{ $t('footer.questions.text') }}
            </h5>
            <div class="flex justify-start flex-wrap">
              <div v-for="icon in iconData" :key="icon.name">
                <a :href="icon.link" :title="icon.name" target="_blank">
                  <i class="mr-10 my-3 text-xl md:text-2xl" :class="icon.class"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-3 my-2">
            <span class="block uppercase text-gray-600 text-md font-semibold">{{
              $t('footer.usefulLinks.title')
            }}</span>
            <ul v-for="usefulLink in usefulLinkData" :key="usefulLink.title" class="list-unstyled">
              <li class="my-2">
                <router-link :to="usefulLink.link">{{ usefulLink.title }}</router-link>
              </li>
            </ul>
          </div>
          <div class="col-span-12 lg:col-span-3 my-2 lg:mt-0">
            <select
              v-model="userLocale"
              class="block w-full rounded-md form-border focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            >
              <option
                v-for="(localeName, localeCode) in SUPPORTED_LOCALES"
                :key="localeCode"
                :value="localeCode"
              >
                {{ localeName }}
              </option>
            </select>
            <select
              v-model="userCurrency"
              class="block w-full rounded-md form-border focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 my-4"
            >
              <option
                v-for="(currencyName, currencyCode) in SUPPORTED_CURRENCIES"
                :key="currencyName"
                :value="currencyCode"
              >
                {{ currencyName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-wrap items-center lg:justify-between justify-center mt-20">
          <div class="w-full lg:w-4/12 px-4 mx-auto text-center">
            <div class="text-sm text-gray-600 font-semibold py-1">
              Copyright © {{ currentYear }}. {{ $t('footer.copyright') }}
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { StringKeyObject } from '../../../../server/types/custom';
import { SUPPORTED_LOCALES } from '../../plugins/i18n';

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      SUPPORTED_LOCALES,
      SUPPORTED_CURRENCIES: Object.freeze({
        SGD: '$ SGD',
        USD: '$ USD',
        JPY: '¥ JPY',
      }),
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
    userId: {
      get(): string {
        const userId = this.userData._id;
        return userId;
      },
    },
    userSettings: {
      get(): StringKeyObject {
        const userSettings = this.userData.settings;
        return userSettings;
      },
    },
    userLocale: {
      get(): string {
        const userLocale = this.userData.settings.locale;
        return userLocale;
      },
      set(locale: string): void {
        const userId = this.userId;
        const settings = this.userSettings;
        this.$store.dispatch('user/updateLocale', {
          locale,
          userId,
          settings,
          currentVueComponent: this,
        });
      },
    },
    userCurrency: {
      get(): string {
        const userCurrency = this.userData.settings.currency;
        return userCurrency;
      },
      set(currency: string): void {
        const userId = this.userId;
        const settings = this.userSettings;
        this.$store.dispatch('user/updateCurrency', {
          currency,
          userId,
          settings,
        });
      },
    },
    iconData: {
      get() {
        return [
          {
            link: 'https://www.facebook.com/ManabuOfficial/',
            class: 'fab fa-facebook-f',
            name: 'Facebook',
          },
          {
            link: 'https://twitter.com/lessonsmanabu',
            class: 'fab fa-twitter',
            name: 'Twitter',
          },
          {
            link: 'https://www.instagram.com/nihongo_manabu_/',
            class: 'fab fa-instagram',
            name: 'Instagram',
          },
          {
            link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
            class: 'fab fa-youtube',
            name: 'Youtube',
          },
          {
            link: 'https://line.me/R/ti/p/%40743ilrvx',
            class: 'fab fa-line',
            name: 'LINE',
          },
          {
            link: 'https://discord.com/invite/zHpyvN2TVA',
            class: 'fab fa-discord',
            name: 'Discord',
          },
          {
            link: 'https://api.whatsapp.com/message/RJYZPGP6LNXNF1',
            class: 'fab fa-whatsapp',
            name: 'WhatsApp',
          },
        ];
      },
    },
    usefulLinkData: {
      get() {
        return [
          {
            link: '/apply',
            title: this.$t('nav.becomeTeacher'),
          },
          {
            link: '/teachers',
            title: this.$t('nav.findTeacher'),
          },
        ];
      },
    },
  },
});
</script>
