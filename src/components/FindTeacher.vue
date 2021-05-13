<template>
  <div class="FindTeacher" v-if="loaded">
    <b-container fluid class="mt-4">
      <b-row>
        <b-col></b-col>
        <b-col sm="8">
          <div v-if="teacherArr.length > 0">
            <div v-for="teacher in teacherArr" :key="teacher.userId">
              <b-card-body class="mb-3 shadow border-0 price-card" style="cursor: pointer" @click="$router.push(`/user/${teacher.userId}`)">
                <b-card-text>
                  <b-row>
                    <b-col sm="2">
                      <div>
                        <img
                          class="d-block m-auto"
                          style="border-radius: 50% !important; max-width: 100px;"
                          :src="imageSourceEdit(teacher.userData.profileImage)"
                        />
                      </div>
                    </b-col>
                    <b-col sm="8">
                      <h3 class="light-bold">
                        {{teacher.userData.name}}
                      </h3>
                      <p class="text-muted light-bold">
                        {{formatString(teacher.teacherType,
                    ['unlicensed', 'licensed',],
                    ['Community Teacher', 'Professional Teacher',])}}
                      </p>
                      <div
                        v-for="(lang, i) in teacher.teachingLanguages"
                        :key="lang.language"
                        class="mr-2"
                        style="display: inline"
                      >
                        <span v-if="i == 0" class="light-bold"
                          >Teaches --
                        </span>
                        <span>{{ languageCodeToText(lang.language) }}</span>
                        <span
                          v-for="(n, i) in 5"
                          :key="i"
                          class="level"
                          :class="languageLevelBars(lang, i)"
                        ></span>
                      </div>
                      <div
                        v-for="(langData, i) in teacher.alsoSpeaks"
                        :key="langData.language"
                        style="display: block"
                        class="mt-2 mr-2"
                      >
                        <span v-if="i == 0" class="light-bold"
                          >Also Speaks --
                        </span>
                        <span>{{ languageCodeToText(langData.language) }}</span>
                        <span
                          v-for="(n, i) in 5"
                          :key="i"
                          class="level"
                          :class="languageLevelBars(langData, i)"
                        ></span>
                      </div>
                      <p class="light-bold mt-2">
                        Hourly Rate:
                        {{convertMoney(teacher.hourlyRate.amount, teacher.hourlyRate.currency, myUserData.settings.currency, true, exchangeRates).toFixed(2).toLocaleString()}}
                        {{myUserData.settings.currency}}
                      </p>
                      <b-button class="mt-2 manabu-blue" :to="`/user/${teacher.userId}`"
                        >Book now!</b-button
                      >
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card-body>
            </div>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
  <div v-else class="d-flex justify-content-center my-4">
    <b-spinner label="Loading..."></b-spinner>
  </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
import axios from 'axios';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';
import languageLevelBars from '../assets/scripts/languageLevelBars';
import languageCodeToText from '../assets/scripts/languageCodeToText';
import formatString from '../assets/scripts/formatString';
import convertMoney from '../assets/scripts/convertMoney';
import store from '../store/store';
import fetchExchangeRates from '../assets/scripts/fetchExchangeRates';

export default {
    name: 'FindTeacher',
        computed: {
      storeUserData: {
        get() {
          return store.getters.userData;
        },
        set(userData) {
          return userData;
        }
        }
    },
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            teacherArr: null,
            params: {},
            loaded: false,
            myUserData: null,
            exchangeRates: null,
        }
    },
    methods: {
        imageSourceEdit,
        languageLevelBars,
        languageCodeToText,
        formatString,
        convertMoney,
    },
    mounted() {
        if (Object.keys(this.$route.query).length === 0) {
            this.params = {};
        }
        axios.get(`api/teachers?teacherType=${encodeURIComponent(JSON.stringify(['unlicensed', 'licensed']))}&teachingLanguages=${encodeURIComponent(JSON.stringify(['en',]))}`).then(async (res) => {
            if (res.status == 200) {
                this.teacherArr = res.data;
                this.myUserData = this.storeUserData;
                this.exchangeRates = await fetchExchangeRates();

                this.loaded = true;
            }
        })
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
