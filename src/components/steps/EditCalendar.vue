<template>
  <div class="EditCalendar">
    <b-modal id="update-modal" :no-close-on-backdrop="true">
      <template #modal-title>
        {{ modalTitleText }}
      </template>
      <div class="profile-popup" v-if="selectedReservedBy">
        <img v-if="selectedReservedBy.profileImage == ''"
          class="rounded-circle center-image"
          alt="100x100"
          src='../../../src/assets/images/no-profile.webp'
        />
        <img v-else
          class="rounded-circle center-image"
          alt="100x100"
          :src="selectedReservedBy.profileImage"
        />
        <h5 class="text-center mb-2 mt-2">{{selectedReservedBy.name}}</h5>
        <div class="text-center">
          <div v-for="lang in selectedReservedBy.fluentLanguages.concat(selectedReservedBy.nonFluentLanguages)" :key="lang" class="mx-1" style="display: inline">
          {{lang}}
          <span v-for="(n, i) in 5" :key="i" class="level" :class="languageLevelBars(lang, i)"></span>       
        </div>
        <p>Region: {{selectedReservedBy.region}} ({{ selectedReservedBy.timezone }})</p> 
        </div>
        <p class="my-4" v-show="!updateErr">lesson information goes here</p>
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
        <b-button @click="resetOnCancel" v-show="!updateErr">
          Exit
        </b-button>
        <b-button variant="danger" v-show="!updateErr && !isRejecting" @click="isRejecting = true; cancelAppointment(selectedLessonId)"> Reject </b-button>
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
      :no-close-on-backdrop="true"
    >
      <p class="my-4" v-show="!deleteErr">
        Are you sure you want to delete this timeslot?
      </p>
      <p class="my-4" v-show="deleteErr">
        There was an error processing your request. Please make sure you are not
        deleting a timeslot containing reserved lessons.
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
      <kalendar v-if="isCalendarLoaded"
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
                'schedule-change': (event_information.data && event_information.data.cancellationReason == 'schedule change') || onEventClassBind(event_information.data.from, sessionScheduleChange),
                'student-issue': (event_information.data && event_information.data.cancellationReason == 'student issue') || onEventClassBind(event_information.data.from, sessionStudentIssue),
        }"
          :id="event_information.data._id"
          @click="onSlotClick(event_information)"
        >
          <span
            class="appointment-title ml-2"
            v-if="event_information.data && event_information.data.reservedBy"
          >
             {{ toTitleCase(getEventData(event_information.data._id).data.status) }} ({{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}})
          </span>
          <span
            class="appointment-title ml-2"
            v-if="event_information.data && event_information.data.reservedBy"
          >
            {{event_information.data.reservedByUserData.name}}
          </span>
          <button
            @click="deleteAppointment(event_information)"
            class="remove"
            v-if="!event_information.data.reservedBy && !event_information.data.isDuplicate"
          >
            <svg v-if="new Date() < new Date(event_information.start_time)"
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
import languageLevelBars from '../../assets/scripts/languageLevelBars'
import fetchUserData from '../../assets/scripts/fetchUserData'


export default {
    name: 'EditCalendar',
    components: {
        Kalendar
    },
    props: {
      hostedBy: String,
    },
    mounted() {
      this.getScheduleData(this.currentDay); // current date
    },
    data() {
        return {
            host: 'http://localhost:5000/api',
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
      toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      },
      recursiveSlotEdit(formatedTime) { // update available time so that it is not the same time as the lessons (avoid duplicate split on kalendar)
        const dupeTimeSlot = this.events.find(timeSlot => timeSlot.from == formatedTime.from);
        if (dupeTimeSlot) {
          formatedTime.from = dupeTimeSlot.to;
          formatedTime.data.isDuplicate = true;
          this.recursiveSlotEdit(formatedTime)
        } else {
          if (formatedTime.from != formatedTime.to) {
            this.events.push(formatedTime);
          }
        }
      },
      cancelAppointment(aId) {
        this.modalTitleText = 'Are you sure you want to reject the appointment?'
        if (this.isRejecting && this.isRejectingConfirmation) {
          axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, { status: 'cancelled', cancellationReason: this.cancellationReason.toLowerCase() }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then(async (res) => {
              if (res.status == 200) {
                const userData = await fetchUserData(res.data.reservedBy)
                const toUpdateIndex = this.events.findIndex(event => event.from != undefined && event.data.from == res.data.from);
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
                      reservedByUserData: userData,
                      status: res.data.status,
                      cancellationReason: res.data.cancellationReason,
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
            }).catch((err) => { this.updateErr = true; });
        }
      },
      getEventData(aId) {
        const event = this.events.find(event => event.data._id == aId);
        return event;
      },
      confirmAppointment(aId) {
        axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, { status: 'confirmed' }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then(async (res) => {
              if (res.status == 200) {
                const userData = await fetchUserData(res.data.reservedBy)
                const toUpdateIndex = this.events.findIndex(event => event.from != undefined && event.data.from == res.data.from);
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
                      reservedByUserData: userData,
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
        const isPast = (new Date() < new Date(event.start_time))
        if (isPast) { // ignore past events
            if (event.data.status == 'pending') {
            this.selectedLessonId = event.data._id;
            this.selectedReservedBy = event.data.reservedByUserData;
            this.$bvModal.show('update-modal');
          } else if (event.data.status == 'confirmed') {
            alert('to do')
          }
        }
      },
      getScheduleData(startDay) { // get appointments and available times
        this.events = [];
        const from = dayjs().subtract(1, 'month');
        const to = dayjs().add(3, 'month');
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${from.toISOString()}/${to.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${from.toISOString()}/${to.toISOString()}`).then(async (resAppointments) => {
              if (resAppointments.status == 200) {
                const availableTimes = resAvailableTimes.data;
                const appointments = resAppointments.data.filter(appointment => appointment.cancellationReason != 'student issue' && appointment.cancellationReason != 'student cancel');
                for (let i = 0; i < appointments.length; i++) { // add appointments
                  const userData = await fetchUserData(appointments[i].reservedBy)
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
                      reservedByUserData: userData,
                      status: appointments[i].status,
                      cancellationReason: appointments[i].cancellationReason,
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
                  this.recursiveSlotEdit(formatedTime);
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
          }

        axios.delete(`${this.host}/schedule/availableTime`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
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
          this.$kalendar.addNewEvent(
            payload,
          );
          this.$kalendar.closePopups();
          axios.post(`${this.host}/schedule/availableTime`, {
            hostedBy: this.hostedBy,
            from: new Date(payload.from).toISOString(),
            to: new Date(payload.to).toISOString(),
          }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
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
