<template>
  <div class="teacher-profile">
     <b-modal id="priceModal" title="Modal with Popover" ok-only>
      <p>
        This
        <b-button v-b-popover="'Popover inside a modal!'" title="Popover">Button</b-button>
        triggers a popover on click.
      </p>
      <p>
        This <a href="#" v-b-tooltip title="Tooltip in a modal!">Link</a> will show a tooltip on
        hover.
      </p>
    </b-modal>
    <b-container fluid>
      <b-row>
        <b-col lg="2"></b-col>
        <b-col lg="5" style="z-index: 100;">
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
                        <b-dropdown size="lg" variant="transparent" 
                          toggle-class="text-decoration-none" no-caret class="float-right no-padding"
                          v-if="viewingUserData._id != myUserData._id && myUserData._id">
                          <template #button-content>
                            <i class="fas fa-ellipsis-v"></i>
                          </template>
                          <div v-if="myUserData.role == 'admin'">
                            <b-dropdown-item
                              v-if="viewingUserData.teacherAppPending 
                              && !this.isApproved" 
                              @click="approveTeacher(viewingUserData._id)">
                                Approve application
                            </b-dropdown-item>
                            <b-dropdown-item v-if="viewingUserData.teacherData.licensePath 
                              && viewingUserData.teacherData.teacherType == 'licensed'" :href="viewingUserData.teacherData.licensePath"
                              target="_blank">
                                View professional license
                            </b-dropdown-item>
                          </div>
                          <b-dropdown-item>Report</b-dropdown-item>
                          <b-dropdown-item>Block</b-dropdown-item>
                        </b-dropdown>
                        <div class="card-text">
                          <small class="text-muted">Last online {{ formatDate(viewingUserData.lastOnline, 'fromNow') }}</small>
                        </div>
                      </span>
                      <div class="text-muted font-weight-light mt-2">
                        <div>
                          <span style="font-size: 1.1rem">
                            <span class="light-bold">{{ formatString(this.viewingUserData.teacherData.teacherType, 
                        ['licensed', 'unlicensed'], 
                        ['Professional Teacher --', 'Community Teacher --']) }}
                            </span>
                            <div
                              v-for="langData in teachingLanguages"
                              :key="langData.language"
                              class="mr-2"
                              style="display: inline"
                            >
                            <span>{{ languageCodeToText(langData.language) }}</span>
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
                            <span v-if="i == 0" class="light-bold">Also Speaks -- </span>
                              <span>{{ languageCodeToText(langData.language) }}</span>
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
              <h3 class="mb-3">Package offerings</h3>
              <div v-for="pkg in packages" :key="pkg._id">
                <div class="card profile-card mb-3 shadow border-0" v-if="pkg.isOffering" @click="openModal('priceModal')">
                  <div class="card-body">
                    <h5 class="text-muted font-weight-light">{{ toTitleCase(pkg.packageType) }} plan</h5>
                    <p>{{ formatString(pkg.packageType, ['light', 'moderate', 'vigorous'], 
                      ['This plan is for students who want to casually practice Japanese. With this plan, you will receive 5 personalized lessons every month or about 1 lesson every week.', 'This plan is for students who want a balanced but intensive learning schedule. With this plan, you will receive 12 personalized lessons every month or about 3 lessons every week.', 'This plan is for students who want to improve quickly and immerse themselves in speaking Japanese. With this plan, you will receive 21 personalized lessons every month or about 5 lessons every week.'])}}
                    </p>
                    <span class="badge badge-pill badge-primary manabu-blue" style="font-size: .9rem">{{convertMoney(pkg.priceDetails.price, pkg.priceDetails.currency, myUserData.settings.currency).toLocaleString()}} {{myUserData.settings.currency}}</span>  
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="calendar-wrapper">
            <div class="card profile-card mb-3 shadow border-0" v-show="showCalendar">
              <div class="card-body">
                  <view-calendar :hostedByProp="viewingUserData._id" id="view-calendar"></view-calendar>
              </div>
            </div>
          </div>
        </b-col>
        <b-col lg="3" class="button-wrapper">
          <div class="sticky-top">
            <div class="card profile-card mb-3 shadow border-0">
              <h5 class="font-weight-light mt-3 mx-3"> Lessons starting from {{convertMoney(viewingUserData.teacherData.hourlyRate.amount, viewingUserData.teacherData.hourlyRate.currency, myUserData.settings.currency)}} {{ myUserData.settings.currency }}/hour</h5>
                <b-button variant="dark" class="mx-3 my-3 manabu-blue">BOOK NOW</b-button>
          </div>
                    <div class="card profile-card mb-3 shadow border-0">
            <b-button variant="dark" class="mx-3 my-3" v-scroll-to="'#calendar-wrapper'" @click="showCalendar = !showCalendar">
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
import axios from 'axios';
import fx from 'money';

export default {
    name: 'TeacherProfile',
    data() {
        return {
            isApproved: false,
            host: '/api',
            showCalendar: false,
            teacherPackages: null,
            teachingLanguages: [],
            otherLanguages: [],
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
    methods: {
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
        axios.put(`${this.host}/user/${uId}/updateProfile`, { role: 'teacher', },
          { headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
        ).then((res) => {
          if (res.status == 200) {
            axios.put(`${this.host}/teacher/${uId}/updateProfile`, { isApproved: true, dateApproved: new Date(), },
            { headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
            }
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
      convertMoney(amnt, from, to) {
        if (!from || !to) {
          from = 'SGD';
          to = 'SGD';
        }
        fx.rates = this.exchangeRates;
        return Math.round(fx.convert(amnt, { from, to }));
      },
      filterDuplicates(inputArr, filterArr) {
        return inputArr.filter(el => {
          return filterArr.some(f => {
              return f.language != el.language && f.level != el.level;
            });
        })
      }
    },
    mounted() {
      this.teachingLanguages = this.viewingUserData.teacherData.teachingLanguages;
      this.otherLanguages = this.filterDuplicates(this.viewingUserData.languages, this.teachingLanguages)
    }
}
</script>

<style lang="css">
@import "../../../src/assets/css/styles.css";
</style>
