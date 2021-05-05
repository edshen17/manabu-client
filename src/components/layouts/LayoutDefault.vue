<template>
  <div class="LayoutDefault" id="LayoutDefault">
    <div>
      <b-navbar
        toggleable="lg"
        class="navbar navbar-expand-lg navbar-light bg-light"
      >
        <b-navbar-brand>
          <b-link to="/" class="navbar-brand d-lg-inline-block">
            Manabu
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
                >Find a Teacher</b-link
              >
            </b-nav-item>
            <b-nav-item
              v-show="this.$route.name != 'Dashboard' && this.$route.name != 'Settings'"
            >
              <b-link
                to="/apply"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Apply' } "
                >Become a Teacher</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/login"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Log In' } "
                >Log In</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="!this.isLoggedIn">
              <b-link
                to="/signup"
                class="nav-link menu-item"
                :class=" { active: $route.name == 'Sign Up' }"
                >Sign Up</b-link
              >
            </b-nav-item>
            <b-nav-item v-show="this.isLoggedIn">
              <b-link to="/logout" class="nav-link menu-item">Logout</b-link>
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
          <b-col class='text-center text-lg-start'>
            <h5 class="text-uppercase">About</h5>
            <p>
              Minato Manabu (Pte. Ltd) is a startup focused on empowering people
              through education. Its headquarters are located in Singapore and
              the company strives to provide students with innovative learning
              tools and high quality lessons.
            </p>
          </b-col>
          <b-col class='text-center text-lg-start'>
            <h5 class="text-uppercase mb-0">More</h5>
            <ul class="list-unstyled mt-2">
              <li v-for='linkData in links' :key='linkData.title' class="mb-2">
                <b-link v-if="!linkData.isExternal" :to="linkData.link" class="text-black">{{ linkData.title }}</b-link>
                <a :href="linkData.link" v-else>{{ linkData.title }}</a>
              </li>
            </ul>
          </b-col>
          <b-col>
            <div class="footer-dropdown">
              <b-form-select v-model="lang" :options="localeOptions" class='mb-3'></b-form-select>
              <b-form-select v-model="userCurrency" :options="currencyOptions" class='mb-2'></b-form-select>
            </div>
            <section class="mb-4">
            <i v-for="iconData in icons" style="cursor: pointer;" :key="iconData.link" :class=iconData.iconClass @click="redirectTo(iconData.link)"></i>  
            </section>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
      <div class="text-center p-3 bg-light">
        Copyright © 2021. Minato Manabu. 68 Circular Road, #02-01, 049422,
        Singapore. All Rights Reserved.
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
        axios
          .put(
            `api/user/${this.userData._id}/updateProfile`,
            { settings: updatedSettings },
          )
          .catch((err) => {
            // if err, alert
            console.log(err);
          });
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
        if (this.isLoggedIn) { // update profile
          const updatedSettings = this.userSettings
          updatedSettings.locale = newVal
          this.userSettings = updatedSettings;
        }
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
        links: [
          {
            title: 'Become a teacher',
            link: '/apply',
            isExternal: false,
          },
          {
            title: 'Find a teacher',
            link: '/teachers',
            isExternal: false,
          },
          {
            title: 'Manabu Guidelines',
            link: 'https://docs.google.com/document/d/1dSeF8bpURoVB3N2H4nDqbU_hXFsJIErHJPBlavXukmo/edit',
            isExternal: true,
          }
        ],
        icons: [
          {
            link: 'https://www.facebook.com/ManabuOfficial/',
            iconClass: 'fab fa-facebook-f fa-lg mr-5 mt-4',
          },
          {
            link: 'https://twitter.com/lessonsmanabu',
            iconClass: 'fab fa-twitter fa-lg mr-5',
          },
          {
            link: 'https://www.instagram.com/nihongo_manabu_/',
            iconClass: 'fab fa-instagram fa-lg mr-5',
          },
          {
            link: 'https://www.youtube.com/channel/UCwtTZCZ9apsj7zNn7n1eS5w',
            iconClass: 'fab fa-youtube fa-lg mr-5',
          },
          {
            link: 'https://lin.ee/Ag4MMyk',
            iconClass: 'fab fa-line fa-lg mr-5',
          }
        ],
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
