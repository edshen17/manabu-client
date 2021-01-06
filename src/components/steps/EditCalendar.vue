<template>
  <div class="EditCalendar">
    <b-modal
      id="confirm-modal"
      title="Confirm this appointment?"
      :no-close-on-backdrop="true"
    >
      <p class="my-4" v-show="!confirmErr">
        user info goes here...
      </p>
      <p class="my-4" v-show="confirmErr">
        There was an error processing your request. Please try again.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('confirm-modal')" v-show="!confirmErr">
          <div>Cancel</div>
        </b-button>
        <b-button
          @click="confirmErr = false; $bvModal.hide('confirm-modal')"
          variant="primary"
          v-show="confirmErr"
        >
          <div>Confirm</div>
        </b-button>
        <b-button
          @click="confirmAppointment(selectedLessonId)"
          variant="primary"
          v-show="!confirmErr"
        >
          <div>Yes</div>
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
        There was an error processing your request. Please make sure you are not deleting a timeslot containing reserved lessons.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('delete-modal')" v-show="!confirmErr">
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
          @click="$bvModal.hide('delete-modal')"
          variant="primary"
          v-show="deleteErr"
        >
          <div>Yes</div>
        </b-button>
      </template>
    </b-modal>
    <div v-if="isLoaded">
      <kalendar :configuration="calendar_settings" :events.sync="events" ref="kalendar">
      <div slot="creating-card" slot-scope="{ event_information }">
        <span class="appointment-title">
          Available {{parseISOString(event_information.start_time)}}
          -
          {{parseISOString(event_information.end_time)}}
        </span>
      </div>
      <div
        slot="created-card"
        slot-scope="{ event_information }"
        class="details-card"
        :class="{'pending': event_information.data && event_information.data.status == 'pending', 
                'student-reserved': event_information.data && event_information.data.status == 'confirmed', 
        }"
        :id="event_information.data._id"
        @click="onSlotClick(event_information.data)"
      >
        <span class="appointment-title ml-2" v-if="event_information.data && !event_information.data.reservedBy">
          Available ({{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}})
        </span>
        <span class="appointment-title ml-2" v-if="event_information.data && event_information.data.reservedBy && event_information.data.status == 'confirmed'">
          Confirmed ({{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}})
        </span>
        <span class="appointment-title ml-2" v-if="event_information.data && event_information.data.reservedBy && event_information.data.status == 'pending'">
          Pending ({{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}})
        </span>
        <button @click="deleteAppointment(event_information)" class="remove" v-if="!event_information.data.reservedBy">
          <svg
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
      <div
        slot="popup-form"
        slot-scope="{ popup_information }"
      >
        <div class="row">
          <input type="submit" class="app-button" id="btnSearch" value="Save" @click="addEvent(popup_information)">
          <input type="submit" class="app-button" id="btnClearSearch" value="Cancel" @click="$kalendar.closePopups()">
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
            this.currentDay = this.$refs.kalendar._data.current_day;
            this.getWeekData(this.currentDay);
          })
          document.getElementsByClassName('week-navigator-button')[1].addEventListener('click', () => {
            this.currentDay = this.$refs.kalendar._data.current_day;
            this.getWeekData(this.currentDay);
          })
        },
      },
    mounted() {
      const lastWeeks = moment().subtract(2, 'week');
      const nextWeeks = moment().add(2, 'week');
      axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAvailableTimes) => {
        if (resAvailableTimes.status == 200) {
          axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAppointments) => {
            if (resAppointments.status == 200) {
              const availableTimes = resAvailableTimes.data;
              const appointments = resAppointments.data;
               for (let i = 0; i < appointments.length; i++) { // add appointments
                const formatedTime = {
                  from: appointments[i].from,
                  to: appointments[i].to,
                  data: {
                    isAppointment: true,
                    _id: appointments[i]._id,
                    hostedBy: appointments[i].hostedBy,
                    reservedBy: appointments[i].reservedBy,
                    status: appointments[i].status,
                  }
                }
                this.events.push(formatedTime);
              }
              
              for (let i = 0; i < availableTimes.length; i++) { // add available times
                const adjacentSlots = this.events.filter((slot) => {return slot.from == availableTimes[i].from})
                const formatedTime = {
                  from: availableTimes[i].from,
                  to: availableTimes[i].to,
                  data: {
                    isAppointment: false,
                    _id: availableTimes[i]._id,
                    hostedBy: availableTimes[i].hostedBy,
                  }
                }

                if (adjacentSlots.length != 0 && formatedTime.from != adjacentSlots[0].to) {
                  formatedTime.from = adjacentSlots[0].to;
                }
                
                this.events.push(formatedTime);
              }

              this.events.sort(function(a,b){return a.data.isAppointment-b.data.isAppointment}); // sort so appointments come first
              this.isLoaded = true;
              this.events = [...new Map(this.events.map(event => [event['from'], event])).values()] // remove any duplicates that split view in half
            }
          });
        }
      });

      setTimeout(() => {
        this.currentDayLoaded = true;
        this.currentDay = this.$refs.kalendar._data.current_day;
       }, 200);
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
              isLoaded: false,
              events: [],
              currentDayLoaded: false,
              currentDay: '',
              selectedLessonId: '',
              event_information: null,
        }
    },
    methods: {
      confirmAppointment(aId) {
        axios.put(`${this.host}/schedule/appointment/${this.selectedLessonId}`, {status: 'confirmed' }, { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then((res) => {
              const slot = document.getElementById(aId);
              if (slot) {
                slot.classList.remove('pending');
                slot.classList.add('student-reserved');
                slot.childNodes[2].innerHTML = 'Lesson confirmed'; // update span text
              }
              this.$bvModal.hide('confirm-modal')
            }).catch((err) => { this.confirmErr = true; });
      },
      onSlotClick(eventData) {
        if (eventData.status == 'pending') {
          this.selectedLessonId = eventData._id;
          this.$bvModal.show('confirm-modal');
        } else if (eventData.status == 'confirmed') {
          alert('to do')
        }
      },
      getWeekData(startDay) {
        const lastWeeks = moment(startDay).subtract(2, 'week');
        const nextWeeks = moment(startDay).add(2, 'week');
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((res) => {
          
          if (res.status == 200) {
            this.events.push(... res.data)
            this.events = [...new Map(this.events.map(event => [event['from'], event])).values()] // filter out any duplicates if user goes back and forth
            this.$refs.kalendar.kalendar_events = this.events;
          }
        });
      },
      parseISOString(dateStr) {
          const parts = dateStr.split('T');
          return parts[1].substring(0,5)
      },
      deleteAppointment(kalendarEvent) { // used to delete an appointment when user presses the x (helper funciton is removeEvent)
        this.$bvModal.show('delete-modal');
        this.event_information = kalendarEvent;
      },
      removeEvent(kalendarEvent) {
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
</style>
