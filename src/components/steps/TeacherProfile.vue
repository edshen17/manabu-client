<template>
  <div class="teacher-profile">
    <b-modal id="price-modal" title="Select a Lesson Plan" size="lg">
      <b-form-select
        v-model="selectedLanguage"
        :options="optionsLanguage"
        v-show="teachingLanguages.length > 1"
      ></b-form-select>
      <b-form-group
        label="Lesson Plan"
        v-slot="{ ariaDescribedby }"
        class="mt-2"
      >
        <b-form-radio-group
          v-model="selectedPlan"
          :options="optionsPlan"
          :aria-describedby="ariaDescribedby"
          name="plans"
          @change="changePlan"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group label="Duration" v-slot="{ ariaDescribedby }" class="mt-2">
        <b-form-radio-group
          v-model="selectedDuration"
          :options="optionsDuration"
          :aria-describedby="ariaDescribedby"
          name="durations"
        ></b-form-radio-group>
      </b-form-group>
      <!-- <b-form-group
        label="Monthly Subscription?"
        v-slot="{ ariaDescribedby }"
        class="mt-2"
      >
        <b-form-radio-group
          v-model="selectedSubscription"
          :options="optionsSubscription"
          :aria-describedby="ariaDescribedby"
          name="subscriptions"
        ></b-form-radio-group>
      </b-form-group> -->
      <span
        style="font-weight: bold; display: block"
        class="mb-2"
        v-show="selectedDuration"
        >Estimated Price:
        {{ convertMoney((selectedDuration / 60) * viewingUserData.teacherData.hourlyRate.amount * selectedPackageData.lessonAmount, selectedPackageData.priceDetails.currency, myUserData.settings.currency, true, exchangeRates).toFixed(2).toLocaleString()}}
        {{myUserData.settings.currency}}
      </span>
      <span style="font-weight: bold">Disclaimer</span>
      <ul>
        <li style="font-size: 0.9rem" class="mt-2">
          To give teachers time to prepare for their next student, lessons end 5
          minutes early. However, after each lesson you will receive a 5 minute
          credit that you can use for that teacher. For example, if you buy 60
          minute lessons, you will automatically get a "free" lesson after 12
          lessons. The credits do not expire, but the extra lesson will expire
          when the plan expires.
        </li>
        <li style="font-size: 0.9rem" class="mt-2">
          Lesson plans automatically expire 1 month after purchasing and unused
          lessons will not carryforward. If you choose the subscription option (coming soon)
          you will automatically receive a new lesson plan every month.
        </li>
      </ul>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('price-modal')"> Cancel </b-button>
        <b-button variant="primary" @click="onConfirm"> Continue </b-button>
      </template>
    </b-modal>
    <b-container fluid>
      <b-row>
        <b-col lg="2"></b-col>
        <b-col lg="5" style="z-index: 100">
          <div class="card mb-3 shadow border-0">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe
                class="embed-responsive-item"
                :src="this.viewingUserData.teacherData.introductionVideo"
                allowfullscreen
              ></iframe>
            </div>
            <div class="card-body">
              <b-container>
                <b-row>
                  <b-col lg="12">
                    <div class="my-2">
                      <span>
                        <h3 style="display: inline">
                          {{ this.viewingUserData.name }}
                        </h3>
                        <b-icon-patch-check-fll
                          v-if="this.viewingUserData.teacherData.isApproved || this.isApproved"
                          class="ml-2 patch-icon"
                          :title="`Manabu Verified Teacher since ${formatDate(viewingUserData.teacherData.dateApproved, 'MMMM YYYY')}`"
                        >
                        </b-icon-patch-check-fll>
                        <b-icon-patch-minus-fll
                          v-else
                          class="ml-2 patch-icon"
                          title="Teacher application pending"
                        >
                        </b-icon-patch-minus-fll>
                        <b-dropdown
                          size="lg"
                          variant="transparent"
                          toggle-class="text-decoration-none"
                          no-caret
                          class="float-right no-padding"
                          v-if="viewingUserData._id != myUserData._id && myUserData._id"
                        >
                          <template #button-content>
                            <i class="fas fa-ellipsis-v"></i>
                          </template>
                          <div v-if="myUserData.role == 'admin'">
                            <b-dropdown-item
                              v-if="viewingUserData.teacherAppPending 
                              && !this.isApproved"
                              @click="approveTeacher(viewingUserData._id)"
                            >
                              Approve application
                            </b-dropdown-item>
                            <b-dropdown-item
                              v-if="viewingUserData.teacherData.licensePath 
                              && viewingUserData.teacherData.teacherType == 'licensed'"
                              :href="viewingUserData.teacherData.licensePath"
                              target="_blank"
                            >
                              View professional license
                            </b-dropdown-item>
                          </div>
                          <b-dropdown-item>Report</b-dropdown-item>
                          <b-dropdown-item>Block</b-dropdown-item>
                        </b-dropdown>
                        <div class="card-text">
                          <small class="text-muted"
                            >Last online
                            {{ formatDate(viewingUserData.lastOnline, 'fromNow') }}</small
                          >
                        </div>
                      </span>
                      <div class="text-muted font-weight-light mt-2">
                        <div>
                          <span style="font-size: 1.1rem">
                            <span class="light-bold"
                              >{{ formatString(this.viewingUserData.teacherData.teacherType, 
                        ['licensed', 'unlicensed'], 
                        ['Professional Teacher --', 'Community Teacher --']) }}
                            </span>
                            <div
                              v-for="langData in teachingLanguages"
                              :key="langData.language"
                              class="mr-2"
                              style="display: inline"
                            >
                              <span
                                >{{ languageCodeToText(langData.language) }}</span
                              >
                              <span
                                v-for="(n, i) in 5"
                                :key="i"
                                class="level"
                                :class="languageLevelBars(langData, i)"
                              ></span>
                            </div>
                            <div
                              v-for="(langData, i) in otherLanguages"
                              :key="langData.language"
                              style="display: block"
                              class="mt-2 mr-2"
                            >
                              <span v-if="i == 0" class="light-bold"
                                >Also Speaks --
                              </span>
                              <span
                                >{{ languageCodeToText(langData.language) }}</span
                              >
                              <span
                                v-for="(n, i) in 5"
                                :key="i"
                                class="level"
                                :class="languageLevelBars(langData, i)"
                              ></span>
                            </div>
                          </span>
                        </div>
                      </div>
                      <div
                        v-html="this.viewingUserData.profileBio"
                        class="mt-3"
                      ></div>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </div>
          <div class="card profile-card mb-3 shadow border-0">
            <div class="card-body">
              <h3 class="mb-3">Lesson Plans</h3>
              <div v-for="pkg in packages" :key="pkg._id">
                <div
                  class="card profile-card mb-3 shadow border-0"
                  v-if="pkg.isOffering"
                >
                  <div class="card-body price-card" @click="selectedPlan = pkg.packageType; openModal('price-modal')">
                    <h5 class="text-muted font-weight-light">
                      {{ toTitleCase(pkg.packageType) }} Plan
                    </h5>
                    <p>
                      {{ formatString(pkg.packageType, ['light', 'moderate', 'mainichi'], 
                      ['This is for students who want to casually practice Japanese. With this plan, you will receive 5 personalized lessons every month or about 1 lesson every week.', 'This is for students who want a balanced but intensive learning schedule. With this plan, you will receive 12 personalized lessons every month or about 3 lessons every week.', 'This is for students who want to improve quickly and immerse themselves in speaking Japanese. With this plan, you will receive 22 personalized lessons every month or about 5 lessons every week.'])}}
                    </p>
                    <span
                      class="badge badge-pill badge-primary manabu-blue"
                      style="font-size: 0.9rem"
                      >~{{convertMoney((pkg.packageDurations[0] / 60) * viewingUserData.teacherData.hourlyRate.amount * pkg.lessonAmount, pkg.priceDetails.currency, myUserData.settings.currency, false, exchangeRates).toLocaleString()}}+ 
                      {{myUserData.settings.currency}}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="calendar-wrapper">
            <div
              class="card profile-card mb-3 shadow border-0"
              v-show="showCalendar"
            >
              <div class="card-body">
                <view-calendar
                  :hostedByProp="viewingUserData._id"
                  id="view-calendar"
                ></view-calendar>
              </div>
            </div>
          </div>
        </b-col>
        <b-col lg="3" class="button-wrapper">
          <div class="sticky-top">
            <div class="card profile-card mb-3 shadow border-0">
              <h5 class="font-weight-light mt-3 mx-3">
                Lessons starting from
                ~{{convertMoney(viewingUserData.teacherData.hourlyRate.amount, viewingUserData.teacherData.hourlyRate.currency, myUserData.settings.currency, false, exchangeRates)}} {{ myUserData.settings.currency }}/hour
              </h5>
              <b-button
                variant="dark"
                class="mx-3 my-3 manabu-blue"
                @click="openModal('price-modal')"
                >BOOK NOW</b-button
              >
            </div>
            <div class="card profile-card mb-3 shadow border-0">
              <b-button
                variant="dark"
                class="mx-3 my-3"
                v-scroll-to="'#calendar-wrapper'"
                @click="showCalendar = !showCalendar"
              >
                <span v-show="!showCalendar">VIEW</span>
                <span v-show="showCalendar">HIDE</span>
                CALENDAR
              </b-button>
            </div>
          </div>
        </b-col>
        <b-col lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import imageSourceEdit from '../../assets/scripts/imageSourceEdit';
