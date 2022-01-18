<template>
  <div>
    <main>
      <div class="relative h-full flex content-center items-center justify-center">
        <div class="absolute top-0 w-full h-full bg-cover bg-main lg:bg-fixed bg-left-bottom">
          <span id="blackOverlay" class="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
        <div class="container relative mx-auto">
          <div class="items-center flex flex-wrap">
            <div class="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
              <img src="../assets/img/logo_white.png" />
            </div>
          </div>
        </div>
      </div>
      <section class="relative">
        <div class="container mx-auto">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-8/12">
              <h2 class="py-5 lg:py-8 text-2xl font-semibold text-center tracking-wide">
                {{ $t('homepage.vision.title') }}
              </h2>
              <p class="px-4 text-lg leading-8 lg:leading-loose">
                {{ $t('homepage.vision.text') }}
              </p>
              <hr class="mt-8 mb-2 mx-4 border-gray-300" />
            </div>
          </div>
        </div>
      </section>
      <section class="relative mb-8">
        <div class="container mx-auto">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-8/12 px-4">
              <h2 class="pb-7 text-2xl font-semibold text-center tracking-wide">
                {{ $t('homepage.chooseUs.title') }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 md:gap-y-7 md:gap-x-16">
                <div v-for="feature in chooseUsData" :key="feature.title">
                  <div class="py-2 text-center">
                    <span class="fa-stack fa-2x">
                      <i class="fas fa-circle fa-stack-2x text-pink-100"></i>
                      <i :class="`${feature.class} fa-stack-1x text-red-400`"></i>
                    </span>
                    <span
                      class="px-3 text-lg uppercase text-gray-600 font-semibold tracking-wide"
                      >{{ feature.title }}</span
                    >
                  </div>
                  <p class="text-lg pt-2 pb-6 leading-8 lg:leading-loose">
                    {{ feature.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="relative bg-gray-600">
        <div class="container mx-auto px-4 py-3">
          <div class="flex flex-wrap text-center justify-center">
            <div class="w-full lg:w-8/12">
              <h2 class="text-2xl font-semibold text-center tracking-wide py-8 text-white">
                {{ $t('homepage.chooseUs.innovativeResources.title') }}
              </h2>
            </div>
          </div>
          <div class="flex flex-wrap py-3">
            <section class="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div
                v-for="card in cardData"
                :key="card.title"
                class="
                  pb-8
                  w-9/12
                  lg:w-7/12
                  2xl:w-9/12
                  mx-auto
                  bg-white
                  transform
                  duration-500
                  hover:-translate-y-1
                  rounded-xl
                "
              >
                <h2 class="py-3 lg:py-5 text-center text-2xl select-none">
                  {{ card.title }}
                </h2>
                <img
                  class="mx-auto pointer-events-none select-none"
                  :src="card.imgSrc"
                  :alt="card.title"
                />
              </div>
            </section>
            <div
              class="
                flex flex-wrap
                mt-12
                justify-center
                text-center text-xl
                leading-8
                lg:leading-loose
              "
            >
              <div class="w-full lg:w-6/12 px-4">
                <p class="py-5 text-white text-lg">
                  {{ $t('homepage.beta') }}
                </p>
                <button
                  class="
                    bg-green-500
                    text-white
                    font-bold
                    py-2
                    px-4
                    rounded
                    text-center text-lg
                    align-middle
                    mt-5
                    mb-14
                  "
                >
                  <router-link to="/signup">{{ $t('button.homepage.signUpNow') }}</router-link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';

export default Vue.extend({
  name: 'Home',
  data() {
    return {};
  },
  computed: {
    cardData: {
      get() {
        return [
          {
            title: this.$t('homepage.chooseUs.innovativeResources.flashcards'),
            imgSrc: require('../assets/img/feature_1.jpg'),
          },
          {
            title: this.$t('homepage.chooseUs.innovativeResources.reports'),
            imgSrc: require('../assets/img/feature_2.jpg'),
          },
          {
            title: this.$t('homepage.chooseUs.innovativeResources.tools'),
            imgSrc: require('../assets/img/feature_3.jpg'),
          },
        ];
      },
    },
    chooseUsData: {
      get(): { title: TranslateResult; text: TranslateResult; class: string }[] {
        return [
          {
            title: this.$t('homepage.chooseUs.tailoredLessons.title'),
            text: this.$t('homepage.chooseUs.tailoredLessons.text'),
            class: 'fas fa-circle fa-language',
          },
          {
            title: this.$t('homepage.chooseUs.immersion.title'),
            text: this.$t('homepage.chooseUs.immersion.text'),
            class: 'fas fa-circle fa-headphones',
          },
          {
            title: this.$t('homepage.chooseUs.dataAnalytics.title'),
            text: this.$t('homepage.chooseUs.dataAnalytics.text'),
            class: 'fas fa-chart-bar',
          },
          {
            title: this.$t('homepage.chooseUs.community.title'),
            text: this.$t('homepage.chooseUs.community.text'),
            class: 'fas fa-hands-helping',
          },
        ];
      },
    },
  },
});
</script>
