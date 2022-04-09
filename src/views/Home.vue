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
                  <div
                    class="w-80 mx-auto pt-4 pb-10 lg:text-4xl lg:pt-28 lg:tracking-wide"
                    style="line-height: 3rem"
                  >
                    Learn Japanese
                    <span class="text-red-500">every day</span>
                    with your own private teacher
                  </div>
                  <router-link
                    class="bg-red-500 hover:bg-red-400 text-white py-2 px-6 text-xl rounded-lg font-bold mt-1"
                    to="/teachers"
                    >{{ $t('button.homepage.getStarted') }}</router-link
                  >
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
        <div class="container mx-auto px-4 py-2">
          <div class="flex flex-wrap text-center justify-center pt-6">
            <div class="container px-5 mx-auto">
              <h1 class="text-2xl font-semibold title-font text-gray-900 mb-9 text-center">
                {{ $t('homepage.testimonials.title') }}
              </h1>
              <div class="flex flex-wrap">
                <div
                  v-for="testimonial in testimonialData"
                  :key="testimonial.reviewer.name"
                  class="mb-6 md:p-4 md:mb-0 md:w-1/2 w-full"
                >
                  <div
                    class="h-full bg-white p-8 rounded shadow-lg transform duration-500 hover:-translate-y-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      class="block w-5 h-5 text-gray-400 mb-4"
                      viewBox="0 0 975.036 975.036"
                    >
                      <path
                        d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"
                      ></path>
                    </svg>
                    <p class="leading-relaxed mb-6 text-left" style="min-height: 13em">
                      {{ testimonial.review }}
                    </p>
                    <a class="inline-flex items-center">
                      <img
                        alt="testimonial"
                        :src="testimonial.reviewer.imgSrc"
                        class="w-16 h-16 rounded-full flex-shrink-0 object-cover object-center"
                      />
                      <span class="flex-grow flex flex-col pl-1 lg:pl-4">
                        <span class="title-font font-medium text-gray-900">{{
                          testimonial.reviewer.name
                        }}</span>
                        <span class="text-gray-500 text-sm">{{
                          testimonial.reviewer.occupation
                        }}</span>
                      </span>
                    </a>
                  </div>
                </div>
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
import { mixpanel } from '@/plugins/mixpanel/index';

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
    testimonialData: {
      get() {
        const testimonialData = [];
        for (let i = 0; i < 4; i++) {
          const index = i + 1;
          const translateKey = `homepage.testimonials.${index}`;
          const testimonial = {
            reviewer: {
              name: this.$t(`${translateKey}.reviewer.name`),
              occupation: this.$t(`${translateKey}.reviewer.occupation`),
              imgSrc: require(`../assets/img/reviewer_${index}.jpg`),
            },
            review: this.$t(`${translateKey}.review`),
          };
          testimonialData.push(testimonial);
        }
        return testimonialData;
      },
    },
  },
  created() {
    mixpanel.track('Landing Page');
  },
});
</script>
