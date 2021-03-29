<template>
  <div class="EditCalendar">
    <b-modal id="update-modal">
      <template #modal-title>
        {{ modalTitleText }}
      </template>
      <div class="profile-popup" v-if="selectedReservedBy">
        <img
          class="rounded-circle center-image no-cursor"
          alt="100x100"
          :src="imageSourceEdit(selectedReservedBy.profileImage)"
        />
        <b-link :to="`/user/${selectedAppointmentData.reservedBy}`" class="profile-link">
          <h5 class="text-center my-2">{{selectedReservedBy.name}}</h5>
        </b-link>
        <div class="text-center">
          <div
            v-for="langData in selectedReservedBy.languages"
            :key="langData.language"
            class="mx-1"
            style="display: inline"
          >
            {{languageCodeToText(langData.language)}}
            <span
              v-for="(n, i) in 5"
              :key="i"
              class="level"
              :class="languageLevelBars(langData, i)"
            ></span>
          </div>
          <span class="mt-2" style="display: block">
            <b>Lesson time</b>:
            {{ formatDate(selectedAppointmentData.from, 'MMM DD @ h:mma')

            }}-{{formatDate(selectedAppointmentData.to, 'h:mma')}}
            ({{userTimeZone}})</span
          >
          <span v-if="selectedAppointmentData && selectedAppointmentData.locationData">
            <b>Communication Tool</b>:
            {{ selectedAppointmentData.locationData.method }}
            (id: {{selectedAppointmentData.locationData.reservedByMethodId }})
          </span>
        </div>

        <div class="form-group" v-show="!updateErr && isRejecting">
          <label>Reason for rejecting appointment</label>
          <b-form-select
            v-model="cancellationReason"
            :options="cancellationSelect"
            size="md"
          ></b-form-select>
        </div>
      </div>
      <p class="my-4" v-show="updateErr">
        There was an error processing your request. Please try again.
      </p>
      <template #modal-footer>
        <b-button @click="resetOnCancel" v-show="!updateErr"> Exit </b-button>
        <b-button
          variant="danger"
          v-show="!updateErr && !isRejecting"
          @click="isRejecting = true; cancelAppointment(selectedLessonId)"
        >
          Cancel
        </b-button>
        <b-button
          @click="isRejectingConfirmation = true; cancelAppointment(selectedLessonId)"
          variant="danger"
          v-show="!updateErr && isRejecting"
        >
          Yes
        </b-button>
        <b-button
          @click="updateErr = false; $bvModal.hide('update-modal')"
          variant="primary"
          v-show="updateErr"
        >
          OK
        </b-button>
        <b-button
          @click="confirmAppointment(selectedLessonId)"
          variant="primary"
          v-show="!updateErr && !isRejecting"
        >
          Confirm
        </b-button>
      </template>
    </b-modal>
    <b-modal
      id="delete-modal"
      title="Delete this timeslot?"
    >
      <p class="my-4" v-show="!deleteErr">
        Are you sure you want to delete this timeslot?
      </p>
      <p class="my-4" v-show="deleteErr">
        There was an error processing your request.
      </p>
      <template #modal-footer>
        <b-button
          @click="$bvModal.hide('delete-modal')"
          v-show="!updateErr && !deleteErr"
        >
          <div>Cancel</div>
        </b-button>
        <b-button
          @click="removeEvent(event_information)"
          variant="danger"
          v-show="!deleteErr"
        >
          <div>Delete</div>
        </b-button>
        <b-button
          @click="deleteErr = false; $bvModal.hide('delete-modal')"
          variant="primary"
          v-show="deleteErr"
        >
          <div>OK</div>
        </b-button>
      </template>
    </b-modal>
    <div>
      <kalendar
        v-if="isCalendarLoaded"
        :configuration="calendar_settings"
        :events.sync="events"
        ref="kalendar"
        class="mb-5"
      >
        <div slot="creating-card" slot-scope="{ event_information }">
          <span class="appointment-title">
            Available ({{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}})
          </span>
        </div>
        <div
          slot="created-card"
          slot-scope="{ event_information }"
          class="details-card"
          :class="{'pending-teacher': (event_information.data && event_information.data.status == 'pending') 
                  && !onEventClassBind(event_information.data.from, sessionConfirmed) 
                  && !onEventClassBind(event_information.data.from, sessionScheduleChange)
                  && !onEventClassBind(event_information.data.from, sessionStudentIssue),
                'student-reserved': (event_information.data && event_information.data.status == 'confirmed') || onEventClassBind(event_information.data.from, sessionConfirmed),
                'dotted-border':  event_information.data && (event_information.data.status == 'pending' 
                || event_information.data.status == 'confirmed' || (event_information.data.status == 'cancelled')),
                'schedule-change': (event_information.data && event_information.data.cancellationReason == 'student issue') || (event_information.data && event_information.data.cancellationReason == 'schedule change') || (event_information.data && event_information.data.cancellationReason == 'student cancel')  || onEventClassBind(event_information.data.from, sessionScheduleChange),
        }"
          :id="event_information.data._id"
          @click="onSlotClick(event_information)"
        >
          <span
            class="appointment-title ml-2"
            v-if="event_information.data && event_information.data.reservedBy"
          >
            {{ toTitleCase(getEventData(event_information.data._id).data.status) }}
            ({{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}})
          </span>
          <span
            class="appointment-title ml-2"
            v-if="event_information.data && event_information.data.reservedBy && storeUserData"
          >
          <span v-if="event_information.data.reservedBy != storeUserData._id">{{event_information.data.reservedByData.name}}</span>
          <span v-else> {{event_information.data.hostedByData.name}} </span>
            
          </span>
          <span v-else class="appointment-title ml-2"
            >Available ({{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}})</span
          >
          <button
            @click="deleteAppointment(event_information)"
            class="remove"
            v-if="!event_information.data.reservedBy && !event_information.data.isDuplicate"
          >
            <svg
              v-if="new Date() < new Date(event_information.start_time)"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              data-reactid="1326"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>
        <div slot="popup-form" slot-scope="{ popup_information }">
          <div class="row">
            <input
              type="submit"
              class="app-button"
              id="btnSearch"
              value="Save"
              @click="addEvent(popup_information)"
            />
            <input
              type="submit"
              class="app-button"
              id="btnClearSearch"
              value="Cancel"
              @click="$kalendar.closePopups()"
            />
          </div>
        </div>
      </kalendar>
      <div v-else class="d-flex justify-content-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
  </div>
