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
            <b-container>
            <b-row>
              <b-col sm="6">
                <i class="fas fa-chart-bar fa-2x"></i>
                <h5 style="display: inline" class="mx-2 bold">Data Analytics</h5>
                <p class="mt-2">Duolingo lessons adapt to your learning style. Exercises are tailored to help you learn and review vocabulary effectively.</p>
                <br />
                <i class="fas fa-chart-bar fa-2x"></i>
                <h5 style="display: inline" class="mx-2 text-center">Data Analytics</h5>
                <p class="mt-2">Duolingo lessons adapt to your learning style. Exercises are tailored to help you learn and review vocabulary effectively.</p>
              </b-col>
              <b-col sm="6">
                <i class="fas fa-chart-bar fa-2x"></i>
                <h5 style="display: inline" class="mx-2 text-center bold">Data Analytics</h5>
                <p class="mt-2">Duolingo lessons adapt to your learning style. Exercises are tailored to help you learn and review vocabulary effectively.</p>
                <br />
                <i class="fas fa-chart-bar fa-2x"></i>
                <h5 style="display: inline" class="mx-2 text-center">Data Analytics</h5>
                <p class="mt-2">Duolingo lessons adapt to your learning style. Exercises are tailored to help you learn and review vocabulary effectively.</p>
              </b-col>
            </b-row>
          </b-container>
          </div>
        </section>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <div class="card mb-2">
            <img
              class="card-img-top"
              src="https://static.wixstatic.com/media/0b4d3da40646462f99177b0d7db4697f.jpg/v1/fill/w_846,h_619,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01/0b4d3da40646462f99177b0d7db4697f.webp"
              alt="Card image cap"
            />
            <div class="card-body bg-dark text-white">
              <h5 class="card-title">Progress with visuals and data</h5>
              <p class="card-text">
                Your progress is hard to measure unless you take an exam. Your
                effort cannot be seen, the time you spent is not visible, but
                what if you could see everything? We will analyze your progress
                from many aspects and visualize your effort. As you progress the
                character will move forward on the progress bar.　Completely
                record and analyze lesson progress and student growth. Since we
                are in charge of that part, we can concentrate on teaching, and
                it is possible to make a full-scale lesson plan using data etc.
              </p>
            </div>
          </div>

          <div class="card mb-4">
            <img
              class="card-img-top"
              src="https://static.wixstatic.com/media/0b4d3da40646462f99177b0d7db4697f.jpg/v1/fill/w_846,h_613,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01/0b4d3da40646462f99177b0d7db4697f.webp"
              alt="Card image cap"
            />
            <div class="card-body bg-dark text-white">
              <h5 class="card-title">Goal-oriented studying</h5>
              <p class="card-text">
                Achieve your goal with your teacher. We understand the need for
                goals. Reflect on your strengths, weaknesses, threats and
                opportunities. We know how to create effective goals. Define
                your goals clearly using smart systems. Think of problems that
                might come up that would interfere.
              </p>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="card mb-2">
            <img
              class="card-img-top"
              src="../assets/images/1.jpg"
              alt="Card image cap"
            />
            <div class="card-body bg-dark text-white">
              <h5 class="card-title">Keep learning every day</h5>
              <p class="card-text">
                Language learning is non stop. Everyday lessons are best for
                faster improvement, but of course you can create your own
                schedule and arrange the time of the lessons based on your
                preference. If you would like casual lessons such as one lesson
                a week, please let me know! We can figure it out too!
              </p>
            </div>
          </div>

          <div class="card mb-4">
            <img
              class="card-img-top"
              src="https://static.wixstatic.com/media/b5d897a11e2d48479595d09c7cf15044.jpg/v1/fill/w_848,h_613,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01/b5d897a11e2d48479595d09c7cf15044.webp"
              alt="Card image cap"
            />
            <div class="card-body bg-dark text-white">
              <h5 class="card-title">
                Our technology improves the efficiency of your learnings
              </h5>
              <p class="card-text">
                We have structured lesson systems and study materials. We have
                chosen the most helpful apps and flashcard maker, and other
                writing, speaking and listening practice tools. You don't need
                to spend time on those uptight tasks, but instead, you can focus
                on memorizing, practicing, and performing! No worries, we will
                offer the environment and materials.
              </p>
            </div>
          </div>
        </div>
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
