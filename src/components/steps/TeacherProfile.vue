<template>
  <div class="teacher-profile">
    <b-modal id="price-modal" :title="priceModalText.priceModalTitle" size="lg">
      <b-form-select
        v-model="selectedLanguage"
        :options="optionsLanguage"
        v-show="teachingLanguages.length > 1"
      ></b-form-select>
      <b-form-group
        :label="priceModalText.lessonPlan"
        v-slot="{ ariaDescribedby }"
        class="mt-2"
      >
        <b-form-radio-group
          v-model="selectedPlan"
          :options="optionsPlan"
          :aria-describedby="ariaDescribedby"
          name="plans"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group :label="priceModalText.lessonDuration" v-slot="{ ariaDescribedby }" class="mt-2">
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
        >{{ priceModalText.estimatedPrice }}
        {{ convertMoney((selectedDuration / 60) * viewingUserData.teacherData.hourlyRate.amount * selectedPackageData.lessonAmount, selectedPackageData.priceDetails.currency, myUserData.settings.currency, true, exchangeRates).toFixed(2).toLocaleString()}}
        {{myUserData.settings.currency}}
      </span>
      <span style="font-weight: bold">{{ priceModalText.disclaimerText.disclaimer }}</span>
      <ul>
        <li style="font-size: 0.9rem" class="mt-2">
          {{ priceModalText.disclaimerText.minuteBank }}
        </li>
        <li style="font-size: 0.9rem" class="mt-2">
          {{ priceModalText.disclaimerText.expiration }}
        </li>
      </ul>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('price-modal')"> {{ $t('modal.cancel') }} </b-button>
        <b-button variant="primary" @click="onConfirm"> {{ $t('modal.continue') }} </b-button>
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
                          :title="teacherSince"
                        >
                        </b-icon-patch-check-fll>
                        <b-icon-patch-minus-fll
                          v-else
                          class="ml-2 patch-icon"
                          :title="teacherProfileText.appPending"
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
                              {{ teacherProfileText.approveApp }}
                            </b-dropdown-item>
                            <b-dropdown-item
                              v-if="viewingUserData.teacherData.licensePath 
                              && viewingUserData.teacherData.teacherType == 'licensed'"
                              :href="viewingUserData.teacherData.licensePath"
                              target="_blank"
                            >
                              {{ teacherProfileText.viewLicense }} 
                            </b-dropdown-item>
                          </div>
                          <b-dropdown-item>{{ $t('profile.common.report') }}</b-dropdown-item>
                          <b-dropdown-item>{{ $t('profile.common.block') }}</b-dropdown-item>
                        </b-dropdown>
                        <div class="card-text">
                          <small class="text-muted">
                            {{ $t('profile.common.lastOnline', { date: formatDate(viewingUserData.lastOnline, 'fromNow') }) }}
                          </small>
                        </div>
                      </span>
                      <div class="text-muted font-weight-light mt-2">
                        <div>
                          <span style="font-size: 1.1rem">
                            <span class="light-bold">
                              {{ formatString(this.viewingUserData.teacherData.teacherType, 
                                ['licensed', 'unlicensed'], 
                                teacherTypes) 
                              }}
                            </span>
                            <div
                              v-for="langData in teachingLanguages"
                              :key="langData.language"
                              class="mr-2"
                              style="display: inline"
                            >
                              <span>
                                {{ $t(`localeCodes.${langData.language}`) }}
                              </span>
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
                              <span v-if="i == 0" class="light-bold">
                               {{ $t('profile.common.alsoSpeaks') }} --
                              </span>
                              <span>
                                {{ $t(`localeCodes.${langData.language}`) }}
                              </span>
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
              <h3 class="mb-3">{{ teacherProfileText.lessonPlans }}</h3>
              <div v-for="pkg in packages" :key="pkg._id">
                <div
                  class="card profile-card mb-3 shadow border-0"
                  v-if="pkg.isOffering"
                >
                  <div class="card-body price-card" @click="selectedPlan = pkg.packageType; openModal('price-modal')">
                    <h5 class="text-muted font-weight-light text-capitalize">
                      {{ teacherProfileText.lessonTypes[`${pkg.packageType}Alt`] }}
                    </h5>
                    <p>
                      {{ formatString(pkg.packageType, ['light', 'moderate', 'mainichi'], 
                      [teacherProfileText.lessonTypes.lightDesc, teacherProfileText.lessonTypes.moderateDesc, teacherProfileText.lessonTypes.mainichiDesc])}}
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
                {{ $t('profile.teacher.hourlyRate', { rate: teacherRate, currency: myUserData.settings.currency }) }}
              </h5>
              <b-button
                variant="dark"
                class="mx-3 my-3 manabu-blue"
                @click="openModal('price-modal')"
                >{{ teacherProfileText.bookNow }} </b-button
              >
            </div>
            <div class="card profile-card mb-3 shadow border-0">
              <b-button
                variant="dark"
                class="mx-3 my-3"
                v-scroll-to="'#calendar-wrapper'"
                @click="showCalendar = !showCalendar"
              >
                <span v-show="!showCalendar">{{ $t('profile.common.viewCalendar') }}</span>
                <span v-show="showCalendar">{{ $t('profile.common.hideCalendar') }}</span>
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
import formatString from '../../assets/scripts/formatString';
import formatDate from '../../assets/scripts/formatDate';
import convertMoney from '../../assets/scripts/convertMoney';
import axios from 'axios';
import SecureLS from "secure-ls";
import SecureLsConfig from '../../config/secureLs.config';
export default {
    name: 'TeacherProfile',
      computed: {
        isLoggedIn: {
            get() {
              return this.$store.getters.isLoggedIn;
            },
            set(isLoggedIn) {
              return isLoggedIn;
            }
        },
      priceModalText: {
        get() {
          return this.$t('modal.priceModalText')
        }
      },
      teacherProfileText: {
        get() {
          return this.$t('profile.teacher');
        }
      },
      teacherTypes: {
        get() {
          return [`${this.teacherProfileText.proTeacher} --`, `${this.teacherProfileText.commTeacher} --`]
        }
      },
      teacherRate: {
        get() {
          return convertMoney(this.viewingUserData.teacherData.hourlyRate.amount, this.viewingUserData.teacherData.hourlyRate.currency, this.myUserData.settings.currency, false, this.exchangeRates)
        }
      },
      teacherSince: {
        get() {
          return this.$t('profile.teacher.manabuVerified', { date: formatDate(this.viewingUserData.teacherData.dateApproved, 'MMMM YYYY')})
        }
      },
      optionsSubscription: {
        get() {
          return [
              {
                text: this.$t('modal.yes'),
                value: 'yes',
              },
              {
                text: this.$t('modal.no'),
                value: 'no',
              },
            ]
        }
      },
      teachingLanguages: {
        get() {
          return this.viewingUserData.teacherData.teachingLanguages;
        }
      },
      otherLanguages: {
        get() {
          return this.viewingUserData.teacherData.alsoSpeaks;
        }
      },

      optionsPlan: {
        get() {
          const optionsPlan = []

          this.packages.forEach((pkg) => {
            if (pkg.isOffering) {
              pkg.packageDurations.sort((a, b) => { return a - b; })
              const text = this.$t(`profile.teacher.lessonTypes.${pkg.packageType}`, { amount: pkg.lessonAmount })
              optionsPlan.push({
                text,
                value: pkg.packageType
              })
            }
          });
          return optionsPlan;
        }
      },

      optionsDuration: {
        get() {
          const packageInfo = this.packages.find((pkg) => { return pkg.packageType == this.selectedPlan })
          const newDurationOptions = [];
          packageInfo.packageDurations.forEach((duration) => {
            newDurationOptions.push({
              text: this.$t('profile.teacher.lessonDuration', { duration }),
              value: duration,
            })
          });
          
          this.selectedDuration = packageInfo.packageDurations[0];
          this.selectedPackageData = packageInfo;

          return newDurationOptions;
        }
        },

      optionsLanguage: {
        get() {
          const optionsLanguage = [];

          this.teachingLanguages.forEach((langData) => {
            optionsLanguage.push({
              text: this.$t(`localeCodes.${langData.language}`),
              value: langData.language,
            })
          })
          return optionsLanguage;
        }
      },
      encodedQueryParams: { // base 64
        get() {
          return this.$store.getters.encodedQueryParams;
        }
      },
      decodedQueryParams: {
        get() {
          return this.$store.getters.decodedQueryParams;
        }
      },
    },
    data() {
        return {
            encryptedStorage: new SecureLS(SecureLsConfig),
            isApproved: false,
            host: '/api',
            showCalendar: false,
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
    methods: {
        onConfirm() {
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

          try {
            this.encryptedStorage.set('storedTransaction', JSON.stringify(transactionData));
          } catch (err) {
            console.log(err)
          }
            
          if (this.isLoggedIn) {
          this.$router.push({
              name: 'Payment',
              params: {
                transactionData,
                myUserData,
              }
            })
          } else {
            const queryParams = this.decodedQueryParams;
            queryParams.hostedBy = this.viewingUserData._id
            this.$store.commit('setEncodedQueryParams', queryParams);
            this.$router.push(`/signup?state=${this.encodedQueryParams}`).catch((err) => {})
          }
        },
        openModal(modalId) {
          this.$bvModal.show(modalId)
        },
        formatDate,
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
    },
    mounted() {
      this.selectedPlan = this.optionsPlan[0].value;
      this.selectedLanguage = this.optionsLanguage[0].value;
      this.selectedDuration = this.optionsDuration[0].value;
    }
}
</script>

<style lang="css">
@import "../../../src/assets/css/styles.css";
</style>