import ViewCalendar from './ViewCalendar';
import languageLevelBars from '../../assets/scripts/languageLevelBars';
import languageCodeToText from '../../assets/scripts/languageCodeToText';
import formatString from '../../assets/scripts/formatString';
import formatDate from '../../assets/scripts/formatDate';
import toTitleCase from '../../assets/scripts/toTitleCase';
import convertMoney from '../../assets/scripts/convertMoney';
import axios from 'axios';
import { required, between } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import store from '../../store/store';

export default {
    name: 'TeacherProfile',
    mixins: [validationMixin],
       computed: {
   isLoggedIn: {
      get() {
        return store.getters.isLoggedIn;
      },
      set(isLoggedIn) {
        return isLoggedIn;
      }
    },
    },
    data() {
        return {
            isApproved: false,
            host: '/api',
            showCalendar: false,
            teachingLanguages: [],
            otherLanguages: [],
            optionsPlan: [],
            optionsDuration: [],
            optionsLanguage: [],
            optionsSubscription: [
              {
                text: 'Yes',
                value: 'yes',
              },
              {
                text: 'No',
                value: 'no',
              },
            ],
            selectedPlan: '',
            selectedDuration: '',
            selectedLanguage: '',
            selectedSubscription: 'no',
            selectedPackageData: this.packages[0],

        }
    },
    components: {
      ViewCalendar,
    },
    props: {
        viewingUserData: Object,
        myUserData: Object,
        exchangeRates: Object,
        packages: Array,
    },
    validations: {
        selectedDuration: {
          required,
          between: between(30, 90)
        },
        selectedLanguage: {
          required,
        },
        selectedPlan: {
          required,
        }
      },
    methods: {
        onConfirm() {
          if (this.$v.$invalid) {
            alert('Missing input on the form. Please double check the inputs.')
          } else {
            // if not logged in, redirect... aka no myuserdata
            const myUserData = this.myUserData
            const transactionData = {
              hostedBy: this.viewingUserData._id,
              reservedBy: this.myUserData._id,
              selectedPlan: this.selectedPlan,
              selectedDuration: this.selectedDuration,
              selectedLanguage: this.selectedLanguage,
              selectedSubscription: this.selectedSubscription,
              selectedPackageId: this.selectedPackageData._id,
            }

            localStorage.setItem('transactionData', JSON.stringify(transactionData));
            
            if (this.isLoggedIn) {
            this.$router.push({
                name: 'Payment',
                params: {
                  transactionData,
                  myUserData,
                }
              })
            } else {
              this.$router.push({ name: 'Sign Up', query: { hostedBy: transactionData.hostedBy, }})
            }
          }
        },
        openModal(modalId) {
          this.$bvModal.show(modalId)
        },
        toTitleCase,
        formatDate,
        languageCodeToText,
        imageSourceEdit,
        languageLevelBars,
        formatString,
        approveTeacher(uId) {
        axios.put(`${this.host}/user/${uId}/updateProfile`, { role: 'teacher', }
        ).then((res) => {
          if (res.status == 200) {
            axios.put(`${this.host}/teacher/${uId}/updateProfile`, { isApproved: true, dateApproved: new Date(), },
          ).then((res) => {
          if (res.status == 200) {
            this.isApproved = true;
          }
        }).catch((err) => {
            console.log(err);
            })
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      convertMoney,
      filterDuplicates(inputArr, filterArr) {
        return inputArr.filter(el => {
          return filterArr.some(f => {
              return f.language != el.language && f.level != el.level;
            });
        })
      },
      changePlan(selectedPlan) {
        const packageInfo = this.packages.find((pkg) => { return pkg.packageType == selectedPlan })
        const newDurationOptions = [];
        packageInfo.packageDurations.forEach((duration) => {
          newDurationOptions.push({
            text: `${duration} minutes`,
            value: duration,
          })
        });
        this.selectedDuration = packageInfo.packageDurations[0];
        this.optionsDuration = newDurationOptions;
        this.selectedPackageData = packageInfo;
      },
    },
    mounted() {
      this.teachingLanguages = this.viewingUserData.teacherData.teachingLanguages;
      this.otherLanguages = this.viewingUserData.teacherData.alsoSpeaks;
      this.packages.forEach((pkg) => {
        if (pkg.isOffering) {
          pkg.packageDurations.sort((a, b) => {
            return a - b;
          })
          const text = `${this.toTitleCase(pkg.packageType)} (${pkg.lessonAmount} lessons)`
          this.optionsPlan.push({
            text,
            value: pkg.packageType
          })
        }
      });
      this.teachingLanguages.forEach((langData) => {
        this.optionsLanguage.push({
          text: languageCodeToText(langData.language),
          value: langData.language,
        })
      })
      this.selectedPlan = this.optionsPlan[0].value;
      this.selectedLanguage = this.optionsLanguage[0].value;
      this.changePlan(this.selectedPlan);
      this.selectedDuration = this.optionsDuration[0].value;
    }
}
</script>

<style lang="css">
@import "../../../src/assets/css/styles.css";
</style>
