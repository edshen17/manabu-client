<template>
  <div class="teacher-profile">
    <b-row>
      <b-col></b-col>
      <b-col md="5" style="padding: 0 0 0 0 !important">
        <div class="card mb-3">
          <div class="embed-responsive embed-responsive-16by9">
            <iframe
              class="embed-responsive-item"
              src="https://www.youtube.com/embed/fV3Fu5csdcA"
              allowfullscreen
            ></iframe>
          </div>
          <div class="card-body">
            <b-row>
              <b-col md="10">
                <div class="my-2">
                  <h3>{{ this.userData.name }}</h3>
                  <div class="text-muted font-weight-light">
                    <div>
                      <span style="font-size: 1.1rem">
                        {{ formatString(this.userData.teacherData.teacherType, 
                    ['licensed', 'unlicensed'], 
                    ['Licensed Teacher --', 'Unlicensed Teacher --']) }}
                        <div
                          v-for="lang in userData.fluentLanguages"
                          :key="lang"
                          style="display: inline"
                          class="mr-1"
                        >
                          {{ languageCodeToText(lang) }}
                          <span
                            v-for="(n, i) in 5"
                            :key="i"
                            class="level"
                            :class="languageLevelBars(lang, i)"
                          ></span>
                        </div>
                        <div
                          v-for="lang in userData.nonFluentLanguages"
                          :key="lang"
                          style="display: inline"
                        >
                          {{ languageCodeToText(lang) }}
                          <span
                            v-for="(n, i) in 5"
                            :key="i"
                            class="level"
                            :class="languageLevelBars(lang, i)"
                          ></span>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div v-html="this.userData.profileBio" class="mt-3"></div>
                </div>
              </b-col>
              <b-col md="2">
                <p class="card-text">
                  <small class="text-muted">Last online 1 hour ago</small>
                </p>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
      <b-col md="3">
        <div class="card profile-card mb-3">
          <div class="card-body">sadadas</div>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>
<script>
import imageSourceEdit from '../../assets/scripts/imageSourceEdit';
import languageLevelBars from '../../assets/scripts/languageLevelBars';
import languageCodeToText from '../../assets/scripts/languageCodeToText';
import formatString from '../../assets/scripts/formatString';
export default {
    name: 'TeacherProfile',
    data() {
        return {
        }
    },
    props: {
        userData: Object,
    },
    methods: {
        languageCodeToText,
        imageSourceEdit,
        languageLevelBars,
        formatString
    },
    mounted() {
        console.log(this.userData)
    }
}
</script>

<style lang="css">
@import "../../../src/assets/css/styles.css";
</style>
