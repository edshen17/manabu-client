<template>
  <div class="EditCalendar">
    <b-modal id="confirm-modal" title="Confirm this appointment?">
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
        <p>Region: {{selectedReservedBy.region}} ({{selectedReservedBy.timezone}})</p> 
        </div>
        <p class="my-4" v-show="!confirmErr">lesson information goes here</p>
      </div>
      <p class="my-4" v-show="confirmErr">
        There was an error processing your request. Please try again.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('confirm-modal')" v-show="!confirmErr">
          Cancel
        </b-button>
        <b-button variant="danger" v-show="!confirmErr"> Reject </b-button>
        <b-button
          @click="confirmErr = false; $bvModal.hide('confirm-modal')"
          variant="primary"
          v-show="confirmErr"
        >
          Confirm
        </b-button>
        <b-button
          @click="confirmAppointment(selectedLessonId)"
          variant="primary"
          v-show="!confirmErr"
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
          v-show="!confirmErr && !deleteErr"
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
    <div v-if="isCalendarLoaded">
      <kalendar
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
          :class="{'pending-teacher': event_information.data && event_information.data.status == 'pending', 
                'student-reserved': event_information.data && event_information.data.status == 'confirmed',
                'dotted-border':  event_information.data && (event_information.data.status == 'pending' || event_information.data.status == 'confirmed')
        }"
          :id="event_information.data._id"
          @click="onSlotClick(event_information.data)"
        >
          <span
            class="appointment-title ml-2"
            v-if="event_information.data && event_information.data.reservedBy"
          >
             {{toTitleCase(event_information.data.status)}} ({{ parseISOString(event_information.start_time) }} -
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
    </div>
    <div v-else class="d-flex justify-content-center my-4">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>
<script>
import { Kalendar } from 'kalendar-vue';
import moment from 'moment'
import axios from 'axios'

export default {
    name: 'EditCalendar',
    components: {
        Kalendar
    },
    props: {
      hostedBy: String,
    },
    watch: {
        'currentDayLoaded' () { // when DOM is loaded, add the below events on the arrows to get updates in date
          document.getElementsByClassName('week-navigator-button')[0].addEventListener('click', () => {
            this.onChangeWeek();
          })
          document.getElementsByClassName('week-navigator-button')[1].addEventListener('click', () => {
            this.onChangeWeek();
          })
        },
      },
    mounted() {
      this.getWeekData(this.currentDay); // current date
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
              confirmErr: false,
              deleteErr: false,
              isCalendarLoaded: false,
              isModalLoaded: false,
              events: [],
              currentDayLoaded: false,
              currentDay: new Date().toISOString(),
              selectedLessonId: '',
              selectedReservedBy: null,
              event_information: null,
              currentlyApproved: [],
        }
    },
    methods: {
      toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      },
      languageLevelBars(languageLvl, index) {
        const languageLvlArr = languageLvl.split('-');
        const level = languageLvlArr[1];
        const levelToNumber = {
          'A1': 0,
          'A2': 1,
          'B1': 2,
          'B2': 3,
          'C1': 4,
          'C2': 5
        }

        if (index >= levelToNumber[level]) {
          return { 'level-color-1': true }
        } 
        
        else {
          if (levelToNumber[level] == 'C2') return { 'level-color-3': true }
          return { 'level-color-2': true }
        }
      },
      fetchUserData(uId) {
        if (uId) {
          return axios.get(`${this.host}/user/${uId}`).catch((err) => { console.log(err) })
        }
      },
      onChangeWeek() {
        this.currentDay = this.$refs.kalendar._data.current_day;
        this.getWeekData(this.currentDay);
          setTimeout(() => { // set time out to give enough time for page refresh
            for (let i = 0; i < this.currentlyApproved.length; i++) {
              let selectedSlot = document.getElementById(this.currentlyApproved[i]);
              const formatedTimeData = this.events.find(event => event.data._id == this.currentlyApproved[i]);
              if (selectedSlot) {
                selectedSlot.classList.remove('pending-teacher');
                selectedSlot.classList.add('student-reserved');
                selectedSlot.childNodes[2].innerHTML = `Confirmed
                  (${moment(formatedTimeData.from).format("HH:mm")}
                  - ${moment(formatedTimeData.to).format("HH:mm")})`; // update span text
              }
            }
          }, 300);
      },
      recursiveSlotEdit(formatedTime) { // update available time so that it is not the same time as the lessons (avoid split on kalendar)
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
      confirmAppointment(aId) {
        axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, { status: 'confirmed' }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then((res) => {
              const slot = document.getElementById(aId);
              const formatedTimeData = this.events.find(event => event.data._id == aId);
              if (slot && formatedTimeData) {
                slot.classList.remove('pending-teacher');
                slot.classList.add('student-reserved');
                slot.childNodes[2].innerHTML = `Confirmed
                  (${moment(formatedTimeData.from).format("HH:mm")}
                  - ${moment(formatedTimeData.to).format("HH:mm")})`; // update span text
              }
              this.$bvModal.hide('confirm-modal');
              this.currentlyApproved.push(aId);
            }).catch((err) => { this.confirmErr = true; });
      },
      onSlotClick(eventData) {
        const slot = document.getElementById(eventData._id)
        const isSlotSelected = slot && slot.classList.contains('student-reserved');
        if (eventData.status == 'pending' && !isSlotSelected) {
          this.selectedLessonId = eventData._id;
          this.selectedReservedBy = eventData.reservedByUserData;
          this.$bvModal.show('confirm-modal');
        } else if (eventData.status == 'confirmed' || isSlotSelected) {
          alert('to do')
        }
      },
      getWeekData(startDay) {
        const lastWeeks = moment().subtract(2, 'week');
        const nextWeeks = moment().add(2, 'week');
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then(async (resAppointments) => {
              if (resAppointments.status == 200) {
                const availableTimes = resAvailableTimes.data;
                const appointments = resAppointments.data;
                for (let i = 0; i < appointments.length; i++) { // add appointments
                  const userData = await this.fetchUserData(appointments[i].reservedBy)
                  const formatedTime = {
                    from: appointments[i].from,
                    to: appointments[i].to,
                    data: {
                      isAppointment: true,
                      _id: appointments[i]._id,
                      hostedBy: appointments[i].hostedBy,
                      reservedBy: appointments[i].reservedBy,
                      reservedByUserData: userData.data,
                      status: appointments[i].status,
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

      setTimeout(() => {
        this.currentDayLoaded = true;
        this.currentDay = this.$refs.kalendar._data.current_day;
       }, 500);
      },
      parseISOString(dateStr) {
          const parts = dateStr.split('T');
          return parts[1].substring(0,5)
      },
      deleteAppointment(kalendarEvent) { // used to delete an appointment when user presses the x (helper funciton is removeEvent)
        this.$bvModal.show('delete-modal');
        this.event_information = kalendarEvent;
      },
      removeEvent(kalendarEvent) { // makes delete request to delete appointment in db
        this.event_information = kalendarEvent;
        const deleteObj = {
            hostedBy: this.hostedBy,
            from: moment(kalendarEvent.start_time).toISOString(),
            to: moment(kalendarEvent.end_time).toISOString(),
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
      addEvent(popup_data, form_data) {
        let payload = {
            from: popup_data.start_time,
            to: popup_data.end_time,
            data: {
              hostedBy: this.hostedBy,
            }
        };

        const payloadTime = new Date(payload.from);
        const currentTime = new Date(payload.to);
        const timeDiffMins = moment(currentTime).diff(moment(payloadTime), 'minutes')

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
