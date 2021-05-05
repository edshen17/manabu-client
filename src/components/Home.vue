<template>
  <div class="Home">
    <div id="parallax">
      <section>
        <div class="parallax-one">
          <img src='../assets/images/logo_white.png' class='center-home'/>
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
      <div class="choose-us">
        <section>
          <h1>{{ $t('homepage.chooseUs') }}</h1>
          <div class="block">
            <b-container fluid>
              <b-row class="flex">
                <b-col v-for="feature in chooseUsData" :key="feature.title" sm="12" md="6" class="flex-item-1">
                  <div class='choose-us-parent'>
                    <i :class="feature.iconClass"></i>
                    <h5 class="mx-2 my-1 bold">{{ feature.title }}</h5>
                  </div>
                  <p class="mt-2">{{ feature.text }}</p>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </section>
      </div>
      <section>
        <h1 class='text-center'>Innovative Digital Resources</h1>
        <img src=""/>
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
    </div>
    <div></div>
  </div>
</template>

<script>
import LayoutDefault from './layouts/LayoutDefault';
export default {
  name: 'Home',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  mounted() {
  },
  data() {
    return {
      cardData : [
        {
          title: 'Digital Flashcards',
          imgSrc: require('../assets/images/flashcard_1.png')
        },
        {
          title: 'Progress Report',
          imgSrc: require('../assets/images/flashcard_1.png')
        },
        {
          title: 'E-learning Tools',
          imgSrc: require('../assets/images/flashcard_1.png')
        },
      ],
      chooseUsData: [
        {
          title: 'Tailored Lessons',
          text: 'Manabu teachers create personalized lesson plans that fit your learning styles and interests. Excercises and other materials are customized specifically for you.',
          iconClass: 'fas fa-language fa-2x inline',
        },
        {
          title: 'Immersion',
          text: 'We focus on getting students into a habit of constant learning. We are confident that we can help you immerse and achieve your fluency goals.',
          iconClass: 'fas fa-headphones fa-2x inline',
        },
        {
          title: 'Data Analytics',
          text: 'Through Manabu, you can visualize your progress and growth. This can not only a way to stay motivated, but can also help you find areas of improvement.',
          iconClass: 'fas fa-chart-bar fa-2x inline',
        },
        {
          title: 'Community',
          text: 'Learning a language can be difficult, so if you ever feel stuck we are happy to guide you! We have a supportive community of teachers and staff that will aid you throughout your studies.',
          iconClass: 'fas fa-hands-helping fa-2x inline',
        },
      ]
    }
  }
};
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