</template>
<script>
import { Kalendar } from 'kalendar-vue';
import dayjs from 'dayjs'
import axios from 'axios'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import languageLevelBars from '../../assets/scripts/languageLevelBars'
import languageCodeToText from '../../assets/scripts/languageCodeToText';
import fetchUserData from '../../assets/scripts/fetchUserData'
import imageSourceEdit from '../../assets/scripts/imageSourceEdit'
import toTitleCase from '../../assets/scripts/toTitleCase'
import formatDate from '../../assets/scripts/formatDate';
import store from '../../store/store';
dayjs.extend(utc)
dayjs.extend(timezone)

export default {
    name: 'EditCalendar',
    components: {
        Kalendar
    },
    props: {
      hostedBy: String,
    },
    computed: {
    isMobile: {
      get() {
        return store.getters.isMobile
      }
    },
    storeUserData: {
      get() {
        return store.getters.userData;
      },
      set(userData) {
        return userData;
      }
      },
    },
    mounted() {
      if (this.isMobile) {
        this.calendar_settings.view_type = 'day';
      }
      this.getScheduleData();
    },
    data() {
        return {
            userTimeZone: dayjs.tz.guess(),
            host: '/api',
            calendar_settings: {
                    style: 'material_design',
                    view_type: 'week',
                    cell_height: 10,
                    scrollToNow: false,
                    start_day: new Date().toISOString(),
                    read_only: false,
                    day_starts_at: 0,
                    day_ends_at: 24,
                    overlap: false,
                    past_event_creation: false
                },
              updateErr: false,
              deleteErr: false,
              isCalendarLoaded: false,
              isModalLoaded: false,
              events: [],
              currentDay: new Date().toISOString(),
              selectedLessonId: '',
              selectedReservedBy: null,
              selectedAppointmentData: null,
              event_information: null,
              cancellationSelect:  [
                { value: 'schedule change', text: 'Schedule change' },
                { value: 'student issue', text: 'I am uncomfortable with this student' },
              ],
              cancellationReason: 'schedule change',
              modalTitleText: 'Confirm this appointment?',
              isRejecting: false,
              isRejectingConfirmation: false,
              sessionStudentIssue: [],
              sessionScheduleChange: [],
              sessionConfirmed: [],
        }
    },
    methods: {
      languageCodeToText,
      imageSourceEdit,
      fetchUserData,
      languageLevelBars, // used to render the language bars
      onEventClassBind(startTime, eventArr) { // bind classes based on arrays
        const isEventOccuring = eventArr.find(event => event.from == startTime) != undefined;
        return isEventOccuring;
      },
      resetOnCancel() {
        this.isRejecting = false;
        this.isRejectingConfirmation = false;
        this.modalTitleText = 'Confirm this Appointment?'
        this.$bvModal.hide('update-modal');
      },
      toTitleCase,
      formatDate,
      cancelAppointment(aId) {
        this.modalTitleText = 'Are you sure you want to cancel the appointment?'
        if (this.isRejecting && this.isRejectingConfirmation) {
          axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, { status: 'cancelled', cancellationReason: this.cancellationReason.toLowerCase() }).then((res) => {
              if (res.status == 200) {
                const appointment = res.data;
                axios.get(`${this.host}/transaction/packageTransaction/${appointment.packageTransactionId}`).then((res) => {
                  if (res.status == 200) {
                    const packageTransaction = res.data;
                    axios.put(`${this.host}/transaction/packageTransaction/${appointment.packageTransactionId}`, {remainingAppointments: packageTransaction.remainingAppointments + 1 }).then(async (res) => {
                      if (res.status == 200) {
                        const userData = await fetchUserData(appointment.reservedBy)
                        const toUpdateIndex = this.events.findIndex(event => event.data._id == aId);
                        const formatedTime = {
                            from: appointment.from,
                            to: appointment.to,
                            data: {
                              from: appointment.from,
                              to: appointment.to,
                              isAppointment: true,
                              _id: appointment._id,
                              hostedBy: appointment.hostedBy,
                              reservedBy: appointment.reservedBy,
                              reservedByData: userData,
                              status: appointment.status,
                              cancellationReason: appointment.cancellationReason,
                            }
                          }

                          if (toUpdateIndex != -1) {
                            this.events[toUpdateIndex] = formatedTime;
                          }

                        this.$bvModal.hide('update-modal');
                        this.isRejecting = false;
                        this.isRejectingConfirmation = false;
                        if (this.cancellationReason.toLowerCase() == 'student issue') {
                          this.sessionStudentIssue.push(formatedTime)
                        } else {
                          this.sessionScheduleChange.push(formatedTime)
                        }
                      }
                    })
                  }
                })
              }
            }).catch((err) => { this.updateErr = true; });
        }
      },
      getEventData(aId) {
        const event = this.events.find(event => event.data._id == aId);
        return event;
      },
      confirmAppointment(aId) {
        axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, { status: 'confirmed' }).then(async (res) => {
              if (res.status == 200) {
                const toUpdateIndex = this.events.findIndex(event => event.data._id == aId);
                const formatedTime = {
                    from: res.data.from,
                    to: res.data.to,
                    data: {
                      from: res.data.from,
                      to: res.data.to,
                      isAppointment: true,
                      _id: res.data._id,
                      hostedBy: res.data.hostedBy,
                      reservedBy: res.data.reservedBy,
                      reservedByData: this.selectedReservedBy,
                      status: res.data.status,
                      cancellationReason: res.data.cancellationReason,
                    }
                  }

                  if (toUpdateIndex != -1) {
                    this.events[toUpdateIndex] = formatedTime;
                  }

                this.sessionConfirmed.push(res.data);
                this.$bvModal.hide('update-modal');
              }
            }).catch((err) => { this.updateErr = true; });
      },
      onSlotClick(event) {
        const isPast = (new Date() > new Date(event.start_time))
        if (!isPast && event.data.hostedBy == this.hostedBy) {
            if (event.data.status == 'pending' || event.data.status == 'confirmed') {
            this.selectedLessonId = event.data._id;
            this.selectedReservedBy = event.data.reservedByData;
            this.selectedAppointmentData = event.data;
            this.$bvModal.show('update-modal');
          }
        }
      },
      getScheduleData() { // get appointments and available times
        this.events = [];
        const from = dayjs().subtract(1, 'month');
        const to = dayjs().add(3, 'month');
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${from.toISOString()}/${to.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${from.toISOString()}/${to.toISOString()}`).then(async (resAppointments) => {
              if (resAppointments.status == 200) {
                const availableTimes = resAvailableTimes.data;
                const appointments = resAppointments.data;
                for (let i = 0; i < appointments.length; i++) { // add appointments
                  const formatedTime = {
                    from: appointments[i].from,
                    to: appointments[i].to,
                    data: {
                      from: appointments[i].from,
                      to: appointments[i].to,
                      isAppointment: true,
                      _id: appointments[i]._id,
                      hostedBy: appointments[i].hostedBy,
                      reservedBy: appointments[i].reservedBy,
                      reservedByData: appointments[i].packageTransactionData.reservedByData,
                      status: appointments[i].status,
                      cancellationReason: appointments[i].cancellationReason,
                      hostedByData: appointments[i].packageTransactionData.hostedByData,
                      locationData: appointments[i].locationData,
                    }
                  }
                  this.events.push(formatedTime);
                }

                for (let i = 0; i < availableTimes.length; i++) { // add available times
                  const formatedTime = {
                    from: availableTimes[i].from,
                    to: availableTimes[i].to,
                    data: {
                      isAppointment: false,
                      _id: availableTimes[i]._id,
                      hostedBy: availableTimes[i].hostedBy,
                    }
                  }
                  this.events.push(formatedTime);
                }
                this.isCalendarLoaded = true;
              }
            });
          }
      });
      },
      parseISOString(dateStr) {
          const parts = dateStr.split('T');
          return parts[1].substring(0,5)
      },
      deleteAppointment(kalendarEvent) { // used to delete an appointment when user presses the x (helper function is removeEvent)
        this.$bvModal.show('delete-modal');
        this.event_information = kalendarEvent;
      },
      removeEvent(kalendarEvent) { // makes delete request to delete appointment in db
        this.event_information = kalendarEvent;
        const deleteObj = {
            hostedBy: this.hostedBy,
            from: dayjs(kalendarEvent.start_time).toISOString(),
            to: dayjs(kalendarEvent.end_time).toISOString(),
            appointmentId: kalendarEvent.data._id,
          }

        axios.delete(`${this.host}/schedule/availableTime`, {
          data: {
            deleteObj
          }
        }).then((res) => {
          if (res.status == 200) {
            let day = kalendarEvent.start_time.slice(0, 10);
            this.$kalendar.removeEvent({
              day,
              key: kalendarEvent.key,
              id: kalendarEvent.kalendar_id,
            });
             this.deleteErr = false;
             this.$bvModal.hide('delete-modal')
          }
        }).catch((err) => {
          this.deleteErr = true;
        });
      },
      addEvent(popup_data, form_data) { // create event on client and serve (when user drags to make a slot and presses save)
        let payload = {
            from: popup_data.start_time,
            to: popup_data.end_time,
            data: {
              hostedBy: this.hostedBy,
            }
        };

        const payloadTime = new Date(payload.from);
        const currentTime = new Date(payload.to);
        const timeDiffMins = dayjs(currentTime).diff(dayjs(payloadTime), 'minutes')

        if (payloadTime <= new Date()) { // if date goes into the past
          alert('You cannot make an appointment in the past.')
        }

        else if (timeDiffMins < 30) { // appointment less than 30 mins
          alert('Your appointments must be at least 30 minutes.')
        }

        else if (timeDiffMins % 30 != 0) {
          alert('Your appointments must be in 30 minute to 1 hour intervals.')
        }

        else if (payloadTime.getMinutes() != 0 && payloadTime.getMinutes() != 30) {
          alert('You cannot start your appointments at that time (must be at the start of the hour or 30 minutes in).')
        }

        else {
          axios.post(`${this.host}/schedule/availableTime`, {
            hostedBy: this.hostedBy,
            from: new Date(payload.from).toISOString(),
            to: new Date(payload.to).toISOString(),
          }).then((res) => {
            if (res.status == 200) {
              payload.data._id = res.data._id
              this.$kalendar.addNewEvent(
                payload,
              );
              this.$kalendar.closePopups();
            }
          })
        }
      },
    },
  }
</script>

<style lang="css">
@import "../../../src/assets/css/kalendar.css";
@import "../../../src/assets/css/styles.css";
</style>
