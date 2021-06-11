<template>
  <div class="LayoutDefault" id="LayoutDefault">
    <div>
      <b-navbar toggleable="lg" class="navbar navbar-expand-lg navbar-light bg-light">
        <b-navbar-brand>
          <b-link to="/" class="navbar-brand d-lg-inline-block">
            <img src="../../assets/images/nav_logo.svg" width="130" />
          </b-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-show="true">
              <b-link
                to="/teachers"
                class="nav-link menu-item"
                :class="{ active: $route.name == 'Teachers' }"
                >{{ $t('nav.findTeacher') }}</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="this.$route.name != 'Dashboard' && this.$route.name != 'Settings'">
              <b-link
                to="/apply"
                class="nav-link menu-item"
                :class="{ active: $route.name == 'Apply' }"
                >{{ $t('nav.becomeTeacher') }}</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/login"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Log In' } "
                >{{ $t('nav.login') }}</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/signup"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Sign Up' }"
                >{{ $t('nav.signup') }}</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="this.isLoggedIn">
              <b-link to="/logout" class="nav-link menu-item">{{ $t('nav.logout') }}</b-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <main class="LayoutDefault_main">
      <slot />
    </main>
    <footer class="bg-light text-black">
      <b-container fluid class="p-4">
        <b-row>
          <b-col></b-col>
          <b-col md="3" sm="12" class="text-center text-lg-start">
            <h5 class="text-uppercase">{{ $t('footer.titles.about') }}</h5>
            <p>
              {{ $t('footer.aboutText') }}
            </p>
          </b-col>
          <b-col md="3" sm="12" class="text-center text-lg-start">
            <h5 class="text-uppercase mb-0">{{ $t('footer.titles.more') }}</h5>
            <ul class="list-unstyled mt-2">
              <p v-for="linkData in links" :key="linkData.title" class="mb-2">
                <b-link v-if="!linkData.isExternal" :to="linkData.link" class="text-black">{{
                  linkData.title
                }}</b-link>
                <a :href="linkData.link" v-else>{{ linkData.title }}</a>
              </p>
            </ul>
          </b-col>
          <b-col md="3" sm="12">
            <div class="footer-dropdown">
              <b-form-select v-model="userLocale" :options="localeOptions" class='mb-3'></b-form-select>
              <b-form-select v-model="userCurrency" :options="currencyOptions" class='mb-4'></b-form-select>
            </div>
            <section class="mb-4 footer-icons">
              <i
                v-for="iconData in icons"
                style="cursor: pointer"
                :key="iconData.link"
                :class="iconData.iconClass"
                class="fa-lg mr-4"
                :style="iconData.style"
                @click="redirectTo(iconData.link)"
              ></i>
            </section>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
      <div class="text-center p-3 bg-light">
        {{ $t('footer.copyright') }}
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { TranslateResult } from 'vue-i18n';
import { SUPPORTED_LOCALES } from '../../plugins/i18n';
export default Vue.extend({
  name: 'LayoutDefault',
  computed: {
    ...mapState({
      isLoggedIn: (state: any) => state.user.isLoggedIn,
    }),
    userLocale: {
      get: function(): string {
        return this.$store.state.user.userData.settings.locale;
      },
      set: function(newLocale: string): void {
        const props = {
          newValue: newLocale,
          settingsProperty: 'locale'
        }
        this.$store.dispatch('changeUserSettings', props);
      }
    },
    userCurrency: {
      get: function(): string {
        return this.$store.state.user.userData.settings.currency;
      },
      set: function(newCurrency: string): void {
        const props = {
          newValue: newCurrency,
          settingsProperty: 'currency'
        }
        this.$store.dispatch('changeUserSettings', props);
      }
    },
    links: {
      get: function (): Array<{ title: TranslateResult, link: string, isExternal: boolean }> {
        return [
          {
            title: this.$t('nav.becomeTeacher'),
            link: '/apply',
            isExternal: false,
          },
          {
            title: this.$t('nav.findTeacher'),
            link: '/teachers',
            isExternal: false,
          },
          {
            title: this.$t('nav.guidelines'),
            link: 'https://docs.google.com/document/d/1dSeF8bpURoVB3N2H4nDqbU_hXFsJIErHJPBlavXukmo/edit',
            isExternal: true,
          },
        ];
      },
    },
    icons: {
      get: function () {
        return [
          {
            link: 'https://www.facebook.com/ManabuOfficial/',
            iconClass: 'fab fa-facebook-f',
          },
          {
            link: 'https://twitter.com/lessonsmanabu',
            iconClass: 'fab fa-twitter',
          },
          {
            link: 'https://www.instagram.com/nihongo_manabu_/',
            iconClass: 'fab fa-instagram',
          },
          {
            link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
            iconClass: 'fab fa-youtube',
          },
          {
            link: 'https://lin.ee/Ag4MMyk',
            iconClass: 'fab fa-line',
          },
          {
            link: 'https://discord.gg/zHpyvN2TVA',
            iconClass: 'fab fa-discord',
          },
          {
            link: 'https://wa.me/message/RJYZPGP6LNXNF1',
            iconClass: 'fab fa-whatsapp',
            style: 'font-size: 1.7rem;',
          },
        ];
      },
    },
    localeOptions: {
      get: function(): Array<{value: string, text: string}> {
        const localeOptions = [];
        for (const property in SUPPORTED_LOCALES) {
          localeOptions.push({
            value: property,
            text: SUPPORTED_LOCALES[property],
          })
        }
        return localeOptions;
      }
    },
  },
  data() {
    return {
        langToText: {
          'en': 'English',
          'ja': '日本語'
        },
        currencyOptions: [
          {
            value: 'SGD',
            text: '$ SGD'
          },
          {
            value: 'USD',
            text: '$ USD'
          },
          {
            value: 'JPY',
            text: '¥ JPY'
          },
        ],
    };
},
});
</script>

<style lang="css">
@import '../../assets/css/styles.css';
</style>
