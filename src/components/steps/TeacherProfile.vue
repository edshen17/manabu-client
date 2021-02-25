<template>
  <div class="teacher-profile">
    <b-row>
      <b-col></b-col>
      <b-col md="5" style="padding: 0 0 0 0 !important">
        <div class="card mb-3">
          <div class="embed-responsive embed-responsive-16by9">
            <iframe
              class="embed-responsive-item"
              :src="this.viewingUserData.teacherData.introductionVideo"
              allowfullscreen
            ></iframe>
          </div>
          <div class="card-body">
            <b-row>
              <b-col md="12">
                <div class="my-2">
                  <span>
                    <h3 style="display: inline">
                      {{ this.viewingUserData.name }}
                    </h3>
                    <b-icon-patch-check-fll
                      v-if="this.viewingUserData.teacherData.isApproved || this.isApproved"
                      class="ml-2 patch-icon"
                      title="Manabu Verified Teacher"
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
                    <p class="card-text">
                      <small class="text-muted">Last online {{ formatDate(viewingUserData.lastOnline, 'fromNow') }}</small>
                    </p>
                  </span>
                  <div class="text-muted font-weight-light">
                    <div>
                      <span style="font-size: 1.1rem">
                        {{ formatString(this.viewingUserData.teacherData.teacherType, 
                    ['licensed', 'unlicensed'], 
                    ['Professional Teacher --', 'Community Teacher --']) }}
                        <div
                          v-for="lang in viewingUserData.fluentLanguages"
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
                          v-for="lang in viewingUserData.nonFluentLanguages"
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
                  <div
                    v-html="this.viewingUserData.profileBio"
                    class="mt-3"
                  ></div>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
      <b-col md="3">
        <div class="card profile-card mb-3">
          <div class="card-body">{{viewingUserData.teacherData.hourlyRate}}</div>
        </div>
        <div class="card profile-card mb-3">
          <b-button variant="dark" class="mx-3 my-3" @click="showCalendar = !showCalendar">
            <span v-show="!showCalendar">View</span> 
            <span v-show="showCalendar">Hide</span> 
            Calendar</b-button>
          <view-calendar :hostedByProp="viewingUserData._id" v-show="showCalendar" class="mt-2"></view-calendar>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>
<script>
import imageSourceEdit from '../../assets/scripts/imageSourceEdit';
import ViewCalendar from './ViewCalendar';
import languageLevelBars from '../../assets/scripts/languageLevelBars';
import languageCodeToText from '../../assets/scripts/languageCodeToText';
import formatString from '../../assets/scripts/formatString';
import formatDate from '../../assets/scripts/formatDate';
import axios from 'axios';

export default {
    name: 'TeacherProfile',
    data() {
        return {
            isApproved: false,
            host: '/api',
            showCalendar: false,
            minimumPkgPrice: 0,
        }
    },
    components: {
      ViewCalendar,
    },
    props: {
        viewingUserData: Object,
        myUserData: Object,
    },
    methods: {
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


        }
    },
    mounted() {
    }
}
</script>

<style lang="css">
@import "../../../src/assets/css/styles.css";
</style>
