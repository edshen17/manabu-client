<template>
  <div class="Template" v-if="loaded">
    <b-container fluid class="mt-4">
      <b-row>
        <b-col lg="2"></b-col>
        <b-col lg="5" style="z-index: 100">
          <div class="card mb-3 shadow border-0">
            <div class="card-header bg-dark text-white">
              <b-row>
                <b-col lg="9">
                  <span
                    >{{formatDate(appointmentData.from, 'dddd, MMMM D, YYYY.')}}</span
                  >
                  <br />
                  <span>
                    {{ formatDate(appointmentData.from, 'h:mma')

                    }}-{{formatDate(appointmentData.to, 'h:mma')}}
                    ({{userTimeZone

                    }})
                  </span>
                  <br />
                  <span class="text-capitalize"
                    >Status: {{ appointmentData.status }}</span
                  >
                </b-col>
                <b-col lg="3" class="float-right"
                  >Appointment ID: {{appointmentData._id}}</b-col
                >
              </b-row>
            </div>
            <div class="card-body">
              <b-container>
                <b-row>
                  <b-col lg="12">
                    <div class="my-2">
                      <b-row>
                        <b-col md="2" style="text-align: center;">
                          <img
                            style="
                              border-radius: 50% !important;
                              max-width: 100px;
                              cursor: pointer;
                            "
                            :src="imageSourceEdit(viewingUserData.profileImage)"
                            @click="$router.push(`/user/${viewingUserData._id}`)"
                          />
                        </b-col>
                        <b-col md="10">
                          <h3 style="display: inline">
                            {{ viewingUserData.name }}
                          </h3>
                          <br />
                          <small class="text-muted text-capitalize"
                            >{{ viewingUserData.role}}
                          </small>
                        </b-col>
                      </b-row>
                      <span>
                        <div class="card-text">
                          <hr />
                          <b-row>
                            <b-col>
                              <div>
                                <span class="text-muted"> Language </span>
                                <br />
                                {{ languageCodeToText(appointmentData.packageTransactionData.lessonLanguage) }}
                              </div>
                            </b-col>
                            <b-col>
                              <div>
                                <span class="text-muted"> Duration </span>
                                <br />
                                {{ appointmentData.packageTransactionData.reservationLength }}
                                minutes
                              </div>
                            </b-col>
                            <b-col>
                              <div>
                                <span class="text-muted"> Package ID </span>

                                <br />
                                {{ appointmentData.packageTransactionId }}
                              </div>
                            </b-col>
                            <b-col></b-col>
                            <b-col></b-col>
                          </b-row>
                          <div class="disclaimer mt-3">
                            ** To give teachers time to prepare for their next
                            student, lessons end 5 minutes early. However, after
                            each lesson students will receive a 5 minute credit
                            that they can use for that teacher.
                          </div>
                          <div class="location-details mt-3">
                            <h5>Location Details</h5>
                            <b-row>
                              <b-col>
                                <div>
                                  <i
                                    class="fab fa-line fa-3x"
                                    v-if="appointmentData.locationData.method == 'LINE'"
                                  ></i>
                                  <i
                                    class="fab fa-skype fa-3x"
                                    v-else-if="appointmentData.locationData.method == 'Skype'"
                                  ></i>
                                  <i
                                    class="fab fa-discord fa-3x"
                                    v-else-if="appointmentData.locationData.method == 'Discord'"
                                  ></i>
                                </div>
                              </b-col>
                              <b-col>
                                <div>
                                  <span class="text-muted">
                                    Teacher Account
                                  </span>
                                  <br />
                                  {{ appointmentData.locationData.hostedByMethodId }}
                                </div>
                              </b-col>
                              <b-col>
                                <div>
                                  <span
                                    class="text-muted"
                                    v-if="appointmentData.locationData.reservedByMethodId || appointmentData.locationData.alternativeContact"
                                  >
                                    Student Account
                                  </span>
                                  <br />
                                  <span
                                    v-if="appointmentData.locationData.reservedByMethodId"
                                    >{{appointmentData.locationData.reservedByMethodId}}</span
                                  >
                                  <span v-else>
                                    This user did not provide a
                                    {{appointmentData.locationData.method}}
                                    username. Alternative contact method on
                                    {{ appointmentData.locationData.alternativeContact.method }}
                                    (ID:
                                    {{appointmentData.locationData.alternativeContact.reservedByMethodId

                                    }}).
                                  </span>
                                </div>
                              </b-col>
                              <b-col>
                                <div v-if="myUserData.role == 'admin'">
                                  <span class="text-muted">
                                    Contact Email
                                  </span>
                                  <br />
                                  {{viewingUserData.email}}
                                </div>
                              </b-col>
                              <b-col></b-col>
                            </b-row>
                          </div>
                        </div>
                      </span>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </div>
        </b-col>
        <b-col lg="3" class="button-wrapper">
          <div v-if="myUserData._id != appointmentData.hostedBy">
            <div class="card profile-card mb-3 shadow border-0">
              <!-- <h5 class="font-weight-light mt-3 mx-3"></h5> -->
              <b-button
                variant="dark"
                class="mx-3 my-3 manabu-blue"
                @click="$router.push({ path: `/calendar/${appointmentData.hostedBy}/${appointmentData.packageTransactionId}`})"
                >Reschedule / Cancel</b-button
              >
            </div>
          </div>
        </b-col>
        <b-col lg="2"></b-col>
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
import store from '../store/store';
import formatDate from '../assets/scripts/formatDate';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import languageCodeToText from '../assets/scripts/languageCodeToText';
import fetchUserData from '../assets/scripts/fetchUserData';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';

dayjs.extend(utc)
dayjs.extend(timezone)

export default {
    name: 'Template',
    props: {
        appointment: Object,
        userData: Object,
    },
    computed: {
        storeUserData: {
        get() {
            return store.getters.userData;
        },
        set(userData) {
            return userData;
        }
        },
    },
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
          appointmentData: null,
          loaded: false,
          viewingUserData: null,
          myUserData: null,
          userTimeZone: dayjs.tz.guess(),
        }
    },
    methods: {
      getViewingUserData(myUserId) { // gets the relevant user data (hostedBy/reservedBy)
        if (this.appointmentData.hostedBy == myUserId) { // logged in as host
          this.viewingUserData = this.appointmentData.packageTransactionData.reservedByData;
          this.viewingUserData._id = this.appointmentData.reservedBy
        } else {
          this.viewingUserData = this.appointmentData.packageTransactionData.hostedByData;
          this.viewingUserData._id = this.appointmentData.hostedBy
        }
      },
      formatDate,
      languageCodeToText,
      fetchUserData,
      imageSourceEdit,
    },
    async mounted() {
      if (!this.appointment && !this.userData) {
        axios.get(`/api/schedule/appointment/${this.$route.params.aId}`).then(async (res) => {
          if (res.status == 200) {
            this.appointmentData = res.data;
            this.myUserData = this.storeUserData;
            this.getViewingUserData(this.myUserData._id)
            if (this.myUserData.role == 'admin') {
              const viewingUserData = await fetchUserData(this.viewingUserData._id)
              this.viewingUserData.email = viewingUserData.email
            }
            this.loaded = true;
          }
        }).catch((err) => { console.log(err) })
      } else {
        this.appointmentData = this.appointment;
        this.myUserData = this.userData;
        this.getViewingUserData(this.myUserData._id);
        if (this.myUserData.role == 'admin') {
              const viewingUserData = await fetchUserData(this.viewingUserData._id)
              this.viewingUserData.email = viewingUserData.email
          }
        this.loaded = true;
      }
    }
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
