<template>
  <footer class="relative bg-white pt-6 lg:pt-7 pb-6 border-t border-gray-400 mx-auto w-11/12">
    <div
      class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
      style="height: 80px"
    ></div>
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-12">
        <div class="col-span-12 lg:col-span-6">
          <h4 class="text-xl font-semibold">{{ $t('footer.questions.title') }}</h4>
          <h5 class="text-lg text-gray-700 my-2">
            {{ $t('footer.questions.text') }}
          </h5>
          <div class="flex justify-start flex-wrap">
            <div v-for="icon in iconData" :key="icon.mediaName" class="">
              <a :href="icon.link" :title="icon.mediaName" target="_blank">
                <i class="mr-10 my-3 text-2xl" :class="icon.class"></i>
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
            class="
              block
              w-full
              rounded-md
              form-border
              focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
            "
          >
            <option
              v-for="(localeName, localeCode) in SUPPORTED_LOCALES"
              :key="localeCode"
              :value="localeCode"
            >
              {{ localeName }}
            </option>
          </select>
        </div>
      </div>
      <hr class="my-6 border-gray-400" />
      <div class="flex flex-wrap items-center lg:justify-between justify-center">
        <div class="w-full lg:w-4/12 px-4 mx-auto text-center">
          <div class="text-sm text-black font-semibold py-1">
            Copyright © {{ currentYear }}. {{ $t('footer.copyright') }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { SUPPORTED_LOCALES } from '../../plugins/i18n';

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      SUPPORTED_LOCALES,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
    userLocale: {
      get(): string {
        const userLocale = this.userData.settings.locale;
        return userLocale;
      },
      set(locale: string): void {
        const _id = this.userData._id;
        const settings = this.userData.settings;
        this.$store.dispatch('user/updateLocale', { locale, _id, settings });
      },
    },
    iconData: {
      get() {
        return [
          {
            link: 'https://www.facebook.com/ManabuOfficial/',
            class: 'fab fa-facebook-f',
            mediaName: 'Facebook',
          },
          {
            link: 'https://twitter.com/lessonsmanabu',
            class: 'fab fa-twitter',
            mediaName: 'Twitter',
          },
          {
            link: 'https://www.instagram.com/nihongo_manabu_/',
            class: 'fab fa-instagram',
            mediaName: 'Instagram',
          },
          {
            link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
            class: 'fab fa-youtube',
            mediaName: 'Youtube',
          },
          {
            link: 'https://line.me/R/ti/p/%40743ilrvx',
            class: 'fab fa-line',
            mediaName: 'LINE',
          },
          {
            link: 'https://discord.com/invite/zHpyvN2TVA',
            class: 'fab fa-discord',
            mediaName: 'Discord',
          },
          {
            link: 'https://api.whatsapp.com/message/RJYZPGP6LNXNF1',
            class: 'fab fa-whatsapp',
            mediaName: 'WhatsApp',
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
