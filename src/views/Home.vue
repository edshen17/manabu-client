<template>
  <div>
    <main>
      <section class="relative">
        <div class="container mx-auto">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-8/12 lg:py-4">
              <div class="flex flex-wrap lg:flex-nowrap pb-10">
                <div
                  class="px-4 text-2xl font-bold leading-8 lg:leading-loose lg:w-1/2 text-center order-1 lg:order-first mx-auto"
                >
                  <div class="w-80 mx-auto py-4">
                    Learn Japanese
                    <span class="text-red-500">every day</span>
                    with your own private teacher
                  </div>
                  <button
                    class="bg-red-500 hover:bg-red-400 text-white py-2 px-6 text-lg rounded-lg font-bold mt-1"
                  >
                    Get Started
                  </button>
                </div>
                <div class="lg:w-1/2">
                  <img
                    src="../assets/img/kasumi2x.jpg"
                    class="max-w-full max-h-full lg:max-w-xl justify-end"
                  />
                </div>
              </div>
              <h2 class="-mt-4 py-5 lg:py-8 text-2xl font-semibold text-center tracking-wide">
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
      <section class="relative bg-gray-600 pb-10 lg:pb-12">
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
                class="pb-8 w-9/12 md:w-5/12 lg:w-7/12 2xl:w-9/12 mx-auto bg-white transform duration-500 hover:-translate-y-1 rounded-xl"
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
          </div>
        </div>
      </section>
      <section class="relative h-auto pb-10 lg:pb-12" style="background-color: #fdfbf6">
        <div class="container mx-auto px-4 py-3">
          <div class="flex flex-wrap text-center justify-center">
            <div class="w-full lg:w-8/12">
              <i class="fas fa-crown text-6xl text-red-400 my-5"></i>
              <h2
                class="text-2xl font-semibold text-center tracking-wide text-black capitalize lg:w-1/2 mx-auto"
              >
                #1 Online Japanese School in Singapore
              </h2>
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
