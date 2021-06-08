<template>
  <div class="LayoutDefault" id="LayoutDefault">
    <div>
      <b-navbar
        toggleable="lg"
        class="navbar navbar-expand-lg navbar-light bg-light"
      >
        <b-navbar-brand>
          <b-link to="/" class="navbar-brand d-lg-inline-block">
            <img src="../../assets/images/nav_logo.svg" width="130"/>
          </b-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-show="true">
              <b-link
                to="/teachers"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Teachers' } "
                >{{ $t('nav.findTeacher') }}</b-link
              >
            </b-nav-item>
            <b-nav-item
              v-show="this.$route.name != 'Dashboard' && this.$route.name != 'Settings'"
            >
              <b-link
                to="/apply"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Apply' } "
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
      <b-container fluid class='p-4'>
        <b-row>
          <b-col></b-col>
          <b-col md="3" sm="12" class='text-center text-lg-start'>
            <h5 class="text-uppercase">{{ $t('footer.titles.about') }}</h5>
            <p>
              {{ $t('footer.aboutText') }}
            </p>
          </b-col>
          <b-col md="3" sm="12" class='text-center text-lg-start'>
            <h5 class="text-uppercase mb-0">{{ $t('footer.titles.more') }}</h5>
            <ul class="list-unstyled mt-2">
              <p v-for='linkData in links' :key='linkData.title' class="mb-2">
                <b-link v-if="!linkData.isExternal" :to="linkData.link" class="text-black">{{ linkData.title }}</b-link>
                <a :href="linkData.link" v-else>{{ linkData.title }}</a>
              </p>
            </ul>
          </b-col>
          <b-col md="3" sm="12">
            <div class="footer-dropdown">
              <b-form-select v-model="lang" :options="localeOptions" class='mb-3'></b-form-select>
              <b-form-select v-model="userCurrency" :options="currencyOptions" class='mb-4'></b-form-select>
            </div>
            <section class="mb-4 footer-icons">
            <i v-for="iconData in icons" style="cursor: pointer;" :key="iconData.link" :class=iconData.iconClass class="fa-lg mr-4" :style="iconData.style" @click="redirectTo(iconData.link)"></i>  
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

<script>
import { languages } from '@/plugins/i18n'
import axios from 'axios'
export default {
  name: 'LayoutDefault',
  computed: {
    isLoggedIn: {
      get() {
        return this.$store.getters.isLoggedIn;
      },
      set(isLoggedIn) {
        return isLoggedIn;
      }
    },
    userData: {
      get() {
        return this.$store.getters.userData;
      },
    },
    userSettings: {
      get() {
        return this.userData.settings;
      },
      set(updatedSettings) {
        this.$store.commit('setUserSettings', updatedSettings)
        if (this.isLoggedIn) {
          axios
          .put(
            `api/user/${this.userData._id}/updateProfile`,
            { settings: updatedSettings },
          )
          .catch((err) => {
            // if err, alert
          });
        }
      }
    },
    userCurrency: {
      get() {
        return this.userSettings.currency;
      },
      set(updatedCurrency) {
        const updatedSettings = this.userSettings
        updatedSettings.currency = updatedCurrency
        this.userSettings = updatedSettings;
      }
    },
    lang: {
      get: function() {
        return this.$store.getters.locale
      },
      set: function(newVal) {
        this.$store.dispatch('changeLocale', newVal)

        // update settings
        const updatedSettings = this.userSettings
        updatedSettings.locale = newVal
        this.userSettings = updatedSettings;
      }
    },
    links: {
      get: function() {
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
          }
        ]
      }
    },

    icons: {
      get: function() {
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
          }, {
            link: 'https://discord.gg/zHpyvN2TVA',
            iconClass: 'fab fa-discord',
          }, {
            link: 'https://wa.me/message/RJYZPGP6LNXNF1',
            iconClass: 'fab fa-whatsapp',
            style: "font-size: 1.7rem;"
          }
        ]
      }
    }
},
methods: {
  redirectTo(link) {
        window.location = link
      },
},
  watch: {
    isLoggedIn(value) { // watch in case of mutations
      this.isLoggedIn = value;
    },
  },
  mounted() {
    this.languageArray.forEach((language) => {
      this.localeOptions.push({
        value: language,
        text: this.langToText[language]
      })
    })
  },
  data() {
    return {
        languageArray: languages,
        langToText: {
          'en': 'English',
          'ja': '日本語'
        },
        localeOptions: [],
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
};
</script>

<style lang="css">
@import "../../assets/css/styles.css";
</style>
