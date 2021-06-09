<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from '../components/layouts/LayoutDefault.vue';
export default Vue.extend({
  name: 'Home',
  computed: {
    cardData: {
      get() {
        return [
          {
            title: this.$t('homepage.valueProp.innovativeResources.flashcards'),
            imgSrc: require('../assets/images/feature_1.jpg'),
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.report'),
            imgSrc: require('../assets/images/feature_2.jpg'),
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.tools'),
            imgSrc: require('../assets/images/feature_3.jpg'),
          },
        ];
      },
    },
    chooseUsData: {
      get() {
        return [
          {
            title: this.$t('homepage.valueProp.tailoredLessonsTitle'),
            text: this.$t('homepage.valueProp.tailoredLessonsText'),
            iconClass: 'fas fa-language fa-2x inline mb-1',
          },
          {
            title: this.$t('homepage.valueProp.immersionTitle'),
            text: this.$t('homepage.valueProp.immersionText'),
            iconClass: 'fas fa-headphones fa-2x inline mb-1',
          },
          {
            title: this.$t('homepage.valueProp.dataAnalyticsTitle'),
            text: this.$t('homepage.valueProp.dataAnalyticsText'),
            iconClass: 'fas fa-chart-bar fa-2x inline mb-1',
          },
          {
            title: this.$t('homepage.valueProp.communityTitle'),
            text: this.$t('homepage.valueProp.communityText'),
            iconClass: 'fas fa-hands-helping fa-2x inline mb-1',
          },
        ];
      },
    },
  },
});
</script>

<style lang="css">
@import '../../src/assets/css/styles.css';
</style>
