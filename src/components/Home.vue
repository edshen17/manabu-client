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
              <b-row class="make-it-flex">
                <b-col sm="6" class="flex-item-1">
                  <div class='choose-us-parent'>
                    <i class="fas fa-language fa-2x inline"></i>
                    <h5 class="mx-2 my-1 bold">Customized Lessons</h5>
                  </div>
                  <p class="mt-2">Manabu teachers create personalized lesson plans that fit your learning styles and interests. Excercises and other materials are tailored specifically for you.</p>
                </b-col>
                <b-col sm="6" class="flex-item-1">
                  <div class='choose-us-parent'>
                    <i class="fas fa-headphones fa-2x inline"></i>
                    <h5 class="mx-2 my-1 bold">Immersion</h5>
                  </div>
                  <p class="mt-2">We focus on getting students into a habit of constant learning. We are confident that we can help you immerse and achieve your fluency goals.</p>
                </b-col>
                <b-col sm="6" class="flex-item-1">
                  <div class='choose-us-parent'>
                    <i class="fas fa-chart-bar fa-2x inline"></i>
                    <h5 class="mx-2 my-1 bold">Data Analytics</h5>
                  </div>
                  <p class="mt-2">Through Manabu, you can visualize your progress and growth. This can not only a way to stay motivated, but can also help you find areas of improvement.</p>
                </b-col>
                <b-col sm="6" class="flex-item-1">
                  <div class='choose-us-parent'>
                    <i class="fas fa-hands-helping fa-2x inline"></i>
                    <h5 class="mx-2 my-1 bold">Community</h5>
                  </div>
                  <p class="mt-2">Learning a language can be difficult so if you ever feel stuck we are happy to guide you! We have a supportive community of teachers and staff that will aid you throughout your studies.</p>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </section>
      </div>
    </div>
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
  }
};
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
