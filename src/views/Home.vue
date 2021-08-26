<template>
  <div>
    <main>
      <div
        class="relative h-full flex content-center items-center justify-center"
      >
        <div class="absolute top-0 w-full h-full bg-cover bg-main lg:bg-fixed bg-left-bottom">
          <span
            id="blackOverlay"
            class="w-full h-full absolute opacity-40 bg-black"
          ></span>
        </div>
        <div class="container relative mx-auto">
          <div class="items-center flex flex-wrap">
            <div class="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
              <img src="../assets/img/logo_white.png" />
            </div>
          </div>
        </div>
      </div>
      <section class="relative py-8">
        <div
          class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
          style="height: 80px"
        ></div>
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center mb-8">
            <div class="w-full lg:w-8/12 px-4">
              <h2 class="text-3xl font-semibold text-center tracking-wide mb-10">
                  {{ $t('homepage.visionStatementTitle') }}
                </h2>
                <p class="text-xl m-4 md:leading-8">
                  {{ $t('homepage.visionStatementText') }}
                </p>
                <hr class="my-10 border-gray-300"/>
              <h2 class="text-3xl font-semibold text-center tracking-wide mb-10">
                {{ $t('homepage.chooseUsTitle') }}
              </h2>
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 md:gap-y-7"
              >
                <div v-for="feature in chooseUsData" :key="feature.title">
                  <div class="text-center">
                    <span class="fa-stack fa-2x">
                      <i class="fas fa-circle fa-stack-2x text-pink-100"></i>
                      <i
                        :class="`${feature.class} fa-stack-1x text-red-400`"
                      ></i>
                    </span>
                    <span
                      class="text-xl text-center uppercase text-gray-600 px-2 font-semibold"
                      >{{feature.title}}</span
                    >
                  </div>
                  <p class="text-xl py-5 md:leading-8">{{feature.text}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="relative block bg-gray-600">
        <div class="container mx-auto px-4 py-8">
          <div class="flex flex-wrap text-center justify-center">
            <div class="w-full lg:w-6/12 px-4">
              <h2 class="text-4xl font-semibold text-white tracking-wide">
                {{ $t('homepage.valueProp.innovativeResources.title') }}
              </h2>
            </div>
          </div>
          <div class="flex flex-wrap mt-12 justify-center">
            <section
              class="grid lg:grid-cols-2 2xl:grid-cols-3 grid-cols-1 gap-12"
            >
              <article
                v-for="card in cardData"
                :key="card.title"
                class="mx-auto max-w-sm pb-8 bg-white transform duration-500 hover:-translate-y-1 shadow-2xl rounded-xl"
              >
                <h2 class="text-center text-3xl my-6 min-h-18 px-12 select-none">
                  {{card.title}}
                </h2>
                <img
                  class="mx-auto h-90 pointer-events-none select-none"
                  :src="card.imgSrc"
                  :alt="card.title"
                />
              </article>
            </section>
          </div>
          <div class="flex flex-wrap mt-12 justify-center text-center text-xl">
            <div class="w-full lg:w-6/12 px-4">
              <button class="bg-red-400 text-white font-bold py-2 px-4 rounded">
                {{ $t('homepage.findTeacher') }}
              </button>
              <p class="py-8 text-white md:leading-8">
                {{ $t('homepage.beta') }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from '../components/LayoutDefault.vue';

export default Vue.extend({
  name: 'Home',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  computed: {
    cardData: {
      get() {
        return [
          {
            title: this.$t('homepage.valueProp.innovativeResources.flashcards'),
            imgSrc: require('../assets/img/feature_1.jpg')
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.reports'),
            imgSrc: require('../assets/img/feature_2.jpg')
          },
          {
            title: this.$t('homepage.valueProp.innovativeResources.tools'),
            imgSrc: require('../assets/img/feature_3.jpg')
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
            class: 'fas fa-circle fa-language',
          },
          {
            title: this.$t('homepage.valueProp.immersionTitle'),
            text: this.$t('homepage.valueProp.immersionText'),
            class: 'fas fa-circle fa-headphones',
          },
          {
            title: this.$t('homepage.valueProp.dataAnalyticsTitle'),
            text: this.$t('homepage.valueProp.dataAnalyticsText'),
            class: 'fas fa-chart-bar',
          },
          {
            title: this.$t('homepage.valueProp.communityTitle'),
            text: this.$t('homepage.valueProp.communityText'),
            class: 'fas fa-hands-helping',
          },
        ]
      }
    },
  },
  data() {
    return {
    }
  },
  mounted() {
    console.log(this.$route.name)
  }
});
</script>