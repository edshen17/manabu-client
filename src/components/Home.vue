<template>
  <div class="Home">
    <div id="parallax">
      <section>
        <div class="parallax-one">
          <img src='../assets/images/logo_black.png' class='center-home' alt="home-logo"/>
        </div>
      </section>
      <section>
        <div class="block">
           <p>
            {{ $t('homepage.visionStatement') }}
          </p>
          <p class="line-break margin-top-10"></p>
        </div>
      </section>
      <div class="parallax-section">
        <section>
          <h1>{{ $t('homepage.chooseUs') }}</h1>
          <div class="block">
            <b-container fluid>
              <b-row class="flex">
                <b-col v-for="feature in chooseUsData" :key="feature.title" sm="12" md="6" class="flex-item-1">
                  <div class='parallax-section-parent'>
                    <i :class="feature.iconClass" class="mb-1" style="font-size: 2.95em"></i>
                    <h4 class="mx-2 my-2 bold">{{ feature.title }}</h4>
                  </div>
                  <p class="mb-5">{{ feature.text }}</p>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </section>
      </div>
      <section>
        <h1 class='text-center'>{{ $t('homepage.valueProp.innovativeResources.title') }}</h1>
        <div class="block">
          <b-container fluid>
              <b-row class="flex">
                <b-col v-for="card in cardData" :key="card.title" class="flex-item-1 mb-4" md="4" sm="12">
                  <b-card :img-src="card.imgSrc" :img-alt="card.title" img-bottom :title="card.title" class="shadow border-0">
                  </b-card>                  
                </b-col>
              </b-row>
            </b-container>
        </div>
      </section>
      <div class="parallax-section">
        <section>
          <div class="d-flex justify-content-center">
            <b-button variant="primary" class="mt-4" size="lg" to="/teachers">{{ $t('homepage.findTeacher') }}</b-button>
          </div>
          <div class="block">
            <p>
              {{ $t('homepage.beta') }}
            </p>
          </div>
        </section>
      </div>
      <section>
      </section>
    </div>
    <div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from './layouts/LayoutDefault.vue';

export default Vue.extend({
  name: 'Home',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  mounted() {
  },
  computed: {
    isLoggedIn: {
      get() {
        return this.$store.getters.isLoggedIn;
      },
      set(isLoggedIn) {
        return isLoggedIn;
      }
    },
    cardData: {
      get() {
        return [
          {
            title: this.$t('homepage.valueProp.innovativeResources.flashcards'),
            imgSrc: require('../assets/images/feature_1.jpg')
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.report'),
            imgSrc: require('../assets/images/feature_2.jpg')
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.tools'),
            imgSrc: require('../assets/images/feature_3.jpg')
          },
        ]
      }
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
        ]
      }
    } 
  },
  data() {
    return {
    }
  }
})

</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
