<template>
  <div class="EditCalendar">
    <div v-if="isLoaded">
      <kalendar :configuration="calendar_settings" :events.sync="events" ref="kalendar">
      <div slot="creating-card" slot-scope="{ event_information }">
        <h5 class="appointment-title">
          Available
        </h5>
        <span class="time">
          {{parseISOString(event_information.start_time)}}
          -
          {{parseISOString(event_information.end_time)}}
        </span>
      </div>
      <div
        slot="created-card"
        slot-scope="{ event_information }"
        class="details-card"
      >
        <h5 class="appointment-title ml-2">
          Available
        </h5>
        <span class="time appointment-title ml-2"
          >{{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}}</span
        >
        <button @click="removeEvent(event_information)" class="remove">
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
      userId: String,
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
      const lastWeeks = moment().subtract(2, 'week')
      const nextWeeks = moment().add(2, 'week')
      axios.get(`${this.host}/schedule/${this.userId}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((res) => {
        if (res.status == 200) {
          this.events = res.data;
          this.isLoaded = true;
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
              isLoaded: false,
              events: [],
              currentDayLoaded: false,
              currentDay: '',
        }
    },
    methods: {
      getWeekData(startDay) {
        const lastWeeks = moment(startDay).subtract(2, 'week');
        const nextWeeks = moment(startDay).add(2, 'week');
        axios.get(`${this.host}/schedule/${this.userId}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((res) => {
          
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
      removeEvent(kalendarEvent) {
          let day = kalendarEvent.start_time.slice(0, 10);
          this.$kalendar.removeEvent({
              day,
              key: kalendarEvent.key,
              id: kalendarEvent.kalendar_id,
        })

        const deleteObj = {
            hostedBy: this.userId,
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
        });
      },
      addEvent(popup_data, form_data) {
        let payload = {
            from: popup_data.start_time,
            to: popup_data.end_time,
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
            hostedBy: this.userId,
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
.time {
  position: relative !important;
  bottom: 0;
  right: 0 !important;
}

.details-card button {
  margin: 0;
  border: none;
  color: #4c4b4b;
  position: absolute;
  padding-right: 0;
  top: 0px;
  right: 5px;
  cursor: pointer;
  background: transparent;
}

.details-card button svg {
  width: 18px;
  height: 18px;
  fill: #fff;
}

.app-button{
    width: 150px;
    margin:0 20px;
    display:inline-block;
    line-height: 30px;
}

.row {
  text-align:center;
  margin-left:-20px;
  margin-right:-20px;
}

.kalendar-wrapper.gstyle .created-event {
  width: 100% !important;
}
</style>
